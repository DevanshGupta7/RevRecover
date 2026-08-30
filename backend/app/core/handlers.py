"""
Exception handlers for RevRecover.

Converts application exceptions into consistent
JSON API responses.
"""

import logging

from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import RevRecoverException

logger = logging.getLogger(__name__)


async def revrecover_exception_handler(
    request: Request, exc: RevRecoverException
) -> JSONResponse:
    """
    Handle a custom RevRecover application exception.

    The exception is logged with request context and converted into
    a consistent JSON API response containing the HTTP status code,
    machine-readable error code, and human-readable error message.

    Args:
        request: FastAPI request associated with the exception.
        exc: RevRecover application exception that was raised.

    Returns:
        JSONResponse: JSON response containing the application error
        details and the HTTP status code defined by the exception.

    Response format:
        {
            "success": False,
            "error": {
                "code": "...",
                "message": "..."
            }
        }
    """

    logger.warning(
        "Application error | method=%s path=%s code=%s message=%s",
        request.method,
        request.url.path,
        exc.error_code,
        exc.message,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {"code": exc.error_code, "message": exc.message},
        },
    )
