import logging
from decimal import Decimal
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.payment import Payment, PaymentAttempt
from app.services.audit import record_audit_event
from app.services.payment_events.parser import ParsedPaymentEvent
from app.services.payment_events.status import should_update_payment_status

logger = logging.getLogger(__name__)


def subunits_to_decimal(amount_subunits: int | None) -> Decimal:
    if amount_subunits is None:
        raise ValueError("Payment amount is missing from Razorpay event.")

    return Decimal(amount_subunits) / Decimal(100)


def get_customer_by_email(
    db: Session, *, organisation_id: UUID, email: str | None
) -> Customer | None:
    if not email:
        return None

    return (
        db.query(Customer)
        .filter(Customer.organisation_id == organisation_id, Customer.email == email)
        .first()
    )


def get_customer_by_phone(
    db: Session, *, organisation_id: UUID, phone: str | None
) -> Customer | None:
    if not phone:
        return None

    return (
        db.query(Customer)
        .filter(Customer.organisation_id == organisation_id, Customer.phone == phone)
        .first()
    )


def resolve_customer(
    db: Session, *, organisation_id: UUID, parsed_event: ParsedPaymentEvent
) -> Customer:
    customer = get_customer_by_email(
        db, organisation_id=organisation_id, email=parsed_event.customer_email
    )

    if customer:
        return customer

    customer = get_customer_by_phone(
        db, organisation_id=organisation_id, phone=parsed_event.customer_phone
    )

    if customer:
        return customer

    if not parsed_event.customer_email:
        raise ValueError("Cannot resolve customer from Razorpay payment event.")

    customer = Customer(
        organisation_id=organisation_id,
        name=parsed_event.customer_name,
        email=parsed_event.customer_email,
        phone=parsed_event.customer_phone,
        status="active",
    )

    db.add(customer)
    db.flush()

    return customer


def get_payment_by_provider_id(
    db: Session, *, organisation_id: UUID, provider: str, provider_payment_id: str
) -> Payment | None:
    return (
        db.query(Payment)
        .filter(
            Payment.organisation_id == organisation_id,
            Payment.provider == provider,
            Payment.provider_payment_id == provider_payment_id,
        )
        .first()
    )


def process_payment_event(
    db: Session, *, organisation_id: UUID, parsed_event: ParsedPaymentEvent
) -> Payment:
    payment = get_payment_by_provider_id(
        db,
        organisation_id=organisation_id,
        provider="razorpay",
        provider_payment_id=parsed_event.payment_id,
    )

    if payment is None:
        customer = resolve_customer(
            db, organisation_id=organisation_id, parsed_event=parsed_event
        )

        payment = Payment(
            organisation_id=organisation_id,
            customer_id=customer.id,
            amount=subunits_to_decimal(parsed_event.amount_subunits),
            currency=parsed_event.currency or "INR",
            status=parsed_event.payment_status or "unknown",
            provider="razorpay",
            provider_payment_id=parsed_event.payment_id,
            failure_reason=parsed_event.failure_reason,
            failure_code=parsed_event.failure_code,
        )

        db.add(payment)
        db.flush()

    else:
        if should_update_payment_status(payment.status, parsed_event.payment_status):
            payment.status = parsed_event.payment_status

        if parsed_event.failure_reason:
            payment.failure_reason = parsed_event.failure_reason

        if parsed_event.failure_code:
            payment.failure_code = parsed_event.failure_code

    existing_attempt = (
        db.query(PaymentAttempt)
        .filter(
            PaymentAttempt.payment_id == payment.id,
            or_(
                PaymentAttempt.provider_event_id == parsed_event.provider_event_id,
                PaymentAttempt.provider_attempt_id == parsed_event.payment_id,
            ),
        )
        .first()
    )

    if existing_attempt:
        return payment

    last_attempt = (
        db.query(PaymentAttempt)
        .filter(PaymentAttempt.payment_id == payment.id)
        .order_by(PaymentAttempt.attempt_number.desc())
        .first()
    )

    attempt_number = 1 if last_attempt is None else last_attempt.attempt_number + 1

    attempt = PaymentAttempt(
        payment_id=payment.id,
        attempt_number=attempt_number,
        status=parsed_event.payment_status or "unknown",
        provider_attempt_id=parsed_event.payment_id,
        provider_event_id=parsed_event.provider_event_id,
        failure_reason=parsed_event.failure_reason,
        failure_code=parsed_event.failure_code,
        attempted_at=parsed_event.provider_created_at,
    )

    db.add(attempt)
    db.flush()

    if parsed_event.payment_status == "failed":
        record_audit_event(
            db,
            organisation_id,
            event_type="payment_failed",
            event_name="Payment failed",
            actor="System",
            entity_type="payment",
            entity_id=str(payment.id),
            result="failed",
            description="A payment provider event reported a failed payment.",
            metadata_json={
                "failure_reason": parsed_event.failure_reason,
                "failure_code": parsed_event.failure_code,
            },
        )

    return payment
