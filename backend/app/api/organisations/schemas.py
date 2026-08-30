from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OrganisationResponse(BaseModel):
    """Public organisation information."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    status: str
    razorpay_account_id: str | None
    created_at: datetime
    updated_at: datetime

class OrganisationUpdateRequest(BaseModel):
    """Fields that can be updated by an authorised user."""

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255
    )
    
    razorpay_account_id: str | None = Field(
        default=None,
        max_length=100
    )

class OrganisationMemberResponse(BaseModel):
    """Organisation membership information."""

    user_id: UUID
    organisation_id: UUID
    role: str
    created_at: datetime
