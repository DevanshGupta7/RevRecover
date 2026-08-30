from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.auth.dependencies import get_current_user
from app.core.exceptions import PaymentProviderException
from app.integrations.razorpay.exceptions import (
    RazorpayAPIException,
    RazorpaySignatureException,
)
from app.services.payment_provider_factory import get_payment_provider

router = APIRouter(prefix="/payments/razorpay", tags=["Razorpay"])


# class RazorpayPaymentResponse(BaseModel):
#     payment: dict


class RazorpayVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# class PaymentLinkCreateRequest(BaseModel):
#     description: str = "RevRecover payment recovery"


@router.get("/{provider_payment_id}")
def fetch_razorpay_payment(
    provider_payment_id: str, current_user: Annotated[tuple, Depends(get_current_user)]
):
    """
    Fetch payment information directly from Razorpay.

    This endpoint is intended for authenticated internal use
    and should not be exposed publicly without authentication.
    """

    provider = get_payment_provider()

    try:
        payment = provider.fetch_payment(provider_payment_id)

        return {"payment": payment}

    except RazorpayAPIException as exc:
        raise PaymentProviderException(message=str(exc)) from exc


@router.post("/verify")
def verify_razorpay_payment(
    request: RazorpayVerificationRequest,
    current_user: Annotated[tuple, Depends(get_current_user)],
):
    """
    Verify the signature returned by Razorpay Checkout.
    """

    provider = get_payment_provider()

    try:
        provider.verify_payment_signature(
            order_id=request.razorpay_order_id,
            payment_id=request.razorpay_payment_id,
            signature=request.razorpay_signature,
        )

    except RazorpaySignatureException as exc:
        raise PaymentProviderException(
            message="Razorpay payment verification failed."
        ) from exc

    return {
        "verified": True,
        "razorpay_payment_id": (request.razorpay_payment_id),
        "razorpay_order_id": (request.razorpay_order_id),
    }


# def create_payment_link(
#     payment_id: UUID,
#     request: PaymentLinkCreateRequest,
#     db: Annotated[
#         Session,
#         Depends(get_db),
#     ],
#     current_user: Annotated[
#         tuple,
#         Depends(get_current_user),
#     ],
# ):
#     user, membership = current_user

#     payment = get_payment(
#         db=db,
#         organisation_id=membership.organisation_id,
#         payment_id=payment_id,
#     )

#     provider = get_payment_provider()

#     amount = amount_to_subunits(
#         payment.amount
#     )

#     try:
#         payment_link = provider.create_payment_link(
#             amount=amount,
#             currency=payment.currency,
#             reference_id=str(payment.id),
#             description=request.description,
#         )

#         return {
#             "payment_id": str(payment.id),
#             "payment_link": payment_link,
#         }

#     except RazorpayAPIException as exc:
#         raise PaymentProviderException(
#             message=str(exc)
#         ) from exc
