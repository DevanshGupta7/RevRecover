from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.organisations.dependencies import (
    get_current_organisation_id,
    require_roles
)
from app.api.organisations.schemas import (
    OrganisationResponse,
    OrganisationUpdateRequest
)
from app.api.organisations.service import (
    get_current_organisation,
    update_current_organisation
)
from app.db.database import get_db
from app.models.organisation_member import OrganisationRole

router = APIRouter(
    prefix="/organisations",
    tags=["Organisations"]
)

@router.get(
    "/current",
    response_model=OrganisationResponse
)
def get_current_organisation_endpoint(
    organisation_id: Annotated[
        UUID,
        Depends(get_current_organisation_id)
    ],
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Return the organisation belonging to the authenticated user.
    """

    return get_current_organisation(
        db=db,
        organisation_id=organisation_id
    )

@router.patch(
    "/current",
    response_model=OrganisationResponse
)
def update_current_organisation_endpoint(
    request: OrganisationUpdateRequest,
    organisation_id: Annotated[
        UUID,
        Depends(get_current_organisation_id)
    ],
    _: Annotated[
        object,
        Depends(
            require_roles(
                OrganisationRole.ADMIN
            )
        )
    ],
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Update the current organisation.

    Only organisation administrators can perform this action.
    """

    return update_current_organisation(
        db=db,
        organisation_id=organisation_id,
        request=request
    )
