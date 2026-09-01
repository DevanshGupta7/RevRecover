from dataclasses import dataclass
from decimal import Decimal

from app.models.payment import Payment
from app.models.recovery import RecoveryPolicy
from app.services.recovery.failure_analyzer import FailureAnalysis


@dataclass(frozen=True)
class EligibilityResult:
    """
    Result of recovery eligibility evaluation.
    """

    eligible: bool
    reason: str
    requires_human_approval: bool = False


def evaluate_eligibility(
    payment: Payment,
    analysis: FailureAnalysis,
    policy: RecoveryPolicy | None,
    previous_recovery_attempts: int,
) -> EligibilityResult:
    """
    Determine whether the payment is eligible for recovery.
    """

    if payment.status.lower() != "failed":
        return EligibilityResult(
            eligible=False,
            reason="Payment is not currently failed.",
        )

    if not analysis.retryable:
        return EligibilityResult(
            eligible=False,
            reason=(
                f"Failure type '{analysis.failure_type}' is not currently retryable."
            ),
        )

    if policy is None:
        return EligibilityResult(
            eligible=False,
            reason="No active recovery policy exists.",
        )

    if not policy.is_active:
        return EligibilityResult(
            eligible=False,
            reason="Recovery policy is inactive.",
        )

    if previous_recovery_attempts >= policy.max_attempts:
        return EligibilityResult(
            eligible=False,
            reason="Maximum recovery attempts have been reached.",
        )

    if (
        policy.max_recovery_amount is not None
        and payment.amount > policy.max_recovery_amount
    ):
        return EligibilityResult(
            eligible=False,
            reason="Payment amount exceeds the recovery policy limit.",
        )

    requires_approval = (
        policy.require_approval_above is not None
        and payment.amount > policy.require_approval_above
    )

    return EligibilityResult(
        eligible=True,
        reason="Payment satisfies the recovery policy.",
        requires_human_approval=requires_approval,
    )


def calculate_risk_score(payment: Payment) -> Decimal:
    """
    Calculate a deterministic bounded risk score for a failed payment.
    """

    if payment.status.lower() != "failed":
        return Decimal("0.00")

    score = Decimal("0.50")

    failure_code = (payment.failure_code or "").upper()

    if failure_code in {
        "INSUFFICIENT_FUNDS",
        "TEMPORARY_ERROR",
        "BANK_ERROR",
        "NETWORK_ERROR",
    }:
        score += Decimal("0.20")

    if payment.amount >= Decimal(10000):
        score += Decimal("0.15")

    return min(max(score, Decimal("0.00")), Decimal("1.00"))


def determine_eligibility(payment: Payment) -> tuple[bool, str]:
    if payment.status.lower() != "failed":
        return False, "Payment is not failed."

    failure_code = (payment.failure_code or "").upper()

    if failure_code in {"INVALID_CARD", "CARD_NOT_SUPPORTED"}:
        return False, "Failure type is not currently recoverable."

    return True, "Payment is eligible for recovery."
