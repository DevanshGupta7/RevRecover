from uuid import UUID
from sqlalchemy.orm import Session

from app.models.organisation import Organisation
from app.models.organisation_member import OrganisationMember

def get_organisation_by_id(
    db: Session,
    organisation_id: UUID
) -> Organisation | None:
    """
    Get an organisation by ID.
    """
    
    return (
        db.query(Organisation)
        .filter(
            Organisation.id == organisation_id
        )
        .first()
    )

def get_membership(
    db: Session,
    user_id: UUID,
    organisation_id: UUID
) -> OrganisationMember | None:
    """
    Get a specific user's membership in an organisation.
    """

    return (
        db.query(OrganisationMember)
        .filter(
            OrganisationMember.user_id == user_id,
            OrganisationMember.organisation_id == organisation_id
        )
        .first()
    )

def update_organisation(
    db: Session,
    organisation: Organisation
) -> Organisation:
    """
    Persist organisation changes.
    """

    db.add(organisation)
    db.commit()
    db.refresh(organisation)

    return organisation
