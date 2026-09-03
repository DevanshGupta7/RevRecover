from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import MagicMock
from uuid import uuid4

from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryCase
from app.services.payment_events.parser import ParsedPaymentEvent
from app.services.recovery import execution
from app.services.recovery.reconciliation import record_payment_link_payment_event


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
            "reference_id": f"RR-{recovery_case_id}",
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
        "reference_id": f"RR-{recovery_case_id}",
    }
    assert recovery_case.status == "waiting"
    assert recovery_case.current_step == "payment_link_created"


def test_payment_link_execution_records_audit_events(monkeypatch):
    db = MagicMock()
    organisation_id = uuid4()
    payment_id = uuid4()
    recovery_case_id = uuid4()

    payment = Payment(
        id=payment_id,
        organisation_id=organisation_id,
        customer_id=uuid4(),
        amount=Decimal("5000.00"),
        currency="INR",
        status="failed",
        provider="razorpay",
    )
    recovery_case = RecoveryCase(
        id=recovery_case_id,
        organisation_id=organisation_id,
        customer_id=payment.customer_id,
        payment_id=payment_id,
        risk_amount=payment.amount,
        risk_type="insufficient_funds",
        status="planned",
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

    audit_events = []
    monkeypatch.setattr(
        execution,
        "record_audit_event",
        lambda _db, _organisation_id, **values: audit_events.append(values),
    )
    monkeypatch.setattr(
        execution,
        "get_razorpay_service",
        lambda: SimpleNamespace(
            create_payment_link=lambda **kwargs: {
                "id": "plink_test_456",
                "short_url": "https://rzp.io/i/test456",
                "reference_id": f"RR-{recovery_case_id}",
            }
        ),
    )

    execution.execute_recovery_action(db, recovery_case, recovery_action)

    assert [event["event_type"] for event in audit_events] == [
        "recovery_action_executed",
        "payment_link_created",
    ]


def test_payment_captured_does_not_reconcile_payment_link_recovery():
    db = MagicMock()
    recovery_case = RecoveryCase(id=uuid4(), organisation_id=uuid4())
    action = RecoveryAction(
        id=uuid4(),
        recovery_case_id=recovery_case.id,
        action_type="CREATE_PAYMENT_LINK",
        result_data={"payment_link_id": "plink_test_123"},
    )
    action_query = MagicMock()
    action_query.all.return_value = [(action, recovery_case)]
    action_query.join.return_value = action_query
    action_query.filter.return_value = action_query
    db.query.return_value = action_query

    handled = record_payment_link_payment_event(
        db,
        organisation_id=recovery_case.organisation_id,
        parsed_event=ParsedPaymentEvent(
            event_type="payment.captured",
            provider_event_id="evt_captured",
            provider_account_id="acc_test",
            reference_id=None,
            payment_link_id="plink_test_123",
            payment_id="pay_new",
            order_id=None,
            amount_subunits=500000,
            currency="INR",
            payment_status="captured",
            failure_reason=None,
            failure_code=None,
            provider_created_at=None,
            customer_name=None,
            customer_email=None,
            customer_phone=None,
        ),
    )

    assert handled is True
    db.add.assert_not_called()
