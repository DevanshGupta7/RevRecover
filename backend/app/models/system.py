"""
System and infrastructure models for RevRecover.

This module contains database entities used to safely process
external events and prevent duplicate operations.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class WebhookEvent(Base):
    """
    Store an incoming webhook event from an external provider.

    Webhook events provide a durable record of external notifications,
    such as Razorpay payment events. Storing the original payload and
    processing status allows RevRecover to safely process, retry,
    and debug webhook handling.

    Attributes:
        id: Unique UUID identifying the stored webhook event.
        organisation_id: UUID of the associated organisation, when known.
        provider: External provider that generated the event.
        event_type: Type of webhook event received.
        provider_event_id: Provider-generated event identifier.
        payload: Original webhook payload stored as JSON.
        status: Current processing status of the event.
        received_at: Timestamp when the event was received.
        processed_at: Timestamp when processing completed.
        error_message: Error information if processing failed.
    """
    
    __tablename__ = "webhook_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    organisation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="razorpay"
    )

    event_type: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    provider_event_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )

    payload: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="received",
        index=True
    )

    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc)
    )

    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    __table_args__ = (
        UniqueConstraint(
            "provider",
            "provider_event_id",
            name="uq_webhook_provider_event",
        ),
    )

class IdempotencyKey(Base):
    """
    Track processed operations to prevent duplicate execution.

    Idempotency is especially important for payment and webhook
    processing because external providers may send the same event
    multiple times.

    An idempotency key allows RevRecover to recognize an operation
    that has already been processed and avoid performing it again.

    Attributes:
        id: Unique UUID identifying the idempotency record.
        organisation_id: UUID of the organisation associated with the operation.
        key: Unique idempotency key supplied by the caller or provider.
        resource_type: Type of resource associated with the operation.
        resource_id: Identifier of the affected resource, when available.
        created_at: Timestamp when the key was recorded.
        expires_at: Timestamp after which the key may no longer be valid.
    """
    
    __tablename__ = "idempotency_keys"

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

    key: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    resource_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    resource_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now(timezone.utc)
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    __table_args__ = (
        UniqueConstraint(
            "organisation_id",
            "key",
            name="uq_idempotency_organisation_key",
        ),
    )
