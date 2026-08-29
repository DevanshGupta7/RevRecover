import json

from fastapi import APIRouter, Header, HTTPException, Request

from app.core.config import settings
from app.integrations.razorpay.exceptions import RazorpaySignatureException
from app.integrations.razorpay.webhooks import verify_webhook_signature

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)


@router.post(
    "/razorpay"
)
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str | None = Header(
        default=None,
        alias="X-Razorpay-Signature"
    )
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

    raw_body = await request.body()

    try:
        verify_webhook_signature(
            raw_body=raw_body,
            signature=x_razorpay_signature,
            secret=settings.RAZORPAY_WEBHOOK_SECRET
        )

    except RazorpaySignatureException:
        raise HTTPException(
            status_code=400,
            detail="Invalid Razorpay webhook signature."
        )

    try:
        payload = json.loads(raw_body)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook payload.",
        )

    return {
        "received": True,
        "event": payload.get("event")
    }
