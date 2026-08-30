"""
Webhook event model for RevRecover.

Stores verified webhook deliveries received from external
payment providers such as Razorpay.

Webhook events are separate from business entities such as
Payment because the same business entity can generate multiple
events.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


class WebhookEvent(Base):
    """
    Represent a webhook event received from a payment provider.

    A webhook event is immutable input received from an external
    provider. Its processing state can change independently of
    the provider payload.
    """

    __tablename__ = "webhook_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "organisations.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="razorpay",
        index=True
    )

    provider_event_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    provider_account_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )

    event_type: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="received",
        index=True
    )

    payload: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False
    )

    signature: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    provider_created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now
    )

    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now
    )

    __table_args__ = (
        UniqueConstraint(
            "provider",
            "provider_event_id",
            name="uq_webhook_provider_event",
        ),
        Index(
            "ix_webhook_events_org_event",
            "organisation_id",
            "event_type",
        ),
    )
