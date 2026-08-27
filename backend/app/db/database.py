"""
Database engine and session management for RevRecover.

This module creates the SQLAlchemy database engine and provides a
database session factory for interacting with PostgreSQL.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False
)

def get_db() -> Generator[Session, None, None]:
    """
    Provide a SQLAlchemy database session.

    A new database session is created for each request or operation
    that depends on this generator. The session is automatically
    closed after the operation finishes, including when an exception
    occurs.

    Yields:
        Session: An active SQLAlchemy database session.

    Note:
        This generator is intended to be used with FastAPI's
        dependency injection system.
    """
    
    db = SessionLocal()
    
    try:
        yield db
    finally:
        db.close()
