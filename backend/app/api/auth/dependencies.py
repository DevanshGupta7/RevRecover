from typing import Annotated
from uuid import UUID
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.api.auth.repository import (
    get_membership,
    get_user_by_id
)
from app.core.exceptions import (
    AuthenticationException,
    AuthorizationException
)
from app.core.security.jwt import decode_token
from app.db.database import get_db

oauth2_scheme = HTTPBearer()

def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(oauth2_scheme)
    ],
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Extract and validate the authenticated user
    from the JWT bearer token.

    Raises:
        AuthenticationException:
            If the JWT is invalid, missing the user ID,
            or the associated user does not exist.

        AuthorizationException:
            If the user account is inactive or the user
            does not belong to an organisation.

    Returns:
        tuple:
            The authenticated user and their organisation membership.
    """
    
    token = credentials.credentials

    try:
        payload = decode_token(token)

        user_id = payload.get("sub")

        if not user_id:
            raise AuthenticationException(
                message="Could not validate authentication credentials."
            )

        user_uuid = UUID(user_id)

    except ValueError:
        raise AuthenticationException(
            message="Could not validate authentication credentials."
        )

    user = get_user_by_id(
        db,
        user_uuid
    )

    if not user:
        raise AuthenticationException(
            message="Could not validate authentication credentials."
        )

    if not user.is_active:
        raise AuthorizationException(
            message="User account is inactive."
        )

    membership = get_membership(
        db,
        user.id
    )

    if not membership:
        raise AuthorizationException(
            message="Organisation membership not found."
        )

    return user, membership
