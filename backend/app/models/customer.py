"""
Customer model for RevRecover.

This module defines customers belonging to merchant organisations.
Customers are the end users whose payments may require revenue
recovery.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)

class Customer(Base):
    """
    Represent a merchant's customer.

    A customer belongs to an organisation and can have multiple
    payments associated with them.
    """

    __tablename__ = "customers"

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

    external_customer_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )

    name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String(320),
        nullable=True,
        index=True
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now
    )
