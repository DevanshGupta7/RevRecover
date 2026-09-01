from decimal import Decimal
from types import SimpleNamespace
from uuid import uuid4
from unittest.mock import MagicMock

from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase
from app.services.recovery import execution


def test_execute_recovery_action_creates_payment_link_and_updates_state(monkeypatch):
    db = MagicMock()
    organisation_id = uuid4()
    customer_id = uuid4()
    payment_id = uuid4()
    recovery_case_id = uuid4()

    payment = Payment(
        id=payment_id,
        organisation_id=organisation_id,
        customer_id=customer_id,
        amount=Decimal("5000.00"),
        currency="INR",
        status="failed",
        provider="razorpay",
        provider_payment_id="pay_test_123",
    )

    recovery_case = RecoveryCase(
        id=recovery_case_id,
        organisation_id=organisation_id,
        customer_id=customer_id,
        payment_id=payment_id,
        risk_amount=Decimal("5000.00"),
        risk_type="insufficient_funds",
        failure_reason="insufficient_funds",
        failure_code="BAD_REQUEST_ERROR",
        status="planned",
        current_step="execute_recovery",
        max_attempts=3,
    )

    recovery_action = RecoveryAction(
        id=uuid4(),
        recovery_case_id=recovery_case_id,
        action_type="CREATE_PAYMENT_LINK",
        status="planned",
        step_number=1,
    )

    payment_query = MagicMock()
    payment_query.filter.return_value.first.return_value = payment

    customer_query = MagicMock()
    customer_query.filter.return_value.first.return_value = None

    db.query.side_effect = [payment_query, customer_query]

    fake_razorpay = SimpleNamespace(
        create_payment_link=lambda **kwargs: {
            "id": "plink_test_123",
            "short_url": "https://rzp.io/i/test123",
        }
    )

    monkeypatch.setattr(execution, "get_razorpay_service", lambda: fake_razorpay)

    result = execution.execute_recovery_action(
        db=db,
        recovery_case=recovery_case,
        recovery_action=recovery_action,
    )

    assert result.status == "executed"
    assert result.result_data == {
        "payment_link_id": "plink_test_123",
        "short_url": "https://rzp.io/i/test123",
    }
    assert recovery_case.status == "waiting"
    assert recovery_case.current_step == "payment_link_created"
