from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.ai_decision import AIDecision
from app.models.payment import Payment
from app.models.recovery import (
    RecoveryAction,
    RecoveryAttempt,
    RecoveryCase,
    RecoveryPolicy,
)


def get_recovery_case_by_id(
    db: Session,
    recovery_case_id: UUID,
    organisation_id: UUID,
) -> RecoveryCase | None:
    return (
        db.query(RecoveryCase)
        .filter(
            RecoveryCase.id == recovery_case_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .first()
    )


def count_successful_customer_payments(
    db: Session,
    customer_id: UUID,
    organisation_id: UUID,
) -> int:
    """
    Count successful payments made by an organisation-owned customer.
    """

    return (
        db.query(func.count(Payment.id))
        .filter(
            Payment.customer_id == customer_id,
            Payment.organisation_id == organisation_id,
            Payment.status.in_(
                [
                    "captured",
                    "paid",
                    "success",
                    "successful",
                ]
            ),
        )
        .scalar()
        or 0
    )


def count_failed_customer_payments(
    db: Session,
    customer_id: UUID,
    organisation_id: UUID,
) -> int:
    """
    Count failed payments belonging to an organisation-owned customer.
    """

    return (
        db.query(func.count(Payment.id))
        .filter(
            Payment.customer_id == customer_id,
            Payment.organisation_id == organisation_id,
            Payment.status == "failed",
        )
        .scalar()
        or 0
    )


def count_payment_recovery_attempts(
    db: Session,
    payment_id: UUID,
    organisation_id: UUID,
) -> int:
    """
    Count actual recovery attempts associated with an organisation-owned
    payment.
    """

    return (
        db.query(func.count(RecoveryAttempt.id))
        .join(
            RecoveryCase,
            RecoveryAttempt.recovery_case_id == RecoveryCase.id,
        )
        .filter(
            RecoveryCase.payment_id == payment_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .scalar()
        or 0
    )


def get_payment_for_organisation(
    db: Session, payment_id: UUID, organisation_id: UUID
) -> Payment | None:
    return (
        db.query(Payment)
        .filter(Payment.id == payment_id, Payment.organisation_id == organisation_id)
        .first()
    )


def get_active_policy(db: Session, organisation_id: UUID) -> RecoveryPolicy | None:
    return (
        db.query(RecoveryPolicy)
        .filter(
            RecoveryPolicy.organisation_id == organisation_id,
            RecoveryPolicy.is_active.is_(True),
        )
        .order_by(RecoveryPolicy.created_at.desc())
        .first()
    )


def get_recovery_case_for_payment(
    db: Session, payment_id: UUID, organisation_id: UUID
) -> RecoveryCase | None:
    return (
        db.query(RecoveryCase)
        .filter(
            RecoveryCase.payment_id == payment_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .first()
    )


def get_recovery_cases(
    db: Session, organisation_id: UUID, limit: int = 50, offset: int = 0
) -> list[RecoveryCase]:
    return (
        db.query(RecoveryCase)
        .filter(RecoveryCase.organisation_id == organisation_id)
        .order_by(RecoveryCase.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_recovery_case(
    db: Session, recovery_case_id: UUID, organisation_id: UUID
) -> RecoveryCase | None:
    return (
        db.query(RecoveryCase)
        .filter(
            RecoveryCase.id == recovery_case_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .first()
    )


def get_ai_decision(
    db: Session, recovery_case_id: UUID, organisation_id: UUID
) -> AIDecision | None:
    return (
        db.query(AIDecision)
        .filter(
            AIDecision.recovery_case_id == recovery_case_id,
            AIDecision.organisation_id == organisation_id,
        )
        .order_by(AIDecision.created_at.desc())
        .first()
    )


def get_recovery_actions(db: Session, recovery_case_id: UUID) -> list[RecoveryAction]:
    return (
        db.query(RecoveryAction)
        .filter(RecoveryAction.recovery_case_id == recovery_case_id)
        .order_by(RecoveryAction.step_number.asc())
        .all()
    )


def get_recovery_action(
    db: Session,
    recovery_action_id: UUID,
    organisation_id: UUID,
) -> RecoveryAction | None:
    return (
        db.query(RecoveryAction)
        .join(RecoveryCase, RecoveryAction.recovery_case_id == RecoveryCase.id)
        .filter(
            RecoveryAction.id == recovery_action_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .first()
    )
