from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.payment import Payment, PaymentAttempt


def count_payment_attempts(db: Session, organisation_id: UUID, payment_id: UUID) -> int:
    """
    Count attempts for an organisation-owned payment.
    """

    return (
        db.query(PaymentAttempt)
        .join(Payment, Payment.id == PaymentAttempt.payment_id)
        .filter(Payment.id == payment_id, Payment.organisation_id == organisation_id)
        .count()
    )


def get_payments(
    db: Session,
    organisation_id: UUID,
    page: int,
    page_size: int,
    status: str | None = None,
):
    """
    Return organisation-scoped payments.
    """

    query = db.query(Payment).filter(Payment.organisation_id == organisation_id)

    duplicate_recovery_payment = (
        db.query(PaymentAttempt)
        .filter(
            PaymentAttempt.provider_attempt_id == Payment.provider_payment_id,
            PaymentAttempt.payment_id != Payment.id,
        )
        .exists()
    )
    query = query.filter(~duplicate_recovery_payment)

    if status:
        query = query.filter(Payment.status == status)

    total = query.with_entities(func.count(Payment.id)).scalar() or 0

    offset = (page - 1) * page_size

    payments = (
        query.order_by(Payment.created_at.desc()).offset(offset).limit(page_size).all()
    )

    return payments, total


def get_payment_by_id(
    db: Session, organisation_id: UUID, payment_id: UUID
) -> Payment | None:
    """
    Return a payment only if it belongs to the organisation.
    """

    return (
        db.query(Payment)
        .filter(Payment.id == payment_id, Payment.organisation_id == organisation_id)
        .first()
    )


def get_payment_attempts(db: Session, organisation_id: UUID, payment_id: UUID):
    """
    Return payment attempts only for an organisation-owned payment.
    """

    return (
        db.query(PaymentAttempt)
        .join(Payment, Payment.id == PaymentAttempt.payment_id)
        .filter(
            PaymentAttempt.payment_id == payment_id,
            Payment.organisation_id == organisation_id,
        )
        .order_by(PaymentAttempt.attempt_number.asc())
        .all()
    )


def get_customer_by_id(
    db: Session, organisation_id: UUID, customer_id: UUID
) -> Customer | None:
    """
    Return a customer only if it belongs to the organisation.
    """

    return (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.organisation_id == organisation_id)
        .first()
    )


def get_customers(db: Session, organisation_id: UUID, page: int, page_size: int):
    """
    Return organisation-scoped customers.
    """

    query = db.query(Customer).filter(Customer.organisation_id == organisation_id)

    total = query.with_entities(func.count(Customer.id)).scalar() or 0

    offset = (page - 1) * page_size

    customers = (
        query.order_by(Customer.created_at.desc()).offset(offset).limit(page_size).all()
    )

    return customers, total


def get_customer_payments(
    db: Session, organisation_id: UUID, customer_id: UUID, page: int, page_size: int
):
    """
    Return payments belonging to a specific organisation-owned customer.
    """

    query = db.query(Payment).filter(
        Payment.organisation_id == organisation_id, Payment.customer_id == customer_id
    )

    duplicate_recovery_payment = (
        db.query(PaymentAttempt)
        .filter(
            PaymentAttempt.provider_attempt_id == Payment.provider_payment_id,
            PaymentAttempt.payment_id != Payment.id,
        )
        .exists()
    )
    query = query.filter(~duplicate_recovery_payment)

    total = query.with_entities(func.count(Payment.id)).scalar() or 0

    offset = (page - 1) * page_size

    payments = (
        query.order_by(Payment.created_at.desc()).offset(offset).limit(page_size).all()
    )

    return payments, total


def create_customer(
    db: Session,
    organisation_id: UUID,
    external_customer_id: str | None,
    name: str | None,
    email: str | None,
    phone: str | None,
) -> Customer:
    """
    Create a customer inside an organisation.
    """

    customer = Customer(
        organisation_id=organisation_id,
        external_customer_id=external_customer_id,
        name=name,
        email=email,
        phone=phone,
        status="active",
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer
