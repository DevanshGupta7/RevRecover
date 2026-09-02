"""
Recovery reconciliation for successful Razorpay Payment Link payments.

A Payment Link payment creates a new Razorpay payment ID. Therefore,
successful recovery must be associated with the existing RecoveryCase
using the Payment Link reference_id.

The original RevRecover Payment remains the business-level payment.
The new Razorpay payment ID is recorded as a PaymentAttempt.
"""

import logging
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.models.payment import Payment, PaymentAttempt
from app.models.recovery import (
    RecoveryAction,
    RecoveryAttempt,
    RecoveryCase,
)
from app.services.payment_events.parser import (
    ParsedPaymentEvent,
    ParsedPaymentLinkEvent,
)

logger = logging.getLogger(__name__)


def _payment_link_action_for_event(
    db: Session,
    *,
    organisation_id: UUID,
    payment_link_id: str,
) -> tuple[RecoveryCase, RecoveryAction] | None:
    actions = (
        db.query(RecoveryAction, RecoveryCase)
        .join(
            RecoveryCase,
            RecoveryCase.id == RecoveryAction.recovery_case_id,
        )
        .filter(
            RecoveryCase.organisation_id == organisation_id,
            RecoveryAction.action_type == "CREATE_PAYMENT_LINK",
        )
        .all()
    )

    for action, recovery_case in actions:
        if (action.result_data or {}).get("payment_link_id") == payment_link_id:
            return recovery_case, action

    return None


def record_payment_link_payment_event(
    db: Session,
    *,
    organisation_id: UUID,
    parsed_event: ParsedPaymentEvent,
) -> bool:
    """Record a Payment Link payment event on its original Payment.

    Returns False when the Payment Link does not belong to a RevRecover
    recovery action, allowing ordinary provider payments to use the generic
    payment processor.
    """
    if not parsed_event.payment_link_id:
        return False

    match = _payment_link_action_for_event(
        db,
        organisation_id=organisation_id,
        payment_link_id=parsed_event.payment_link_id,
    )
    if match is None:
        return False

    recovery_case, _recovery_action = match

    if parsed_event.event_type == "payment.captured":
        reconcile_successful_payment_link(
            db=db,
            organisation_id=organisation_id,
            recovery_case_id=recovery_case.id,
            parsed_event=ParsedPaymentLinkEvent(
                event_type="payment_link.paid",
                provider_event_id=parsed_event.provider_event_id,
                provider_account_id=parsed_event.provider_account_id,
                payment_link_id=parsed_event.payment_link_id,
                reference_id=None,
                payment_id=parsed_event.payment_id,
                amount_subunits=parsed_event.amount_subunits,
                currency=parsed_event.currency,
                provider_created_at=parsed_event.provider_created_at,
            ),
        )
        return True

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == recovery_case.payment_id,
            Payment.organisation_id == organisation_id,
        )
        .first()
    )
    if payment is None:
        raise ResourceNotFoundException(
            message="Original payment associated with recovery case was not found."
        )

    existing_attempt = (
        db.query(PaymentAttempt)
        .filter(
            PaymentAttempt.payment_id == payment.id,
            PaymentAttempt.provider_event_id == parsed_event.provider_event_id,
        )
        .first()
    )
    if existing_attempt is None:
        last_attempt = (
            db.query(PaymentAttempt)
            .filter(PaymentAttempt.payment_id == payment.id)
            .order_by(PaymentAttempt.attempt_number.desc())
            .first()
        )
        db.add(
            PaymentAttempt(
                payment_id=payment.id,
                attempt_number=1 if last_attempt is None else last_attempt.attempt_number + 1,
                status=parsed_event.payment_status or parsed_event.event_type,
                provider_event_id=parsed_event.provider_event_id,
                provider_attempt_id=parsed_event.payment_id,
                failure_reason=parsed_event.failure_reason,
                failure_code=parsed_event.failure_code,
                attempted_at=parsed_event.provider_created_at,
            )
        )
        db.flush()

    return True


