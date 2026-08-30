from uuid import UUID

from sqlalchemy.orm import Session

from app.models.ai_decision import AIDecision
from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase, RecoveryPolicy


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
