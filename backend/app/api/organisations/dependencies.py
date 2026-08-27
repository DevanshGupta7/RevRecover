from typing import Annotated
from uuid import UUID
from fastapi import Depends

from app.api.auth.dependencies import get_current_user
from app.models.organisation_member import (
    OrganisationMember,
    OrganisationRole
)

CurrentUser = Annotated[
    tuple,
    Depends(get_current_user)
]

def get_current_membership(
    current_user: CurrentUser
) -> OrganisationMember:
    """
    Return the authenticated user's current organisation membership.
    """

    _, membership = current_user

    return membership

def get_current_organisation_id(
    current_user: CurrentUser
) -> UUID:
    """
    Return the organisation ID associated with the
    authenticated user's membership.
    """

    _, membership = current_user

    return membership.organisation_id

def require_roles(
    *allowed_roles: OrganisationRole
):
    """
    Create a dependency requiring one of the supplied roles.
    """

    def role_dependency(
        current_user: CurrentUser
    ) -> OrganisationMember:
        _, membership = current_user

        if membership.role not in allowed_roles:
            from app.core.exceptions import AuthorizationException

            raise AuthorizationException(
                message="You do not have permission to perform this action."
            )

        return membership

    return role_dependency
