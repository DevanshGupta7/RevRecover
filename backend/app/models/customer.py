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

class Customer(Base):
    """
    Represent a merchant's customer.

    A customer belongs to an organisation and can have multiple
    payments associated with them. This entity represents the
    merchant's customer rather than a RevRecover platform user.

    Attributes:
        id: Unique UUID identifying the customer.
        organisation_id: UUID of the organisation that owns the customer.
        external_customer_id: Customer identifier from the merchant's
            payment system or external platform.
        name: Customer's display name.
        email: Customer's email address.
        phone: Customer's phone number.
        status: Current customer status.
        created_at: Timestamp when the customer record was created.
        updated_at: Timestamp when the customer record was last updated.
    """
    
    __tablename__ = "customers"
    
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
        default="active"
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
