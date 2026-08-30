"""
Payment models for RevRecover.

A Payment represents the business-level payment event.
A PaymentAttempt represents an individual attempt to process
that payment.
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


class Payment(Base):
    """
    Represent a payment associated with a customer.

    A payment belongs to an organisation and customer and may have
    multiple processing attempts.
    """

    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)

    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="INR")

    status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    provider: Mapped[str] = mapped_column(
        String(50), nullable=False, default="razorpay", index=True
    )

    provider_payment_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True
    )

    failure_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)

    failure_code: Mapped[str | None] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    __table_args__ = (
        Index(
            "ix_payments_org_provider_payment",
            "organisation_id",
            "provider_payment_id",
        ),
        Index(
            "ix_payments_org_status",
            "organisation_id",
            "status",
        ),
        Index(
            "ix_payments_org_customer",
            "organisation_id",
            "customer_id",
        ),
    )


class PaymentAttempt(Base):
    """
    Represent an individual attempt to process a payment.
    """

    __tablename__ = "payment_attempts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    payment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("payments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    attempt_number: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    provider_event_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True
    )

    provider_attempt_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    failure_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)

    failure_code: Mapped[str | None] = mapped_column(String(100), nullable=True)

    attempted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    __table_args__ = (
        UniqueConstraint(
            "payment_id",
            "attempt_number",
            name="uq_payment_attempt_number",
        ),
    )
