from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from app.api.payments.repository import (
    count_payment_attempts,
    create_customer,
    get_customer_by_id,
    get_customer_payments,
    get_customers,
    get_payment_attempts,
    get_payment_by_id,
    get_payments,
)
from app.api.payments.schemas import CustomerCreateRequest
from app.core.exceptions import ConflictException, ResourceNotFoundException
from app.models.customer import Customer


def build_pagination(page: int, page_size: int, total: int) -> dict:
    """Build standard pagination metadata."""

    total_pages = ceil(total / page_size) if total else 0

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }


def list_payments(
    db: Session, organisation_id: UUID, page: int, page_size: int, status: str | None
):
    payments, total = get_payments(
        db=db,
        organisation_id=organisation_id,
        page=page,
        page_size=page_size,
        status=status,
    )

    return {
        "items": payments,
        "pagination": build_pagination(page=page, page_size=page_size, total=total),
    }


def get_payment(db: Session, organisation_id: UUID, payment_id: UUID):
    payment = get_payment_by_id(
        db=db, organisation_id=organisation_id, payment_id=payment_id
    )

    if not payment:
        raise ResourceNotFoundException(message="Payment not found.")

    return payment


def get_payment_detail(
    db: Session,
    organisation_id: UUID,
    payment_id: UUID,
):
    payment = get_payment(
        db=db,
        organisation_id=organisation_id,
        payment_id=payment_id,
    )

    attempt_count = count_payment_attempts(
        db=db,
        organisation_id=organisation_id,
        payment_id=payment_id,
    )

    return {
        "id": payment.id,
        "organisation_id": payment.organisation_id,
        "customer_id": payment.customer_id,
        "amount": payment.amount,
        "currency": payment.currency,
        "status": payment.status,
        "provider": payment.provider,
        "provider_payment_id": payment.provider_payment_id,
        "failure_reason": payment.failure_reason,
        "failure_code": payment.failure_code,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at,
        "attempt_count": attempt_count,
    }


def list_payment_attempts(db: Session, organisation_id: UUID, payment_id: UUID):
    payment = get_payment_by_id(
        db=db, organisation_id=organisation_id, payment_id=payment_id
    )

    if not payment:
        raise ResourceNotFoundException(message="Payment not found.")

    return get_payment_attempts(
        db=db, organisation_id=organisation_id, payment_id=payment_id
    )


def list_customers(db: Session, organisation_id: UUID, page: int, page_size: int):
    customers, total = get_customers(
        db=db, organisation_id=organisation_id, page=page, page_size=page_size
    )

    return {
        "items": customers,
        "pagination": build_pagination(page=page, page_size=page_size, total=total),
    }


def get_customer(db: Session, organisation_id: UUID, customer_id: UUID):
    customer = get_customer_by_id(
        db=db, organisation_id=organisation_id, customer_id=customer_id
    )

    if not customer:
        raise ResourceNotFoundException(message="Customer not found.")

    return customer


def list_customer_payments(
    db: Session, organisation_id: UUID, customer_id: UUID, page: int, page_size: int
):
    customer = get_customer(
        db=db, organisation_id=organisation_id, customer_id=customer_id
    )

    payments, total = get_customer_payments(
        db=db,
        organisation_id=organisation_id,
        customer_id=customer.id,
        page=page,
        page_size=page_size,
    )

    return {
        "items": payments,
        "pagination": build_pagination(page=page, page_size=page_size, total=total),
    }


def create_new_customer(
    db: Session, organisation_id: UUID, request: CustomerCreateRequest
):
    """Create an organisation-scoped customer."""

    if request.external_customer_id:
        existing = (
            db.query(Customer)
            .filter(
                Customer.organisation_id == organisation_id,
                Customer.external_customer_id == request.external_customer_id,
            )
            .first()
        )

        if existing:
            raise ConflictException(
                message=("A customer with this external customer ID already exists.")
            )

    return create_customer(
        db=db,
        organisation_id=organisation_id,
        external_customer_id=request.external_customer_id,
        name=request.name,
        email=request.email,
        phone=request.phone,
    )
