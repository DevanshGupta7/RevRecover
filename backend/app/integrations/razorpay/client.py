import razorpay

from app.core.config import settings
from app.integrations.razorpay.exceptions import RazorpayConfigurationException


class RazorpayClient:
    """
    Application wrapper around the Razorpay SDK.

    Razorpay credentials remain inside the backend.
    """

    def __init__(self) -> None:
        if not settings.RAZORPAY_ENABLED:
            raise RazorpayConfigurationException(
                "Razorpay integration is disabled."
            )

        if not settings.RAZORPAY_KEY_ID:
            raise RazorpayConfigurationException(
                "RAZORPAY_KEY_ID is not configured."
            )

        if not settings.RAZORPAY_KEY_SECRET:
            raise RazorpayConfigurationException(
                "RAZORPAY_KEY_SECRET is not configured."
            )

        self.client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        self.client.enable_retry(True)
