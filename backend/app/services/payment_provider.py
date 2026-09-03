from abc import ABC, abstractmethod
from typing import Any


class PaymentProvider(ABC):
    """
    Abstract payment provider interface.

    RevRecover business logic should depend on this abstraction,
    not directly on Razorpay.
    """

    @abstractmethod
    def fetch_payment(self, provider_payment_id: str) -> dict[str, Any]:
        """Fetch a provider payment."""

    @abstractmethod
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
        """Create a payment link."""

    @abstractmethod
    def create_order(
        self,
        *,
        amount: int,
        currency: str,
        receipt: str,
    ) -> dict[str, Any]:
        """Create a Razorpay order for a retry attempt."""

    @abstractmethod
    def verify_payment_signature(
        self, order_id: str, payment_id: str, signature: str
    ) -> None:
        """Verify a Checkout payment signature."""
