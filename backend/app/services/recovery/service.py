from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.services.audit import record_audit_event
from app.services.recovery.actions import create_recovery_action
from app.services.recovery.ai_service import analyze_recovery_case
from app.services.recovery.constants import ACTION_HUMAN_APPROVAL, ACTION_STOP
from app.services.recovery.engine import RecoveryEngine
from app.services.recovery.policy import validate_strategy
from app.services.recovery.repository import (
    count_payment_recovery_attempts,
    get_active_policy,
    get_payment_for_organisation,
)
from app.services.recovery.strategy import RecoveryStrategy, select_strategy


class RecoveryService:
    def process_payment(self, db: Session, payment_id: UUID, organisation_id: UUID):
        payment = get_payment_for_organisation(
            db=db, payment_id=payment_id, organisation_id=organisation_id
        )

        if payment is None:
            raise ResourceNotFoundException(message="Payment not found.")

        policy = get_active_policy(db=db, organisation_id=organisation_id)

        if policy is None:
            raise ResourceNotFoundException(
                message="No active recovery policy exists for this organisation."
            )

        engine = RecoveryEngine()
        recovery_case = engine.create_case_for_payment(
            db=db,
            payment_id=payment_id,
            organisation_id=organisation_id,
            policy=policy,
        )

        if recovery_case is None:
            db.commit()
            return None

        record_audit_event(
            db,
            organisation_id,
            event_type="recovery_case_created",
            event_name="Recovery case created",
            actor="System",
            entity_type="recovery",
            entity_id=str(recovery_case.id),
            result="success",
            description="A recovery case was created for a failed payment.",
            metadata_json={"payment_id": str(payment_id)},
        )

        recovery_case.status = "analyzing"
        db.flush()

        try:
            ai_decision = analyze_recovery_case(
                db=db, payment=payment, recovery_case=recovery_case
            )
        except Exception:
            recovery_case.status = "failed"
            recovery_case.current_step = "ai_analysis"
            db.commit()
            raise

        strategy = select_strategy(
            failure_type=recovery_case.risk_type,
            recommended_action=ai_decision.recommended_action,
            recommended_delay_hours=ai_decision.recommended_delay_hours,
            requires_human_approval=False,
            allowed_channels=policy.allowed_channels or [],
        )

        record_audit_event(
            db,
            organisation_id,
            event_type="strategy_selected",
            event_name="Recovery strategy selected",
            actor="System",
            entity_type="recovery",
            entity_id=str(recovery_case.id),
            result="success",
            description="The recovery engine selected a deterministic strategy.",
            action=strategy.action_type,
            metadata_json={"failure_type": recovery_case.risk_type},
        )

        policy_validation = validate_strategy(
            policy=policy,
            strategy=strategy,
            amount=payment.amount,
            current_attempts=count_payment_recovery_attempts(
                db=db,
                payment_id=payment.id,
                organisation_id=organisation_id,
            ),
        )

        if not policy_validation.allowed:
            recovery_case.status = "stopped"
            recovery_case.current_step = "policy_validation"
            db.flush()
            db.commit()
            return recovery_case, ai_decision, None

        executable_action = strategy.action_type
        if (
            ai_decision.requires_human_approval
            or policy_validation.requires_human_approval
        ):
            strategy = RecoveryStrategy(
                action_type=ACTION_HUMAN_APPROVAL,
                delay_hours=None,
                channel=None,
                requires_human_approval=True,
                reason=(
                    "The payment requires human approval before recovery can proceed."
                ),
            )

        if strategy.action_type == ACTION_HUMAN_APPROVAL:
            recovery_case.status = "awaiting_approval"
            recovery_case.current_step = "human_approval"
        elif strategy.action_type == ACTION_STOP:
            recovery_case.status = "stopped"
            recovery_case.current_step = "policy_validation"
        else:
            recovery_case.status = "planned"
            recovery_case.current_step = "execute_recovery"

        recovery_action = create_recovery_action(
            db=db,
            recovery_case=recovery_case,
            policy=policy,
            strategy=strategy,
        )

        if (
            recovery_action is not None
            and strategy.action_type == ACTION_HUMAN_APPROVAL
        ):
            recovery_action.result_data = {
                "approved_action": executable_action,
            }

        db.commit()

        return recovery_case, ai_decision, recovery_action
