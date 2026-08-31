from decimal import Decimal

from app.models.recovery import RecoveryPolicy
from app.services.recovery.constants import (
    ACTION_HUMAN_APPROVAL,
    ACTION_RETRY_PAYMENT,
)
from app.services.recovery.policy import validate_strategy
from app.services.recovery.strategy import RecoveryStrategy, select_strategy


def test_select_strategy_for_retry_delay():
    strategy = select_strategy(
        failure_type="insufficient_funds",
        recommended_action="RETRY_AFTER_DELAY",
        recommended_delay_hours=24,
        requires_human_approval=False,
        allowed_channels=[],
    )

    assert strategy.action_type == ACTION_RETRY_PAYMENT
    assert strategy.delay_hours == 24
    assert strategy.requires_human_approval is False


def test_validate_strategy_requires_human_approval():
    policy = RecoveryPolicy(
        organisation_id=None,
        name="Risky Recovery Policy",
        max_attempts=3,
        min_hours_between_attempts=24,
        max_recovery_amount=Decimal(100000),
        allowed_channels=["email"],
        allow_discount=False,
        require_approval_above=Decimal(10000),
        stop_after_success=True,
        is_active=True,
    )

    strategy = RecoveryStrategy(
        action_type=ACTION_RETRY_PAYMENT,
        delay_hours=24,
        channel=None,
        requires_human_approval=False,
        reason="Retry payment",
    )

    result = validate_strategy(
        policy=policy,
        strategy=strategy,
        amount=Decimal(20000),
        current_attempts=1,
    )

    assert result.allowed is True
    assert result.requires_human_approval is True


def test_validate_strategy_rejects_max_attempts():
    policy = RecoveryPolicy(
        organisation_id=None,
        name="Limited Policy",
        max_attempts=3,
        min_hours_between_attempts=24,
        max_recovery_amount=Decimal(100000),
        allowed_channels=["email"],
        allow_discount=False,
        require_approval_above=None,
        stop_after_success=True,
        is_active=True,
    )

    strategy = RecoveryStrategy(
        action_type=ACTION_RETRY_PAYMENT,
        delay_hours=24,
        channel=None,
        requires_human_approval=False,
        reason="Retry payment",
    )

    result = validate_strategy(
        policy=policy,
        strategy=strategy,
        amount=Decimal(5000),
        current_attempts=3,
    )

    assert result.allowed is False


def test_select_strategy_sets_human_approval_when_requested():
    strategy = select_strategy(
        failure_type="temporary_failure",
        recommended_action="RETRY_AFTER_DELAY",
        recommended_delay_hours=2,
        requires_human_approval=True,
        allowed_channels=["email"],
    )

    assert strategy.action_type == ACTION_HUMAN_APPROVAL
    assert strategy.requires_human_approval is True
