from dataclasses import dataclass
from uuid import UUID

from app.models.payment import Payment, PaymentAttempt


@dataclass(frozen=True)
class PaymentFailedEvent:
    """
    Internal RevRecover domain event.

    Emitted after a failed payment has been synchronized
    from the provider.
    """

    organisation_id: UUID
    payment_id: UUID
    customer_id: UUID
    payment_attempt_id: UUID
    amount: str
    currency: str
    failure_reason: str | None
    failure_code: str | None


def create_payment_failed_event(
    *,
    organisation_id: UUID,
    payment: Payment,
    attempt: PaymentAttempt,
) -> PaymentFailedEvent:
    return PaymentFailedEvent(
        organisation_id=organisation_id,
        payment_id=payment.id,
        customer_id=payment.customer_id,
        payment_attempt_id=attempt.id,
        amount=str(payment.amount),
        currency=payment.currency,
        failure_reason=attempt.failure_reason,
        failure_code=attempt.failure_code,
    )
