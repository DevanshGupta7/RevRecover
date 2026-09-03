import logging
from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.integrations.razorpay.mappers import map_payment_status
from app.models.payment import PaymentAttempt
from app.services.payment_events.parser import (
    ParsedPaymentEvent,
    parse_provider_timestamp,
)
from app.services.payment_events.processor import (
    get_payment_by_provider_id,
    process_payment_event,
)
from app.services.payment_provider import PaymentProvider

logger = logging.getLogger(__name__)


def _parsed_event(payment: dict[str, Any]) -> ParsedPaymentEvent:
    payment_id = payment.get("id")
    if not payment_id:
        raise ValueError("Razorpay payment ID is missing.")

    status = payment.get("status")
    return ParsedPaymentEvent(
        event_type="payment.sync",
        provider_event_id=f"sync:{payment_id}",
        provider_account_id=None,
        reference_id=None,
        payment_link_id=payment.get("payment_link_id"),
        payment_id=payment_id,
        order_id=payment.get("order_id"),
        amount_subunits=payment.get("amount"),
        currency=payment.get("currency"),
        payment_status=map_payment_status(status) if status else None,
        failure_reason=payment.get("error_description"),
        failure_code=payment.get("error_code"),
        provider_created_at=parse_provider_timestamp(payment.get("created_at"))
        or datetime.now(timezone.utc),
        customer_name=payment.get("name"),
        customer_email=payment.get("email"),
        customer_phone=payment.get("contact"),
    )


def sync_razorpay_payments(
    db: Session,
    *,
    organisation_id: UUID,
    provider: PaymentProvider,
    count: int = 100,
    from_timestamp: int | None = None,
    to_timestamp: int | None = None,
) -> dict[str, int]:
    """Synchronize a bounded set of Razorpay payments for one organisation."""

    stats = {
        "payments_fetched": 0,
        "payments_created": 0,
        "payments_updated": 0,
        "attempts_created": 0,
        "skipped": 0,
        "failed": 0,
    }
    page_size = min(max(count, 1), 100)
    skip = 0

    logger.info("Razorpay sync started | organisation_id=%s", organisation_id)

    for _ in range(100):
        payments = provider.get_payments(
            count=page_size,
            skip=skip,
            from_timestamp=from_timestamp,
            to_timestamp=to_timestamp,
        )
        if not payments:
            break

        for provider_payment in payments:
            stats["payments_fetched"] += 1
            provider_payment_id = provider_payment.get("id")
            try:
                parsed_event = _parsed_event(provider_payment)
                existing_payment = get_payment_by_provider_id(
                    db,
                    organisation_id=organisation_id,
                    provider="razorpay",
                    provider_payment_id=parsed_event.payment_id,
                )
                existing_attempt = (
                    db.query(PaymentAttempt)
                    .filter(
                        PaymentAttempt.payment_id == existing_payment.id,
                        or_(
                            PaymentAttempt.provider_event_id
                            == parsed_event.provider_event_id,
                            PaymentAttempt.provider_attempt_id
                            == parsed_event.payment_id,
                        ),
                    )
                    .first()
                    if existing_payment
                    else None
                )

                with db.begin_nested():
                    process_payment_event(
                        db=db,
                        organisation_id=organisation_id,
                        parsed_event=parsed_event,
                    )

                if existing_payment is None:
                    stats["payments_created"] += 1
                    logger.info(
                        "Razorpay payment created | organisation_id=%s payment_id=%s",
                        organisation_id,
                        provider_payment_id,
                    )
                else:
                    stats["payments_updated"] += 1

                if existing_attempt is None:
                    stats["attempts_created"] += 1
                else:
                    stats["skipped"] += 1
            except (TypeError, ValueError, AttributeError) as exc:
                stats["failed"] += 1
                logger.warning(
                    "Razorpay payment ingestion failed | organisation_id=%s payment_id=%s error=%s",
                    organisation_id,
                    provider_payment_id,
                    exc,
                )

        if len(payments) < page_size:
            break
        skip += len(payments)

    db.flush()
    logger.info(
        "Razorpay sync completed | organisation_id=%s stats=%s", organisation_id, stats
    )
    return stats
