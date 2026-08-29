"""
Application configuration for RevRecover.

This module defines the application's runtime settings and provides
a cached settings instance for use throughout the backend.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Store and validate RevRecover application configuration.

    Configuration values are loaded from environment variables and,
    when available, from the backend `.env` file. Pydantic validates
    the values and converts them to their declared Python types.

    Attributes:
        ENVIRONMENT: Current application environment, such as
            development, testing, or production.
        DATABASE_URL: PostgreSQL connection URL used by SQLAlchemy.
        DATABASE_POOL_SIZE: Number of persistent database connections
            maintained by the SQLAlchemy connection pool.
        DATABASE_MAX_OVERFLOW: Maximum number of additional database
            connections that may be created when the pool is exhausted.
    """

    ENVIRONMENT: str = "development"

    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"
    
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str
    RAZORPAY_ENABLED: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

@lru_cache
def get_settings() -> Settings:
    """
    Return the application's cached settings instance.

    The settings object is created only once and then reused for
    subsequent calls. This prevents repeatedly reading and parsing
    environment variables and the `.env` file.

    Returns:
        Settings: The validated RevRecover application configuration.
    """

    return Settings()

settings = get_settings()