def reconcile_successful_payment_link(
    db: Session,
    *,
    organisation_id: UUID,
    recovery_case_id: UUID,
    parsed_event: ParsedPaymentLinkEvent,
) -> RecoveryCase:
    """
    Reconcile a successful Razorpay Payment Link payment
    with an existing recovery case.

    The Payment Link creates a NEW Razorpay payment ID, but
    RevRecover must NOT create a new Payment record.

    Instead:

        RecoveryCase
            -> original Payment
                -> new PaymentAttempt

    The original Payment is marked captured.
    """

    now = datetime.now(timezone.utc)

    # ---------------------------------------------------------
    # 1. Find RecoveryCase
    # ---------------------------------------------------------

    recovery_case = (
        db.query(RecoveryCase)
        .filter(
            RecoveryCase.id == recovery_case_id,
            RecoveryCase.organisation_id == organisation_id,
        )
        .first()
    )

    if recovery_case is None:
        raise ResourceNotFoundException(
            message="Recovery case referenced by Payment Link was not found."
        )

    # ---------------------------------------------------------
    # 2. Idempotency at recovery-case level
    # ---------------------------------------------------------

    if recovery_case.status == "recovered":
        logger.info(
            "Recovery case already recovered | case_id=%s",
            recovery_case.id,
        )
        return recovery_case

    # ---------------------------------------------------------
    # 3. Find the ORIGINAL Payment
    # ---------------------------------------------------------

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == recovery_case.payment_id,
            Payment.organisation_id == organisation_id,
        )
        .first()
    )

    if payment is None:
        raise ResourceNotFoundException(
            message="Original payment associated with recovery case was not found."
        )

    # ---------------------------------------------------------
    # 4. Find the Payment Link RecoveryAction
    # ---------------------------------------------------------

    recovery_action = (
        db.query(RecoveryAction)
        .filter(
            RecoveryAction.recovery_case_id == recovery_case.id,
            RecoveryAction.action_type == "CREATE_PAYMENT_LINK",
        )
        .order_by(RecoveryAction.step_number.desc())
        .first()
    )

    if recovery_action is None:
        raise ResourceNotFoundException(
            message="Payment Link recovery action was not found."
        )

    # ---------------------------------------------------------
    # 5. Determine recovered amount
    # ---------------------------------------------------------

    if parsed_event.amount_subunits is None:
        raise ValueError(
            "Successful Payment Link event does not contain an amount."
        )

    recovered_amount = (
        Decimal(parsed_event.amount_subunits) / Decimal(100)
    )

    # ---------------------------------------------------------
    # 6. Validate amount against original payment
    # ---------------------------------------------------------

    if recovered_amount != payment.amount:
        logger.warning(
            "Recovery amount differs from original payment | "
            "case_id=%s original=%s recovered=%s",
            recovery_case.id,
            payment.amount,
            recovered_amount,
        )

        raise ValueError(
            "Recovered amount does not match the original payment amount."
        )

    # ---------------------------------------------------------
    # 7. Update ORIGINAL Payment
    # ---------------------------------------------------------

    payment.status = "captured"

    payment.failure_reason = None
    payment.failure_code = None

    # IMPORTANT:
    #
    # Do NOT replace payment.provider_payment_id.
    #
    # The original failed Razorpay payment ID belongs to the
    # original Payment. The new successful Razorpay payment ID
    # belongs to PaymentAttempt.

    # ---------------------------------------------------------
    # 8. Create PaymentAttempt for NEW Razorpay payment
    # ---------------------------------------------------------

    existing_payment_attempt = None

    if parsed_event.provider_event_id:
        existing_payment_attempt = (
            db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.payment_id == payment.id,
                PaymentAttempt.provider_event_id
                == parsed_event.provider_event_id,
            )
            .first()
        )

    if existing_payment_attempt is None:

        last_attempt = (
            db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.payment_id == payment.id,
            )
            .order_by(PaymentAttempt.attempt_number.desc())
            .first()
        )

        attempt_number = (
            1
            if last_attempt is None
            else last_attempt.attempt_number + 1
        )

        payment_attempt = PaymentAttempt(
            payment_id=payment.id,
            attempt_number=attempt_number,
            status="captured",
            provider_event_id=parsed_event.provider_event_id,
            provider_attempt_id=parsed_event.payment_id,
            failure_reason=None,
            failure_code=None,
            attempted_at=(
                parsed_event.provider_created_at
                or now
            ),
        )

        db.add(payment_attempt)
        db.flush()

    # ---------------------------------------------------------
    # 9. Create RecoveryAttempt
    # ---------------------------------------------------------

    existing_recovery_attempt = (
        db.query(RecoveryAttempt)
        .filter(
            RecoveryAttempt.recovery_case_id == recovery_case.id,
            RecoveryAttempt.recovery_action_id == recovery_action.id,
        )
        .first()
    )

    if existing_recovery_attempt is None:

        previous_attempt = (
            db.query(RecoveryAttempt)
            .filter(
                RecoveryAttempt.recovery_case_id
                == recovery_case.id,
            )
            .order_by(
                RecoveryAttempt.attempt_number.desc()
            )
            .first()
        )

        attempt_number = (
            1
            if previous_attempt is None
            else previous_attempt.attempt_number + 1
        )

        recovery_attempt = RecoveryAttempt(
            recovery_case_id=recovery_case.id,
            recovery_action_id=recovery_action.id,
            attempt_number=attempt_number,
            channel="payment_link",
            status="successful",
            error_message=None,
            attempted_at=(
                parsed_event.provider_created_at
                or now
            ),
        )

        db.add(recovery_attempt)
        db.flush()

    # ---------------------------------------------------------
    # 10. Mark RecoveryAction executed
    # ---------------------------------------------------------

    recovery_action.status = "executed"

    recovery_action.executed_at = (
        parsed_event.provider_created_at
        or now
    )

    # ---------------------------------------------------------
    # 11. Store successful payment information
    # ---------------------------------------------------------

    existing_result_data = recovery_action.result_data or {}

    recovery_action.result_data = {
        **existing_result_data,
        "recovered_payment_id": parsed_event.payment_id,
        "recovered_event_id": parsed_event.provider_event_id,
        "recovered_amount": str(recovered_amount),
        "recovered_at": (
            parsed_event.provider_created_at
            or now
        ).isoformat(),
    }

    # ---------------------------------------------------------
    # 12. Mark RecoveryCase recovered
    # ---------------------------------------------------------

    recovery_case.status = "recovered"
    recovery_case.current_step = "payment_recovered"

    recovery_case.recovered_at = (
        parsed_event.provider_created_at
        or now
    )

    recovery_case.recovered_amount = recovered_amount

    recovery_case.stopped_at = (
        parsed_event.provider_created_at
        or now
    )

    db.flush()

    logger.info(
        "Recovery successfully reconciled | "
        "case_id=%s original_payment_id=%s "
        "new_provider_payment_id=%s amount=%s",
        recovery_case.id,
        payment.id,
        parsed_event.payment_id,
        recovered_amount,
    )

    return recovery_case
