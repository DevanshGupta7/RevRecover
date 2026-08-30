from decimal import Decimal

from app.models.recovery import RecoveryPolicy
from app.services.recovery.policy import (
    action_allowed_by_policy,
    requires_human_approval,
)


def test_retry_allowed():
    policy = RecoveryPolicy(
        organisation_id=None,
        name="Default Recovery Policy",
        max_attempts=3,
        min_hours_between_attempts=24,
        max_recovery_amount=Decimal(100000),
        allowed_channels=["email"],
        allow_discount=False,
        require_approval_above=Decimal(10000),
        stop_after_success=True,
        is_active=True,
    )

    assert action_allowed_by_policy(policy, "RETRY") is True


def test_high_value_requires_approval():
    policy = RecoveryPolicy(
        organisation_id=None,
        name="Default Recovery Policy",
        max_attempts=3,
        min_hours_between_attempts=24,
        max_recovery_amount=Decimal(100000),
        allowed_channels=["email"],
        allow_discount=False,
        require_approval_above=Decimal(10000),
        stop_after_success=True,
        is_active=True,
    )

    assert requires_human_approval(policy, Decimal(20000)) is True
