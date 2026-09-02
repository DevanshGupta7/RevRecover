"""
Execution of recovery actions.

This module executes approved recovery actions against
external payment providers and updates RevRecover state.

External payment confirmation must always come from
the provider or a verified webhook. Local database state
must never pretend that a payment succeeded.
"""

import logging
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, ResourceNotFoundException
from app.integrations.razorpay.client import RazorpayClient
from app.integrations.razorpay.service import RazorpayService
from app.models.customer import Customer
from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase

logger = logging.getLogger(__name__)


def get_razorpay_service() -> RazorpayService:
    """
    Create the backend Razorpay service.

    Razorpay credentials are loaded only on the backend.
    """

    return RazorpayService(client=RazorpayClient())


def execute_create_payment_link(
    db: Session,
    recovery_case: RecoveryCase,
    recovery_action: RecoveryAction,
) -> dict:
    """
    Create a Razorpay Payment Link for a recovery case.
    """

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == recovery_case.payment_id,
            Payment.organisation_id == recovery_case.organisation_id,
        )
        .first()
    )

    if payment is None:
        raise ResourceNotFoundException(
            message="Payment associated with recovery case was not found."
        )

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == payment.customer_id,
            Customer.organisation_id == recovery_case.organisation_id,
        )
        .first()
    )

    razorpay = get_razorpay_service()
    
    reference_id = f"RR-{recovery_case.id}"

    result = razorpay.create_payment_link(
        amount=int(payment.amount * 100),
        currency=payment.currency,
        reference_id=reference_id,
        description=f"RevRecover recovery for payment {payment.id}",
        customer_name=customer.name if customer else None,
        customer_email=customer.email if customer else None,
        customer_contact=customer.phone if customer else None,
    )

    recovery_action.status = "executed"
    recovery_action.executed_at = datetime.now(timezone.utc)
    recovery_case.status = "waiting"
    recovery_case.current_step = "payment_link_created"
    recovery_action.result_data = {
        "payment_link_id": result.get("id"),
        "short_url": result.get("short_url"),
        **(
            {"reference_id": result["reference_id"]}
            if result.get("reference_id") is not None
            else {}
        ),
    }

    db.flush()

    logger.info(
        "Recovery payment link created | case_id=%s payment_id=%s link_id=%s",
        recovery_case.id,
        payment.id,
        result.get("id"),
    )

    return result


def execute_retry_payment(
    db: Session,
    recovery_case: RecoveryCase,
    recovery_action: RecoveryAction,
) -> dict:
    """
    Create a new Razorpay order for a recovery retry attempt.

    This does not mark the original payment as successful. The
    successful outcome is only confirmed later by a verified webhook.
    """

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == recovery_case.payment_id,
            Payment.organisation_id == recovery_case.organisation_id,
        )
        .first()
    )

    if payment is None:
        raise ResourceNotFoundException(
            message="Payment associated with recovery case was not found."
        )

    razorpay = get_razorpay_service()

    result = razorpay.create_order(
        amount=int(payment.amount * 100),
        currency=payment.currency,
        receipt=str(recovery_case.id),
    )

    recovery_action.status = "executed"
    recovery_action.executed_at = datetime.now(timezone.utc)
    recovery_case.status = "waiting"
    recovery_case.current_step = "retry_order_created"

    db.flush()

    logger.info(
        "Recovery retry order created | case_id=%s payment_id=%s order_id=%s",
        recovery_case.id,
        payment.id,
        result.get("id"),
    )

    return result


def execute_recovery_action(
    db: Session,
    recovery_case: RecoveryCase,
    recovery_action: RecoveryAction,
) -> RecoveryAction:
    """
    Execute a planned recovery action.
    """

    if recovery_action.status != "planned":
        raise ConflictException(message="Recovery action has already been executed.")

    recovery_action.status = "executing"
    recovery_case.status = "executing"
    recovery_case.current_step = "execute_recovery"
    db.flush()

    if recovery_action.action_type == "CREATE_PAYMENT_LINK":
        result = execute_create_payment_link(
            db=db,
            recovery_case=recovery_case,
            recovery_action=recovery_action,
        )
        recovery_action.result_data = {
            "payment_link_id": result.get("id"),
            "short_url": result.get("short_url"),
            **(
                {"reference_id": result["reference_id"]}
                if result.get("reference_id") is not None
                else {}
            ),
        }

    elif recovery_action.action_type == "RETRY_PAYMENT":
        result = execute_retry_payment(
            db=db,
            recovery_case=recovery_case,
            recovery_action=recovery_action,
        )
        recovery_action.result_data = {
            "order_id": result.get("id"),
            "amount": result.get("amount"),
            "currency": result.get("currency"),
        }

    elif recovery_action.action_type == "HUMAN_APPROVAL":
        recovery_case.status = "awaiting_approval"
        recovery_case.current_step = "human_approval"
        recovery_action.status = "planned"

    elif recovery_action.action_type == "STOP":
        recovery_case.status = "stopped"
        recovery_case.current_step = "stopped"
        recovery_action.status = "executed"

    else:
        raise ValueError(f"Unsupported recovery action: {recovery_action.action_type}")

    db.flush()
    return recovery_action
