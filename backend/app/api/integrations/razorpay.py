from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.organisations.dependencies import get_current_organisation_id
from app.core.exceptions import PaymentProviderException
from app.db.database import get_db
from app.integrations.razorpay.exceptions import (
    RazorpayAPIException,
    RazorpayConfigurationException,
)
from app.services.payment_provider_factory import get_payment_provider
from app.services.payments.sync import sync_razorpay_payments

router = APIRouter(prefix="/integrations/razorpay", tags=["Razorpay"])


@router.post("/sync")
def sync_razorpay_payments_endpoint(
    organisation_id: Annotated[UUID, Depends(get_current_organisation_id)],
    db: Annotated[Session, Depends(get_db)],
    count: int = Query(default=100, ge=1, le=100),
    from_timestamp: int | None = Query(default=None, alias="from"),
    to_timestamp: int | None = Query(default=None, alias="to"),
):
    """Synchronize Razorpay payments for the authenticated organisation."""

    try:
        result = sync_razorpay_payments(
            db=db,
            organisation_id=organisation_id,
            provider=get_payment_provider(),
            count=count,
            from_timestamp=from_timestamp,
            to_timestamp=to_timestamp,
        )
        db.commit()
        return result
    except RazorpayConfigurationException as exc:
        raise PaymentProviderException(message=str(exc)) from exc
    except RazorpayAPIException as exc:
        db.rollback()
        raise PaymentProviderException(message=str(exc)) from exc
