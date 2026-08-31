"""
Deterministic recovery decision logic for RevRecover.

This module calculates recovery potential and selects a recommended
recovery action.

The calculation is deliberately explainable for the MVP.
"""

from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class RecoveryDecision:
    """
    Result of deterministic recovery decisioning.
    """

    risk_score: Decimal
    recovery_probability: Decimal
    recommended_action: str
    recommended_delay_hours: int | None
    requires_human_approval: bool
    reasoning_summary: str


def calculate_recovery_decision(
    failure_type: str,
    retryable: bool,
    successful_payment_count: int,
    previous_failed_payment_count: int,
    requires_policy_approval: bool,
) -> RecoveryDecision:
    """
    Calculate recovery scores and recommended action.

    Scores are deterministic and explainable. They are not intended
    to represent a statistically calibrated ML probability.
    """

    score = Decimal("0.50")

    if retryable:
        score += Decimal("0.15")

    if successful_payment_count >= 10:
        score += Decimal("0.15")
    elif successful_payment_count >= 5:
        score += Decimal("0.10")
    elif successful_payment_count >= 2:
        score += Decimal("0.05")

    if previous_failed_payment_count <= 1:
        score += Decimal("0.05")

    if failure_type == "insufficient_funds":
        score += Decimal("0.05")
    elif failure_type == "temporary_failure":
        score += Decimal("0.10")
    elif failure_type == "bank_decline":
        score -= Decimal("0.15")
    elif failure_type == "unknown":
        score -= Decimal("0.20")

    score = max(
        Decimal("0.00"),
        min(Decimal("1.00"), score),
    )

    if failure_type == "insufficient_funds":
        recommended_action = "RETRY_AFTER_DELAY"
        recommended_delay_hours = 24
    elif failure_type == "temporary_failure":
        recommended_action = "RETRY_AFTER_DELAY"
        recommended_delay_hours = 2
    elif failure_type in {"expired_card", "bank_decline"}:
        recommended_action = "CREATE_PAYMENT_LINK"
        recommended_delay_hours = None
    else:
        recommended_action = "STOP"
        recommended_delay_hours = None

    reasoning = (
        f"Failure type: {failure_type}. "
        f"Retryable: {retryable}. "
        f"Successful previous payments: "
        f"{successful_payment_count}. "
        f"Previous failed payments: "
        f"{previous_failed_payment_count}."
    )

    return RecoveryDecision(
        risk_score=score.quantize(Decimal("0.01")),
        recovery_probability=score.quantize(Decimal("0.01")),
        recommended_action=recommended_action,
        recommended_delay_hours=recommended_delay_hours,
        requires_human_approval=requires_policy_approval,
        reasoning_summary=reasoning,
    )
