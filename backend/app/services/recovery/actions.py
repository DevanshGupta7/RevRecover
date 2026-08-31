import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import PolicyViolationException
from app.models.recovery import RecoveryAction, RecoveryCase, RecoveryPolicy
from app.services.recovery.constants import (
    ACTION_HUMAN_APPROVAL,
    ACTION_STOP,
    ALLOWED_AI_ACTIONS,
)
from app.services.recovery.policy import (
    action_allowed_by_policy,
    requires_human_approval,
)
from app.services.recovery.strategy import RecoveryStrategy

logger = logging.getLogger(__name__)


def create_recovery_action(
    db: Session,
    recovery_case: RecoveryCase,
    policy: RecoveryPolicy,
    recommended_action: str | None = None,
    strategy: RecoveryStrategy | None = None,
) -> RecoveryAction | None:
    action_strategy = strategy

    if action_strategy is None:
        action = (recommended_action or "").strip().upper()
        if action not in ALLOWED_AI_ACTIONS:
            raise PolicyViolationException(
                message="AI recommended an unsupported recovery action."
            )

        if (
            policy.max_recovery_amount is not None
            and recovery_case.risk_amount > policy.max_recovery_amount
        ):
            raise PolicyViolationException(
                message="Payment amount exceeds the maximum recovery amount."
            )

        if not action_allowed_by_policy(policy=policy, action=action):
            raise PolicyViolationException(
                message=f"Recovery policy does not allow action: {action}"
            )

        needs_approval = requires_human_approval(
            policy=policy, amount=recovery_case.risk_amount
        )
        action_strategy = RecoveryStrategy(
            action_type=ACTION_HUMAN_APPROVAL if needs_approval else action,
            delay_hours=None,
            channel=None,
            requires_human_approval=needs_approval,
            reason="Legacy action conversion for recovery planning.",
        )
    if action_strategy.action_type == ACTION_STOP:
        recovery_case.status = "stopped"
        recovery_case.current_step = "policy_validation"
        db.flush()
        return None

    if action_strategy.action_type == ACTION_HUMAN_APPROVAL:
        recovery_case.status = "awaiting_approval"
        recovery_case.current_step = "human_approval"
        action_status = "planned"
    else:
        recovery_case.status = "planned"
        recovery_case.current_step = "execute_recovery"
        action_status = "planned"

    now = datetime.now(timezone.utc)
    planned_at = now + timedelta(hours=action_strategy.delay_hours or 0)

    recovery_action = RecoveryAction(
        recovery_case_id=recovery_case.id,
        action_type=action_strategy.action_type,
        status=action_status,
        step_number=1,
        planned_at=planned_at,
    )

    db.add(recovery_action)
    db.flush()

    logger.info(
        "Recovery action created | case_id=%s action=%s status=%s",
        recovery_case.id,
        action_strategy.action_type,
        action_status,
    )

    return recovery_action
