from dataclasses import dataclass
from decimal import Decimal

from app.models.recovery import RecoveryPolicy
from app.services.recovery.strategy import RecoveryStrategy


@dataclass(frozen=True)
class PolicyValidationResult:
    """
    Result of validating a recovery strategy against policy.
    """

    allowed: bool
    reason: str
    requires_human_approval: bool = False


def requires_human_approval(policy: RecoveryPolicy, amount: Decimal) -> bool:
    if policy.require_approval_above is None:
        return False

    return amount >= policy.require_approval_above


def action_allowed_by_policy(policy: RecoveryPolicy, action: str) -> bool:
    action = action.upper()

    if action == "SEND_PAYMENT_REMINDER":
        channels = [channel.lower() for channel in (policy.allowed_channels or [])]
        return "email" in channels

    if action in {"RETRY", "RETRY_AFTER_DELAY", "CREATE_PAYMENT_LINK"}:
        return True

    if action in {"WAIT", "ESCALATE", "STOP"}:
        return True

    if action == "REQUEST_PAYMENT_METHOD_UPDATE":
        channels = [channel.lower() for channel in (policy.allowed_channels or [])]
        return "email" in channels

    return False


def validate_strategy(
    *,
    policy: RecoveryPolicy,
    strategy: RecoveryStrategy,
    amount: Decimal,
    current_attempts: int,
) -> PolicyValidationResult:
    """
    Validate whether a recovery strategy is allowed by the organisation's
    recovery policy.
    """

    if not policy.is_active:
        return PolicyValidationResult(
            allowed=False,
            reason="Recovery policy is inactive.",
        )

    if current_attempts >= policy.max_attempts:
        return PolicyValidationResult(
            allowed=False,
            reason="Maximum recovery attempts have been reached.",
        )

    if policy.max_recovery_amount is not None and amount > policy.max_recovery_amount:
        return PolicyValidationResult(
            allowed=False,
            reason=(
                "Payment amount exceeds the maximum recovery amount allowed by policy."
            ),
        )

    if (
        policy.require_approval_above is not None
        and amount > policy.require_approval_above
        and strategy.action_type != "HUMAN_APPROVAL"
    ):
        return PolicyValidationResult(
            allowed=True,
            reason=(
                "Recovery action requires human approval because the payment exceeds "
                "the approval threshold."
            ),
            requires_human_approval=True,
        )

    if strategy.channel is not None and strategy.channel not in (
        policy.allowed_channels or []
    ):
        return PolicyValidationResult(
            allowed=False,
            reason=(
                f"Recovery channel '{strategy.channel}' is not allowed by the recovery policy."
            ),
        )

    return PolicyValidationResult(
        allowed=True,
        reason="Recovery strategy is allowed by policy.",
    )
