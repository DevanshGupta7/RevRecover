from html import escape

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.integrations.email.exceptions import EmailDeliveryException
from app.integrations.email.resend import ResendEmailProvider
from app.models.customer import Customer
from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase


def execute_send_email(
    db: Session,
    recovery_case: RecoveryCase,
    recovery_action: RecoveryAction,
) -> dict:
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == recovery_case.payment_id,
            Payment.organisation_id == recovery_case.organisation_id,
        )
        .first()
    )
    if payment is None:
        raise ResourceNotFoundException(
            message="Payment associated with recovery case was not found."
        )

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == payment.customer_id,
            Customer.organisation_id == recovery_case.organisation_id,
        )
        .first()
    )
    if customer is None or not customer.email:
        raise EmailDeliveryException("Customer does not have an email address.")

    failure_reason = escape(recovery_case.failure_reason or "the payment failure")
    html = (
        f"<p>Hello {escape(customer.name or 'there')},</p>"
        f"<p>We could not complete your payment because of {failure_reason}.</p>"
        "<p>Please review your payment method and try again.</p>"
    )
    message_id = ResendEmailProvider().send(
        to=customer.email,
        subject="Action needed: payment recovery",
        html=html,
    )
    return {"provider_message_id": message_id, "recipient": customer.email}
