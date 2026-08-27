from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """
    Request body for creating a new RevRecover account.
    """

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )

    full_name: str = Field(
        min_length=2,
        max_length=255
    )

    organisation_name: str = Field(
        min_length=2,
        max_length=255
    )

class LoginRequest(BaseModel):
    """
    Request body for user login.
    """

    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128,
    )

class TokenResponse(BaseModel):
    """
    Authentication tokens returned after successful login.
    """

    access_token: str

    refresh_token: str

    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    """
    Request body used to obtain a new access token.
    """

    refresh_token: str = Field(
        min_length=1,
    )

class UserResponse(BaseModel):
    """
    Public representation of the authenticated user.
    """

    id: UUID

    email: EmailStr

    full_name: str

    organisation_id: UUID

    role: str
