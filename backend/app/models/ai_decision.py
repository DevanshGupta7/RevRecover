"""
AI decision model for RevRecover.

Stores structured AI recommendations associated with recovery cases.
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AIDecision(Base):
    """
    Store a structured AI recommendation for a recovery case.

    The AI recommendation is advisory. It must be validated by
    RevRecover's deterministic recovery and policy engines before
    an action is executed.
    """

    __tablename__ = "ai_decisions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "organisations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    recovery_case_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "recovery_cases.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="openai",
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    diagnosis: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    recommended_action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    recommended_delay_hours: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    confidence: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
    )

    reasoning_summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    requires_human_approval: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    input_context: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    raw_output: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
