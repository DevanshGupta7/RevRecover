"""
Payment models for RevRecover.

This module defines payment records and individual payment attempts.
A payment represents the business-level payment event, while a
payment attempt represents an individual attempt to process that
payment.
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    Numeric,
    String
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class Payment(Base):
    """
    Represent a payment associated with a customer.

    A payment belongs to an organisation and customer and contains
    information about the payment provider, amount, currency, current
    status, and failure information.

    A single payment may have multiple payment attempts.

    Attributes:
        id: Unique UUID identifying the payment.
        organisation_id: UUID of the organisation owning the payment.
        customer_id: UUID of the customer associated with the payment.
        amount: Monetary amount of the payment.
        currency: ISO currency code, such as INR.
        status: Current payment status.
        provider: Payment provider used to process the payment.
        provider_payment_id: Payment identifier assigned by the provider.
        failure_reason: Human-readable reason for a payment failure.
        failure_code: Provider-specific failure code.
        created_at: Timestamp when the payment was created.
        updated_at: Timestamp when the payment was last updated.
    """
    
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(15, 2),
        nullable=False
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default="INR"
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="razorpay"
    )

    provider_payment_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )

    failure_reason: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    failure_code: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc)
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )

    __table_args__ = (
        Index(
            "ix_payments_org_provider_payment",
            "organisation_id",
            "provider_payment_id",
        ),
    )

class PaymentAttempt(Base):
    """
    Represent an individual attempt to process a payment.

    A payment can have multiple attempts. Tracking each attempt
    separately allows RevRecover to understand payment failure
    patterns and determine whether additional recovery attempts
    may be appropriate.

    Attributes:
        id: Unique UUID identifying the payment attempt.
        payment_id: UUID of the payment being attempted.
        attempt_number: Sequential number of this attempt.
        status: Result or current status of the attempt.
        provider_attempt_id: Provider-specific identifier for the attempt.
        failure_reason: Human-readable reason for failure.
        failure_code: Provider-specific failure code.
        attempted_at: Timestamp when the payment was attempted.
        created_at: Timestamp when the attempt record was created.
    """
    
    __tablename__ = "payment_attempts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    payment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("payments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    attempt_number: Mapped[int] = mapped_column(
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    provider_attempt_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    failure_reason: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    failure_code: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    attempted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc)
    )
