from decimal import Decimal

from app.models.recovery import RecoveryPolicy


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
