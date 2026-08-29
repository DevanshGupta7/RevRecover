"""
Database initialization utility for RevRecover.

This module creates all currently registered SQLAlchemy tables in
the configured PostgreSQL database.

The initialization process is intentionally simple for the current
buildathon phase and uses SQLAlchemy's `Base.metadata.create_all()`.
Database migrations can be introduced later with Alembic when the
schema begins changing frequently.
"""

import logging

from app.core.exceptions import DatabaseException
from app.core.logging_config import setup_logging
from app.db.base import Base
from app.db.database import engine
from app.models import (  # noqa: F401
    Customer,
    IdempotencyKey,
    Organisation,
    OrganisationMember,
    Payment,
    PaymentAttempt,
    RecoveryAction,
    RecoveryAttempt,
    RecoveryCase,
    RecoveryPolicy,
    User,
    WebhookEvent
)

setup_logging()

logger = logging.getLogger(__name__)

def init_db():
    """
    Initialize the RevRecover database schema.

    SQLAlchemy examines all registered ORM models and creates any
    tables that do not already exist in the configured PostgreSQL
    database.

    Existing tables are not deleted or recreated.

    Raises:
        DatabaseException: If the database schema cannot be created.
    """
    
    logger.info("Starting database initialization")

    try:
        Base.metadata.create_all(bind=engine)

        logger.info("Database tables created successfully")

    except Exception as e:
        logger.exception("Database initialization failed")
        
        raise DatabaseException(
            "Failed to initialize RevRecover database."
        ) from e

if __name__ == "__main__":
    init_db()
