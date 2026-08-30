class RazorpayIntegrationException(Exception):
    """Base exception for Razorpay integration errors."""


class RazorpayConfigurationException(RazorpayIntegrationException):
    """Raised when Razorpay configuration is invalid."""


class RazorpayAPIException(RazorpayIntegrationException):
    """Raised when Razorpay API communication fails."""


class RazorpaySignatureException(RazorpayIntegrationException):
    """Raised when a Razorpay signature is invalid."""
