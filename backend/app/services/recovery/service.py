from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.services.recovery.actions import create_recovery_action
from app.services.recovery.ai_service import analyze_recovery_case
from app.services.recovery.engine import RecoveryEngine
from app.services.recovery.repository import (
    get_active_policy,
    get_payment_for_organisation,
)


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

        recovery_action = create_recovery_action(
            db=db,
            recovery_case=recovery_case,
            policy=policy,
            recommended_action=ai_decision.recommended_action,
        )

        db.commit()

        return recovery_case, ai_decision, recovery_action
