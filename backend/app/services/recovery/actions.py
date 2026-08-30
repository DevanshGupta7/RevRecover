import logging

from sqlalchemy.orm import Session

from app.core.exceptions import PolicyViolationException
from app.models.recovery import RecoveryAction, RecoveryCase, RecoveryPolicy
from app.services.recovery.constants import ALLOWED_AI_ACTIONS
from app.services.recovery.policy import (
    action_allowed_by_policy,
    requires_human_approval,
)

logger = logging.getLogger(__name__)


def create_recovery_action(
    db: Session,
    recovery_case: RecoveryCase,
    policy: RecoveryPolicy,
    recommended_action: str,
) -> RecoveryAction:
    action = recommended_action.strip().upper()

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

    status = "awaiting_approval" if needs_approval else "planned"

    recovery_action = RecoveryAction(
        recovery_case_id=recovery_case.id,
        action_type=action,
        status=status,
        step_number=1,
    )

    db.add(recovery_action)

    recovery_case.status = "awaiting_approval" if needs_approval else "planned"
    recovery_case.current_step = (
        "human_approval" if needs_approval else "execute_recovery"
    )

    db.flush()

    logger.info(
        "Recovery action created | case_id=%s action=%s status=%s",
        recovery_case.id,
        action,
        status,
    )

    return recovery_action
