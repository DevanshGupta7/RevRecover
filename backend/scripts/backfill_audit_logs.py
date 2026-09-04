"""Backfill audit records for business data created before audit logging."""

from app.db.database import SessionLocal
from app.models.ai_decision import AIDecision
from app.models.audit import AuditLog
from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase


def confidence_percentage(value) -> int:
    numeric_value = float(value or 0)
    percentage = numeric_value * 100 if 0 <= numeric_value <= 1 else numeric_value
    return max(0, min(100, round(percentage)))


def exists(db, event_type: str, entity_type: str, entity_id: str) -> bool:
    return (
        db.query(AuditLog.id)
        .filter(
            AuditLog.event_type == event_type,
            AuditLog.entity_type == entity_type,
            AuditLog.entity_id == entity_id,
        )
        .first()
        is not None
    )


def add_event(db, *, timestamp, **values):
    if exists(db, values["event_type"], values["entity_type"], values["entity_id"]):
        return False
    db.add(AuditLog(timestamp=timestamp, **values))
    return True


def backfill() -> int:
    db = SessionLocal()
    created = 0
    try:
        payments = db.query(Payment).all()
        for payment in payments:
            if payment.status == "failed":
                created += add_event(
                    db,
                    timestamp=payment.created_at,
                    organisation_id=payment.organisation_id,
                    event_type="payment_failed",
                    event_name="Payment failed",
                    actor="System",
                    entity_type="payment",
                    entity_id=str(payment.id),
                    result="failed",
                    description="A persisted payment record shows a failed payment.",
                    metadata_json={
                        "failure_reason": payment.failure_reason,
                        "failure_code": payment.failure_code,
                    },
                )

        cases = db.query(RecoveryCase).all()
        for case in cases:
            created += add_event(
                db,
                timestamp=case.created_at,
                organisation_id=case.organisation_id,
                event_type="recovery_case_created",
                event_name="Recovery case created",
                actor="System",
                entity_type="recovery",
                entity_id=str(case.id),
                result="success",
                description="A persisted recovery case was created for a payment.",
                metadata_json={"payment_id": str(case.payment_id)},
            )

            if case.status == "recovered":
                created += add_event(
                    db,
                    timestamp=case.recovered_at or case.updated_at,
                    organisation_id=case.organisation_id,
                    event_type="recovery_case_recovered",
                    event_name="Recovery case recovered",
                    actor="System",
                    entity_type="recovery",
                    entity_id=str(case.id),
                    result="success",
                    description="The persisted recovery case is marked recovered.",
                    action="Recovery completed",
                    metadata_json={"recovered_amount": str(case.recovered_amount or 0)},
                )

        decisions = db.query(AIDecision).all()
        for decision in decisions:
            created += add_event(
                db,
                timestamp=decision.created_at,
                organisation_id=decision.organisation_id,
                event_type="ai_decision_created",
                event_name="AI recovery decision created",
                actor="AI Agent",
                entity_type="recovery",
                entity_id=str(decision.recovery_case_id),
                result="success",
                description="An AI recovery recommendation was recorded for the case.",
                decision=decision.recommended_action,
                reason=decision.reasoning_summary,
                confidence=confidence_percentage(decision.confidence),
                action=decision.recommended_action,
                metadata_json={
                    "diagnosis": decision.diagnosis,
                    "provider": decision.provider,
                    "model": decision.model,
                },
            )

        actions = (
            db.query(RecoveryAction, RecoveryCase)
            .join(RecoveryCase, RecoveryAction.recovery_case_id == RecoveryCase.id)
            .all()
        )
        for action, case in actions:
            if action.status not in {"executed", "failed"}:
                continue
            event_type = (
                "recovery_action_executed"
                if action.status == "executed"
                else "recovery_action_failed"
            )
            created += add_event(
                db,
                timestamp=action.executed_at or action.created_at,
                organisation_id=case.organisation_id,
                event_type=event_type,
                event_name=(
                    "Recovery action executed"
                    if action.status == "executed"
                    else "Recovery action failed"
                ),
                actor="System",
                entity_type="recovery",
                entity_id=str(case.id),
                result="success" if action.status == "executed" else "failed",
                description=f"The {action.action_type} recovery action was {action.status}.",
                action=action.action_type,
                metadata_json={"recovery_action_id": str(action.id)},
            )

        db.commit()
        return created
    finally:
        db.close()


if __name__ == "__main__":
    print(f"Created {backfill()} audit events.")
