import jwt
from datetime import datetime, timedelta, timezone
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.core.config import settings
from app.core.exceptions import AuthenticationException

def create_access_token(
    user_id: str,
    organisation_id: str,
    role: str
) -> str:
    """
    Create a short-lived JWT access token.

    The token identifies:
    - user
    - organisation
    - role

    The token is signed using the application's JWT secret.
    """

    now = datetime.now(timezone.utc)

    payload = {
        "sub": user_id,
        "organisation_id": organisation_id,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": now + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

def create_refresh_token(
    user_id: str
) -> str:
    """
    Create a longer-lived JWT refresh token.

    Refresh tokens are used to obtain new access tokens
    without requiring the user to log in again.
    """

    now = datetime.now(timezone.utc)

    payload = {
        "sub": user_id,
        "type": "refresh",
        "iat": now,
        "exp": now + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT token.

    Raises:
        AuthenticationException:
            If the token is expired or otherwise invalid.
    """

    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

    except ExpiredSignatureError:
        raise AuthenticationException(
            message="Invalid or expired authentication token"
        )

    except InvalidTokenError:
        raise AuthenticationException(
            message="Invalid or expired authentication token"
        )
