"""
Razorpay webhook payload parsing.

This module extracts provider-independent information from
Razorpay webhook payloads. It does not modify the database.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass(frozen=True)
class ParsedPaymentEvent:
    """
    Normalized information extracted from a Razorpay payment event.
    """

    event_type: str
    provider_event_id: str
    provider_account_id: str | None
    
    reference_id: str | None

    payment_id: str | None
    order_id: str | None

    amount_subunits: int | None
    currency: str | None
    payment_status: str | None

    failure_reason: str | None
    failure_code: str | None

    provider_created_at: datetime | None

    customer_name: str | None
    customer_email: str | None
    customer_phone: str | None
    
@dataclass(frozen=True)
class ParsedPaymentLinkEvent:
    event_type: str
    provider_event_id: str
    provider_account_id: str | None

    payment_link_id: str
    reference_id: str | None

    payment_id: str | None
    amount_subunits: int | None
    currency: str | None

    provider_created_at: datetime | None


SUPPORTED_PAYMENT_EVENTS = {
    "payment.authorized",
    "payment.captured",
    "payment.failed",
}


def parse_provider_timestamp(timestamp: Any) -> datetime | None:
    """
    Convert a Unix timestamp to an aware UTC datetime.
    """

    if timestamp is None:
        return None

    if not isinstance(timestamp, (int, float)):
        return None

    return datetime.fromtimestamp(timestamp, tz=timezone.utc)


def parse_payment_event(*, payload: dict, provider_event_id: str) -> ParsedPaymentEvent:
    """
    Parse a Razorpay payment webhook.

    Raises:
        ValueError:
            If required event information is missing.
    """

    event_type = payload.get("event")

    if not isinstance(event_type, str):
        raise TypeError("Webhook event type is missing.")

    if event_type not in SUPPORTED_PAYMENT_EVENTS:
        raise ValueError(f"Unsupported payment event: {event_type}")

    account_id = payload.get("account_id")

    payment_wrapper = payload.get("payload", {}).get("payment", {})

    payment = payment_wrapper.get("entity", {})

    if not isinstance(payment, dict):
        raise TypeError("Payment entity is missing from webhook payload.")

    payment_id = payment.get("id")

    if not payment_id:
        raise ValueError("Razorpay payment ID is missing.")

    error = payment.get("error")

    if not isinstance(error, dict):
        error = {}

    return ParsedPaymentEvent(
        event_type=event_type,
        provider_event_id=provider_event_id,
        provider_account_id=account_id,
        reference_id=payment.get("reference_id"),
        customer_email=payment.get("email"),
        customer_phone=payment.get("contact"),
        customer_name=None,
        payment_id=payment_id,
        order_id=payment.get("order_id"),
        amount_subunits=payment.get("amount"),
        currency=payment.get("currency"),
        payment_status=payment.get("status"),
        failure_reason=error.get("description"),
        failure_code=error.get("code"),
        provider_created_at=parse_provider_timestamp(payload.get("created_at")),
    )
    

def parse_payment_link_event(
    *,
    payload: dict,
    provider_event_id: str,
) -> ParsedPaymentLinkEvent:
    event_type = payload.get("event")

    if event_type != "payment_link.paid":
        raise ValueError(
            f"Unsupported payment link event: {event_type}"
        )

    account_id = payload.get("account_id")

    payment_link_wrapper = (
        payload.get("payload", {})
        .get("payment_link", {})
    )

    payment_link = payment_link_wrapper.get("entity", {})

    if not isinstance(payment_link, dict):
        raise ValueError("Payment Link entity is missing.")

    payment_link_id = payment_link.get("id")

    if not payment_link_id:
        raise ValueError("Razorpay Payment Link ID is missing.")

    reference_id = payment_link.get("reference_id")

    payment_wrapper = (
        payload.get("payload", {})
        .get("payment", {})
    )

    payment = payment_wrapper.get("entity", {})

    if not isinstance(payment, dict):
        payment = {}

    return ParsedPaymentLinkEvent(
        event_type=event_type,
        provider_event_id=provider_event_id,
        provider_account_id=account_id,
        payment_link_id=payment_link_id,
        reference_id=reference_id,
        payment_id=payment.get("id"),
        amount_subunits=payment.get("amount"),
        currency=payment.get("currency"),
        provider_created_at=parse_provider_timestamp(
            payload.get("created_at")
        ),
    )
