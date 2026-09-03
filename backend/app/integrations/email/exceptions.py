class EmailConfigurationException(RuntimeError):
    """Raised when email delivery is not configured."""


class EmailDeliveryException(RuntimeError):
    """Raised when the email provider rejects a message."""
