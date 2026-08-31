"""
Recovery strategy selection for RevRecover.

This module converts a recovery decision into a concrete,
safe recovery strategy.

The strategy layer does not execute external actions.
It only determines what RevRecover is allowed and expected
to do next.
"""

from dataclasses import dataclass

from app.services.recovery.constants import (
    ACTION_CREATE_PAYMENT_LINK,
    ACTION_HUMAN_APPROVAL,
    ACTION_RETRY_PAYMENT,
    ACTION_STOP,
)


@dataclass(frozen=True)
class RecoveryStrategy:
    """
    Concrete recovery strategy selected for a recovery case.
    """

    action_type: str
    delay_hours: int | None
    channel: str | None
    requires_human_approval: bool
    reason: str


def select_strategy(
    *,
    failure_type: str,
    recommended_action: str,
    recommended_delay_hours: int | None,
    requires_human_approval: bool,
    allowed_channels: list,
) -> RecoveryStrategy:
    """
    Select a safe concrete recovery strategy.

    AI recommendations are advisory. The failure type determines
    the recovery strategy that can actually be executed.
    """

    if requires_human_approval:
        return RecoveryStrategy(
            action_type=ACTION_HUMAN_APPROVAL,
            delay_hours=None,
            channel=None,
            requires_human_approval=True,
            reason=("The payment requires human approval before recovery can proceed."),
        )

    if failure_type == "insufficient_funds":
        return RecoveryStrategy(
            action_type=ACTION_RETRY_PAYMENT,
            delay_hours=recommended_delay_hours or 24,
            channel=None,
            requires_human_approval=False,
            reason=(
                "Insufficient funds are potentially recoverable, "
                "so the payment should be retried after a delay."
            ),
        )

    if failure_type == "temporary_failure":
        return RecoveryStrategy(
            action_type=ACTION_RETRY_PAYMENT,
            delay_hours=recommended_delay_hours or 2,
            channel=None,
            requires_human_approval=False,
            reason=(
                "The failure appears temporary, "
                "so the payment should be retried after a short delay."
            ),
        )

    if failure_type in {"expired_card", "bank_decline"}:
        channel = allowed_channels[0] if allowed_channels else None

        return RecoveryStrategy(
            action_type=ACTION_CREATE_PAYMENT_LINK,
            delay_hours=None,
            channel=channel,
            requires_human_approval=False,
            reason=(
                "The payment method cannot be directly retried, "
                "so a new payment link is recommended."
            ),
        )

    return RecoveryStrategy(
        action_type=ACTION_STOP,
        delay_hours=None,
        channel=None,
        requires_human_approval=False,
        reason="No safe recovery strategy is available for this payment.",
    )
