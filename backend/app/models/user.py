"""
User model for RevRecover.

A user represents a person who accesses the RevRecover
platform. Users belong to organisations through the
OrganisationMember model.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


class User(Base):
    """
    Represent a RevRecover platform user.

    A user is different from a Customer. Customers are the
    merchant's end customers, while users are people who
    operate the RevRecover platform.

    Attributes:
        id: Unique UUID identifying the user.
        email: Unique email address used for authentication.
        full_name: User's display name.
        password_hash: Argon2id password hash.
        is_active: Whether the user is allowed to authenticate.
        created_at: Timestamp when the user was created.
        updated_at: Timestamp when the user was last updated.
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
        unique=True,
        index=True
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
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
