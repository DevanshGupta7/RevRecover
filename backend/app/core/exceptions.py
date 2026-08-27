"""
Custom application exceptions.

This module defines the exception hierarchy used throughout
RevRecover. Each exception represents a specific application
error and carries an HTTP status code and error code for
consistent API responses.

All custom exceptions should inherit from RevRecoverException.
"""

class RevRecoverException(Exception):
    """
    Base exception for all custom RevRecover application errors.

    This exception provides a common structure for application
    errors by storing an HTTP status code and a machine-readable
    error code along with the human-readable error message.

    Attributes:
        message: Human-readable description of the error.
        status_code: HTTP status code associated with the error.
        error_code: Machine-readable identifier used by API clients
            to determine the type of error.
    """

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR"
    ):
        """
        Initialize a RevRecover application exception.

        Args:
            message: Human-readable description of the error.
            status_code: HTTP status code that should be returned
                when the exception reaches the API layer.
            error_code: Stable machine-readable error identifier
                used in API responses.
        """
        
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

        super().__init__(message)

class ValidationException(RevRecoverException):
    """
    Raised when request or business data fails validation.
    """

    def __init__(
        self,
        message: str = "Validation failed"
    ):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR"
        )

class AuthenticationException(RevRecoverException):
    """
    Raised when authentication fails.
    """

    def __init__(
        self,
        message: str = "Authentication failed"
    ):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTH_ERROR"
        )

class AuthorizationException(RevRecoverException):
    """
    Raised when an authenticated user does not have permission.
    """

    def __init__(
        self,
        message: str = "Permission denied"
    ):
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN"
        )

class ResourceNotFoundException(RevRecoverException):
    """
    Raised when a requested resource does not exist.
    """

    def __init__(
        self,
        message: str = "Resource not found"
    ):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND"
        )

class ConflictException(RevRecoverException):
    """
    Raised when an operation conflicts with the current state
    of a resource.
    """

    def __init__(
        self,
        message: str = "Resource conflict"
    ):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT"
        )

class DatabaseException(RevRecoverException):
    """
    Raised when a database operation fails.
    """

    def __init__(
        self,
        message: str = "Database error"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR"
        )

class PaymentException(RevRecoverException):
    """
    Raised when a payment operation fails.
    """

    def __init__(
        self,
        message: str = "Payment operation failed"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="PAYMENT_ERROR"
        )

class PaymentProviderException(RevRecoverException):
    """
    Raised when a payment provider such as Razorpay
    returns an error or cannot be reached.
    """

    def __init__(
        self,
        message: str = "Payment provider error"
    ):
        super().__init__(
            message=message,
            status_code=502,
            error_code="PAYMENT_PROVIDER_ERROR"
        )

class WebhookException(RevRecoverException):
    """
    Raised when a webhook cannot be processed.
    """

    def __init__(
        self,
        message: str = "Webhook processing failed"
    ):
        super().__init__(
            message=message,
            status_code=400,
            error_code="WEBHOOK_ERROR"
        )

class IdempotencyException(RevRecoverException):
    """
    Raised when an idempotency conflict occurs.
    """

    def __init__(
        self,
        message: str = "Duplicate request"
    ):
        super().__init__(
            message=message,
            status_code=409,
            error_code="IDEMPOTENCY_ERROR"
        )

class RecoveryException(RevRecoverException):
    """
    Raised when a recovery workflow operation fails.
    """

    def __init__(
        self,
        message: str = "Recovery operation failed"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="RECOVERY_ERROR"
        )

class PolicyViolationException(RevRecoverException):
    """
    Raised when an attempted recovery action violates
    the configured recovery policy.
    """

    def __init__(
        self,
        message: str = "Recovery policy violation"
    ):
        super().__init__(
            message=message,
            status_code=403,
            error_code="POLICY_VIOLATION"
        )

class AIException(RevRecoverException):
    """
    Raised when an AI operation fails.
    """

    def __init__(
        self,
        message: str = "AI operation failed"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="AI_ERROR"
        )

class CommunicationException(RevRecoverException):
    """
    Raised when a communication operation fails.
    """

    def __init__(
        self,
        message: str = "Communication operation failed"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="COMMUNICATION_ERROR"
        )

class SecurityException(RevRecoverException):
    """
    Raised when a security-related operation fails.
    """

    def __init__(
        self,
        message: str = "Security operation failed"
    ):
        super().__init__(
            message=message,
            status_code=500,
            error_code="SECURITY_ERROR"
        )

class NotFoundException(RevRecoverException):
    """
    Raised when a requested resource does not exist.
    """

    def __init__(
        self,
        message: str = "Resource not found."
    ):
        super().__init__(
            message=message,
            status_code=404
        )
