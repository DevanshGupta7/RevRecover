"""
RevRecover Backend Application Entry Point.

This module creates and configures the main FastAPI application
used by the RevRecover backend.

The application instance defined here is used by the ASGI server
such as Uvicorn to start and serve the API.

It also configures application-wide logging and registers the
global handler for custom RevRecover application exceptions.
"""

import logging

from fastapi import FastAPI

from app.api.auth.router import router as auth_router
from app.api.organisations.router import router as organisations_router
from app.api.payments.router import router as payments_router
from app.api.recovery.router import router as recovery_router
from app.api.webhooks.razorpay import router as razorpay_webhook_router
from app.core.exceptions import RevRecoverException
from app.core.handlers import revrecover_exception_handler
from app.core.logging_config import setup_logging

setup_logging()

logger = logging.getLogger(__name__)

app = FastAPI(title="RevRecover")

app.add_exception_handler(RevRecoverException, revrecover_exception_handler)

app.include_router(auth_router)

app.include_router(organisations_router)

app.include_router(payments_router)

app.include_router(recovery_router)

app.include_router(razorpay_webhook_router)


@app.get("/health")
def health_check():
    """
    Check whether the RevRecover backend is running.

    This endpoint provides a lightweight health check that can be
    used by deployment platforms, load balancers, monitoring systems,
    automated tests, and developers to verify that the API is
    available and responding to HTTP requests.

    The endpoint does not perform database or external-service
    checks at this stage. It only confirms that the FastAPI
    application is running and able to process requests.

    Returns:
        dict[str, str]: A JSON-compatible response containing the
            current service health status, service name, and a
            human-readable status message.
    """

    logger.info("Health check requested")

    return {
        "status": "healthy",
        "service": "RevRecover API",
        "message": "RevRecover backend is running successfully.",
    }
