from uuid import UUID

from sqlalchemy.orm import Session

from app.api.organisations.repository import get_organisation_by_id, update_organisation
from app.api.organisations.schemas import OrganisationUpdateRequest
from app.core.exceptions import NotFoundException


def get_current_organisation(
    db: Session,
    organisation_id: UUID
):
    """
    Return the organisation belonging to the current user.
    """

    organisation = get_organisation_by_id(
        db=db,
        organisation_id=organisation_id
    )

    if not organisation:
        raise NotFoundException(
            message="Organisation not found."
        )

    return organisation

def update_current_organisation(
    db: Session,
    organisation_id: UUID,
    request: OrganisationUpdateRequest
):
    """
    Update the current organisation.
    """

    organisation = get_current_organisation(
        db=db,
        organisation_id=organisation_id
    )

    if request.name is not None:
        organisation.name = request.name.strip()
        
    if request.razorpay_account_id is not None:
        organisation.razorpay_account_id = request.razorpay_account_id.strip()

    return update_organisation(
        db=db,
        organisation=organisation
    )
