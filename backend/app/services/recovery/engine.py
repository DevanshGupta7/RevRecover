import logging
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.recovery import RecoveryCase
from app.services.recovery.eligibility import (
    calculate_risk_score,
    determine_eligibility,
)
from app.services.recovery.repository import (
    get_active_policy,
    get_payment_for_organisation,
    get_recovery_case_for_payment,
)

logger = logging.getLogger(__name__)


class RecoveryEngine:
    def create_case_for_payment(
        self, db: Session, payment_id: UUID, organisation_id: UUID
    ) -> RecoveryCase | None:
        payment = get_payment_for_organisation(
            db=db, payment_id=payment_id, organisation_id=organisation_id
        )

        if payment is None:
            return None

        existing_case = get_recovery_case_for_payment(
            db=db, payment_id=payment.id, organisation_id=organisation_id
        )

        if existing_case:
            return existing_case

        eligible, reason = determine_eligibility(payment)

        if not eligible:
            logger.info(
                "Payment not eligible for recovery | payment_id=%s reason=%s",
                payment.id,
                reason,
            )
            return None

        policy = get_active_policy(db=db, organisation_id=organisation_id)

        max_attempts = policy.max_attempts if policy else 3
        risk_score = calculate_risk_score(payment)

        recovery_case = RecoveryCase(
            organisation_id=organisation_id,
            customer_id=payment.customer_id,
            payment_id=payment.id,
            policy_id=policy.id if policy else None,
            risk_amount=payment.amount,
            risk_type="payment_failure",
            failure_reason=payment.failure_reason,
            failure_code=payment.failure_code,
            risk_score=risk_score,
            recovery_probability=None,
            status="detected",
            current_step="analysis",
            max_attempts=max_attempts,
        )

        db.add(recovery_case)
        db.flush()

        logger.info(
            "Recovery case created | case_id=%s payment_id=%s",
            recovery_case.id,
            payment.id,
        )

        return recovery_case
