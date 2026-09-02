import json
import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.webhooks.organisation_repository import (
    get_organisation_by_razorpay_account_id,
)
from app.api.webhooks.repository import create_webhook_event
from app.core.config import settings
from app.db.database import get_db
from app.integrations.razorpay.exceptions import RazorpaySignatureException
from app.integrations.razorpay.webhooks import verify_webhook_signature
from app.services.payment_events.parser import (
    parse_payment_event,
    parse_payment_link_event,
)
from app.services.payment_events.processor import process_payment_event
from app.services.payment_events.recovery_reference import (
    recovery_case_id_from_reference,
)
from app.services.recovery.reconciliation import (
    reconcile_successful_payment_link,
    record_payment_link_payment_event,
)
from app.services.recovery.service import RecoveryService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),  # noqa: B008
    x_razorpay_signature: str | None = Header(
        default=None,
        alias="X-Razorpay-Signature",
    ),
    x_razorpay_event_id: str | None = Header(
        default=None,
        alias="X-Razorpay-Event-Id",
    ),
):
    """
    Receive Razorpay webhook events.

    Signature verification happens before JSON parsing.
    """

    if not x_razorpay_signature:
        raise HTTPException(
            status_code=400, detail="Missing Razorpay webhook signature."
        )

    if not x_razorpay_event_id:
        raise HTTPException(
            status_code=400,
            detail="Missing Razorpay event ID.",
        )

    raw_body = await request.body()

    try:
        verify_webhook_signature(
            raw_body=raw_body,
            signature=x_razorpay_signature,
            secret=settings.RAZORPAY_WEBHOOK_SECRET,
        )

    except RazorpaySignatureException:
        logger.warning("Invalid Razorpay webhook signature.")

        raise HTTPException(
            status_code=400, detail="Invalid Razorpay webhook signature."
        )

    try:
        payload = json.loads(raw_body)

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid webhook JSON.")

    provider_event_id = x_razorpay_event_id.strip()

    if not provider_event_id:
        raise HTTPException(status_code=400, detail="Invalid Razorpay event ID.")

    event_type = payload.get("event")

    if not isinstance(event_type, str):
        raise HTTPException(status_code=400, detail="Missing webhook event type.")

    razorpay_account_id = payload.get("account_id")

    if not razorpay_account_id:
        raise HTTPException(status_code=400, detail="Missing Razorpay account ID.")

    organisation = get_organisation_by_razorpay_account_id(db, razorpay_account_id)

    if organisation is None:
        logger.error("Unknown Razorpay account | account_id=%s", razorpay_account_id)

        raise HTTPException(status_code=400, detail="Unknown Razorpay account.")

    try:
        if event_type == "payment_link.paid":
            parsed_event = parse_payment_link_event(
                payload=payload,
                provider_event_id=provider_event_id,
            )
        else:
            parsed_event = parse_payment_event(
                payload=payload,
                provider_event_id=provider_event_id,
            )

    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    _webhook_event, created = create_webhook_event(
        db=db,
        organisation_id=organisation.id,
        provider="razorpay",
        provider_event_id=provider_event_id,
        provider_account_id=razorpay_account_id,
        event_type=event_type,
        payload=payload,
        signature=x_razorpay_signature,
        provider_created_at=parsed_event.provider_created_at,
    )

    if not created:
        db.commit()

        return {"received": True, "duplicate": True, "event_id": provider_event_id}

    try:
        if event_type == "payment_link.paid":
            recovery_case_id = recovery_case_id_from_reference(
                parsed_event.reference_id
            )

            reconcile_successful_payment_link(
                db=db,
                organisation_id=organisation.id,
                recovery_case_id=recovery_case_id,
                parsed_event=parsed_event,
            )

            db.commit()

        else:
            if event_type in {"payment.authorized", "payment.captured"}:
                handled_as_recovery = record_payment_link_payment_event(
                    db=db,
                    organisation_id=organisation.id,
                    parsed_event=parsed_event,
                )

            else:
                handled_as_recovery = False

            if handled_as_recovery:
                logger.info(
                    "Recorded Payment Link payment event on recovery payment | "
                    "event=%s "
                    "payment_id=%s payment_link_id=%s",
                    event_type,
                    parsed_event.payment_id,
                    parsed_event.payment_link_id,
                )
                db.commit()
                return {
                    "received": True,
                    "duplicate": False,
                    "event_id": provider_event_id,
                }

            payment = process_payment_event(
                db=db,
                organisation_id=organisation.id,
                parsed_event=parsed_event,
            )

            db.commit()

            if event_type == "payment.failed":
                try:
                    RecoveryService().process_payment(
                        db=db,
                        payment_id=payment.id,
                        organisation_id=organisation.id,
                    )

                except Exception:
                    logger.exception(
                        "Recovery processing failed | payment_id=%s",
                        payment.id,
                    )

    except Exception:
        db.rollback()

        logger.exception(
            "Failed to process Razorpay payment event | "
            "event_id=%s event=%s",
            provider_event_id,
            event_type,
        )

        raise

    logger.info(
        "Razorpay webhook received | event_id=%s event=%s",
        provider_event_id,
        event_type,
    )

    return {"received": True, "duplicate": False, "event_id": provider_event_id}
