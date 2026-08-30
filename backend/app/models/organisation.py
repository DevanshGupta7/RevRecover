"""
Organisation model for RevRecover.

An organisation represents a business or merchant using the
RevRecover revenue recovery platform.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


class Organisation(Base):
    """
    Represent a merchant organisation using RevRecover.

    An organisation is the top-level tenant in the RevRecover
    database. Customers, payments, recovery policies, webhook
    events, and other business data are associated with an
    organisation.
    """

    __tablename__ = "organisations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    razorpay_account_id: Mapped[str | None] = mapped_column(
        String(100), nullable=True, unique=True, index=True
    )

    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="active", index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )
