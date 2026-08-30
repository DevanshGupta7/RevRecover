from decimal import Decimal

from app.models.payment import Payment
from app.services.recovery.eligibility import (
    calculate_risk_score,
    determine_eligibility,
)


def test_failed_payment_is_eligible():
    payment = Payment(
        organisation_id=None,
        customer_id=None,
        amount=Decimal(4500),
        currency="INR",
        status="failed",
        provider="razorpay",
        failure_reason="Insufficient funds",
        failure_code="INSUFFICIENT_FUNDS",
    )

    eligible, reason = determine_eligibility(payment)

    assert eligible is True
    assert reason


def test_non_failed_payment_is_not_eligible():
    payment = Payment(
        organisation_id=None,
        customer_id=None,
        amount=Decimal(4500),
        currency="INR",
        status="captured",
        provider="razorpay",
    )

    eligible, _ = determine_eligibility(payment)

    assert eligible is False


def test_risk_score_is_bounded():
    payment = Payment(
        organisation_id=None,
        customer_id=None,
        amount=Decimal(4500),
        currency="INR",
        status="failed",
        provider="razorpay",
        failure_code="INSUFFICIENT_FUNDS",
    )

    score = calculate_risk_score(payment)

    assert Decimal("0.00") <= score <= Decimal("1.00")
