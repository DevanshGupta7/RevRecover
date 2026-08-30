"""
Organisation membership model for RevRecover.

This module defines the relationship between RevRecover
users and merchant organisations.
"""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


class OrganisationRole(str, enum.Enum):
    """
    Roles available to users inside an organisation.
    """

    ADMIN = "admin"
    FINANCE_MANAGER = "finance_manager"
    RECOVERY_AGENT = "recovery_agent"
    VIEWER = "viewer"


class OrganisationMember(Base):
    """
    Represent a user's membership in an organisation.

    The role stored here determines what the user can
    do within that organisation.
    """

    __tablename__ = "organisation_members"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[OrganisationRole] = mapped_column(
        Enum(OrganisationRole), nullable=False, default=OrganisationRole.ADMIN
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "organisation_id",
            name="uq_user_organisation_membership",
        ),
    )
