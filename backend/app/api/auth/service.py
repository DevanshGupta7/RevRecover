from sqlalchemy.orm import Session
import logging

from app.models.organisation_member import OrganisationRole
from app.api.auth.repository import (
    create_membership,
    create_organisation,
    create_user,
    get_membership,
    get_user_by_email,
    get_user_by_id
)
from app.core.exceptions import (
    AuthenticationException,
    AuthorizationException,
    ConflictException
)
from app.core.security.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.security.password import (
    hash_password,
    verify_password
)

logger = logging.getLogger(__name__)

def register_user(
    db: Session,
    email: str,
    password: str,
    full_name: str,
    organisation_name: str
):
    """
    Register a new RevRecover user.

    The first user of an organisation automatically
    receives the ADMIN role.

    Args:
        db: SQLAlchemy database session.
        email: Email address of the new user.
        password: Plain-text password supplied during registration.
        full_name: Full name of the new user.
        organisation_name: Name of the organisation to create.

    Raises:
        ConflictException:
            If an account with the email already exists.

    Returns:
        tuple:
            The created user, organisation, and membership.
    """

    existing_user = get_user_by_email(
        db,
        email
    )

    if existing_user:
        logger.warning(
            "Registration attempt with existing email"
        )

        raise ConflictException(
            message="An account with this email already exists."
        )

    password_hash = hash_password(password)

    user = create_user(
        db=db,
        email=email,
        full_name=full_name,
        password_hash=password_hash
    )

    organisation = create_organisation(
        db=db,
        name=organisation_name
    )

    membership = create_membership(
        db=db,
        user_id=user.id,
        organisation_id=organisation.id,
        role=OrganisationRole.ADMIN
    )

    db.commit()

    logger.info(
        "User registered successfully | user_id=%s organisation_id=%s",
        user.id,
        organisation.id
    )

    return user, organisation, membership

def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    """
    Authenticate a user using email and password.

    Raises:
        AuthenticationException:
            If the email or password is invalid.

        AuthorizationException:
            If the user does not belong to an organisation.

    Returns:
        tuple:
            Access token and refresh token.
    """

    user = get_user_by_email(
        db,
        email
    )

    if not user:
        logger.warning(
            "Authentication failed: invalid credentials"
        )

        raise AuthenticationException(
            message="Invalid email or password."
        )

    if not verify_password(
        password,
        user.password_hash
    ):
        logger.warning(
            "Authentication failed: invalid credentials"
        )

        raise AuthenticationException(
            message="Invalid email or password."
        )

    membership = get_membership(
        db,
        user.id
    )

    if not membership:
        logger.warning(
            "Authentication failed: organisation membership missing | user_id=%s",
            user.id
        )

        raise AuthorizationException(
            message="User is not associated with an organisation."
        )

    access_token = create_access_token(
        user_id=str(user.id),
        organisation_id=str(
            membership.organisation_id
        ),
        role=membership.role
    )

    refresh_token = create_refresh_token(
        user_id=str(user.id)
    )

    logger.info(
        "User authenticated successfully | user_id=%s organisation_id=%s",
        user.id,
        membership.organisation_id
    )

    return access_token, refresh_token

def refresh_access_token(
    db: Session,
    refresh_token: str
):
    """
    Validate a refresh token and create a new access token.

    Raises:
        AuthenticationException:
            If the refresh token is invalid, expired, malformed,
            or does not contain the required claims.

        AuthorizationException:
            If the user does not belong to an organisation.

    Returns:
        str:
            A newly generated access token.
    """

    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        logger.warning(
            "Refresh token rejected: incorrect token type"
        )

        raise AuthenticationException(
            message="Invalid refresh token."
        )

    user_id = payload.get("sub")

    if not user_id:
        logger.warning(
            "Refresh token rejected: missing subject"
        )

        raise AuthenticationException(
            message="Invalid refresh token."
        )

    user = get_user_by_id(
        db,
        user_id
    )

    if not user or not user.is_active:
        logger.warning(
            "Refresh token rejected: inactive or missing user | user_id=%s",
            user_id
        )

        raise AuthenticationException(
            message="User is inactive or does not exist."
        )

    membership = get_membership(
        db,
        user.id
    )

    if not membership:
        logger.warning(
            "Refresh token rejected: organisation membership missing | user_id=%s",
            user.id
        )

        raise AuthorizationException(
            message="Organisation membership not found."
        )

    access_token = create_access_token(
        user_id=str(user.id),
        organisation_id=str(
            membership.organisation_id
        ),
        role=membership.role
    )

    logger.info(
        "Access token refreshed successfully | user_id=%s",
        user.id
    )

    return access_token
