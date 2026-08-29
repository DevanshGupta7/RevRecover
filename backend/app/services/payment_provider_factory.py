from functools import lru_cache

from app.integrations.razorpay.client import RazorpayClient
from app.integrations.razorpay.service import RazorpayService
from app.services.payment_provider import PaymentProvider


@lru_cache
def get_payment_provider() -> PaymentProvider:
    """
    Return the configured payment provider.
    """

    return RazorpayService(
        client=RazorpayClient()
    )
