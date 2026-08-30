from decimal import Decimal

from app.models.payment import Payment


def calculate_risk_score(
    payment: Payment
) -> Decimal:
    """
    Calculate a deterministic risk score.

    This is deliberately simple for the MVP.
    """

    if payment.status.lower() != "failed":
        return Decimal("0.00")

    score = Decimal("0.50")

    failure_code = (
        payment.failure_code or ""
    ).upper()

    if failure_code in {
        "INSUFFICIENT_FUNDS",
        "TEMPORARY_ERROR",
        "BANK_ERROR",
        "NETWORK_ERROR"
    }:
        score += Decimal("0.20")

    if payment.amount >= Decimal("10000"):
        score += Decimal("0.15")

    return min(
        score,
        Decimal("1.00")
    )


def determine_eligibility(
    payment: Payment
) -> tuple[bool, str]:

    if payment.status.lower() != "failed":
        return False, "Payment is not failed."

    failure_code = (
        payment.failure_code or ""
    ).upper()

    if failure_code in {
        "INVALID_CARD",
        "CARD_NOT_SUPPORTED"
    }:
        return False, "Failure type is not currently recoverable."

    return True, "Payment is eligible for recovery."
