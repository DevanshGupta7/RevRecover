"""
Failure analysis for RevRecover.

This module classifies payment failures into recovery-oriented
categories using deterministic rules.

The classification is intentionally explainable and predictable.
AI may later enhance the diagnosis, but this layer remains
independent of the AI provider.
"""

from dataclasses import dataclass

from app.models.payment import Payment


@dataclass(frozen=True)
class FailureAnalysis:
    """
    Result of deterministic payment failure analysis.
    """

    failure_type: str
    retryable: bool
    severity: str
    reason: str


def _normalize(value: str | None) -> str:
    """
    Normalize provider failure information.
    """

    return (value or "").strip().lower().replace("-", "_").replace(" ", "_")


def analyze_failure(payment: Payment) -> FailureAnalysis:
    """
    Analyze a failed payment and classify the failure.

    The result is used by the recovery eligibility layer.
    """

    reason = _normalize(payment.failure_reason)
    code = _normalize(payment.failure_code)

    combined = f"{reason} {code}"

    if any(
        keyword in combined
        for keyword in (
            "insufficient",
            "insufficient_funds",
            "balance",
        )
    ):
        return FailureAnalysis(
            failure_type="insufficient_funds",
            retryable=True,
            severity="medium",
            reason=(
                "The payment appears to have failed because "
                "sufficient funds were unavailable."
            ),
        )

    if any(
        keyword in combined
        for keyword in (
            "expired",
            "expired_card",
            "card_expired",
        )
    ):
        return FailureAnalysis(
            failure_type="expired_card",
            retryable=False,
            severity="medium",
            reason=("The customer's payment method appears to be expired."),
        )

    if any(
        keyword in combined
        for keyword in (
            "timeout",
            "timed_out",
            "network",
            "temporary",
            "technical",
            "gateway",
            "server_error",
        )
    ):
        return FailureAnalysis(
            failure_type="temporary_failure",
            retryable=True,
            severity="medium",
            reason=(
                "The payment appears to have encountered a temporary technical failure."
            ),
        )

    if any(
        keyword in combined
        for keyword in (
            "declined",
            "bank_decline",
            "bank_declined",
            "issuer_declined",
        )
    ):
        return FailureAnalysis(
            failure_type="bank_decline",
            retryable=False,
            severity="high",
            reason=("The payment appears to have been declined by the bank or issuer."),
        )

    if any(
        keyword in combined
        for keyword in (
            "authentication",
            "authentication_failed",
            "auth_failed",
            "otp",
        )
    ):
        return FailureAnalysis(
            failure_type="authentication_failure",
            retryable=False,
            severity="medium",
            reason=(
                "The payment appears to have failed during customer authentication."
            ),
        )

    return FailureAnalysis(
        failure_type="unknown",
        retryable=False,
        severity="high",
        reason=("The payment failure could not be confidently classified."),
    )
