from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.auth.dependencies import (
    get_current_user
)
from app.api.auth.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse
)
from app.api.auth.service import (
    authenticate_user,
    refresh_access_token,
    register_user
)
from app.db.database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    request: RegisterRequest,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Register a new RevRecover account.

    The first user automatically becomes
    the organisation administrator.
    """

    user, organisation, membership = register_user(
        db=db,
        email=request.email,
        password=request.password,
        full_name=request.full_name,
        organisation_name=request.organisation_name
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        organisation_id=organisation.id,
        role=membership.role.value
    )

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Authenticate an existing user and return
    access and refresh tokens.
    """

    access_token, refresh_token = authenticate_user(
        db=db,
        email=request.email,
        password=request.password
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post(
    "/refresh",
    response_model=TokenResponse
)
def refresh(
    request: RefreshRequest,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Generate a new access token using a
    valid refresh token.
    """

    access_token = refresh_access_token(
        db=db,
        refresh_token=request.refresh_token
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=request.refresh_token
    )

@router.post("/logout")
def logout():
    """
    Logout endpoint.

    For the MVP, JWT access tokens are stateless.
    The frontend removes the stored tokens.

    Server-side refresh-token revocation can be added
    later when persistent refresh-token storage is introduced.
    """

    return {
        "message": "Successfully logged out."
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: Annotated[
        tuple,
        Depends(get_current_user)
    ]
):
    """
    Return information about the currently
    authenticated user.
    """

    user, membership = current_user

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        organisation_id=membership.organisation_id,
        role=membership.role.value
    )
