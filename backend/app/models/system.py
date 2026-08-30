"""
System and infrastructure models for RevRecover.

This module contains database entities used to safely process
external events and prevent duplicate operations.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


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
        default=utc_now
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
