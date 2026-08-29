import json
import logging

from fastapi import (
    APIRouter,
    Header,
    HTTPException,
    Request,
    Depends
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.integrations.razorpay.exceptions import (
    RazorpaySignatureException
)
from app.integrations.razorpay.webhooks import (
    verify_webhook_signature
)
from app.api.webhooks.organisation_repository import (
    get_organisation_by_razorpay_account_id
)
from app.api.webhooks.repository import (
    create_webhook_event
)
from app.services.payment_events.parser import (
    parse_payment_event
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)


@router.post(
    "/razorpay"
)
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),
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
            status_code=400,
            detail="Missing Razorpay webhook signature."
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
            secret=settings.RAZORPAY_WEBHOOK_SECRET
        )

    except RazorpaySignatureException:
        logger.warning(
            "Invalid Razorpay webhook signature."
        )
        
        raise HTTPException(
            status_code=400,
            detail="Invalid Razorpay webhook signature."
        )

    try:
        payload = json.loads(raw_body)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook JSON."
        )
        
    provider_event_id = x_razorpay_event_id.strip()
    
    if not provider_event_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid Razorpay event ID."
        )
        
    event_type = payload.get("event")

    if not isinstance(event_type, str):
        raise HTTPException(
            status_code=400,
            detail="Missing webhook event type."
        )
        
    razorpay_account_id = payload.get("account_id")

    if not razorpay_account_id:
        raise HTTPException(
            status_code=400,
            detail="Missing Razorpay account ID."
        )
        
    organisation = (
        get_organisation_by_razorpay_account_id(
            db,
            razorpay_account_id
        )
    )
    
    if organisation is None:
        logger.error(
            "Unknown Razorpay account | account_id=%s",
            razorpay_account_id
        )

        raise HTTPException(
            status_code=400,
            detail="Unknown Razorpay account."
        )
        
    try:
        parsed_event = parse_payment_event(
            payload=payload,
            provider_event_id=provider_event_id
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc
        
    webhook_event, created = create_webhook_event(
        db=db,
        organisation_id=organisation.id,
        provider="razorpay",
        provider_event_id=provider_event_id,
        provider_account_id=razorpay_account_id,
        event_type=event_type,
        payload=payload,
        signature=x_razorpay_signature,
        provider_created_at=parsed_event.provider_created_at
    )
    
    if not created:
        db.commit()

        return {
            "received": True,
            "duplicate": True,
            "event_id": provider_event_id
        }
        
    db.commit()
        
    logger.info(
        "Razorpay webhook received | event_id=%s event=%s",
        provider_event_id,
        event_type
    )

    return {
        "received": True,
        "duplicate": False,
        "event_id": provider_event_id
    }
