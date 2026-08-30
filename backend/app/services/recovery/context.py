from app.models.payment import Payment
from app.models.recovery import RecoveryCase


def build_ai_context(payment: Payment, recovery_case: RecoveryCase) -> dict:
    return {
        "payment": {
            "id": str(payment.id),
            "amount": float(payment.amount),
            "currency": payment.currency,
            "status": payment.status,
            "provider": payment.provider,
            "failure_reason": payment.failure_reason,
            "failure_code": payment.failure_code,
        },
        "recovery_case": {
            "id": str(recovery_case.id),
            "risk_amount": float(recovery_case.risk_amount),
            "risk_type": recovery_case.risk_type,
            "risk_score": float(recovery_case.risk_score or 0),
            "max_attempts": recovery_case.max_attempts,
        },
    }
