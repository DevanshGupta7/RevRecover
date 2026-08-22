"""
Base SQLAlchemy configuration for RevRecover database models.
"""

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Base class for all RevRecover SQLAlchemy ORM models.

    All database model classes inherit from this class. SQLAlchemy uses
    the metadata associated with this base class to keep track of the
    application's database tables, columns, indexes, and constraints.

    The metadata is also used by the database initialization process
    to create the required tables in PostgreSQL.
    """

    pass
