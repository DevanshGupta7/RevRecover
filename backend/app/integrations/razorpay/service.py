from typing import Any

from app.integrations.razorpay.client import RazorpayClient
from app.integrations.razorpay.exceptions import (
    RazorpayAPIException,
    RazorpaySignatureException,
)
from app.services.payment_provider import PaymentProvider


class RazorpayService(PaymentProvider):
    """
    Service responsible for communication with Razorpay.
    """

    def __init__(self, client: RazorpayClient) -> None:
        self.client = client

    def fetch_payment(self, provider_payment_id: str) -> dict[str, Any]:
        """
        Fetch a payment from Razorpay.
        """

        try:
            return self.client.client.payment.fetch(provider_payment_id)

        except Exception as exc:
            raise RazorpayAPIException(
                "Failed to fetch payment from Razorpay."
            ) from exc

    def verify_payment_signature(
        self, order_id: str, payment_id: str, signature: str
    ) -> None:
        """
        Verify the signature returned by Razorpay Checkout.
        """

        try:
            self.client.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": order_id,
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature,
                }
            )

        except Exception as exc:
            raise RazorpaySignatureException(
                "Razorpay payment signature verification failed."
            ) from exc

    def create_payment_link(
        self,
        *,
        amount: int,
        currency: str,
        reference_id: str,
        description: str,
        customer_name: str | None = None,
        customer_email: str | None = None,
        customer_contact: str | None = None,
    ) -> dict[str, Any]:
        """
        Create a Razorpay Payment Link.

        Amount must be in the smallest currency unit.
        """

        payload: dict[str, Any] = {
            "amount": amount,
            "currency": currency,
            "accept_partial": False,
            "reference_id": reference_id,
            "description": description,
            "notify": {"sms": False, "email": False},
        }

        customer = {}

        if customer_name:
            customer["name"] = customer_name

        if customer_email:
            customer["email"] = customer_email

        if customer_contact:
            customer["contact"] = customer_contact

        if customer:
            payload["customer"] = customer

        try:
            return self.client.client.payment_link.create(data=payload)

        except Exception as exc:
            raise RazorpayAPIException(
                "Failed to create Razorpay Payment Link."
            ) from exc
