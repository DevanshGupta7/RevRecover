import pytest

from app.services.payment_events.parser import parse_payment_event


def test_parse_payment_failed_event():
    payload = {
        "account_id": "acc_test",
        "event": "payment.failed",
        "created_at": 1700000000,
        "payload": {
            "payment": {
                "entity": {
                    "id": "pay_test",
                    "amount": 450000,
                    "currency": "INR",
                    "status": "failed",
                    "order_id": "order_test",
                    "email": "test@example.com",
                    "contact": "9999999999",
                    "error": {
                        "code": "BAD_REQUEST_ERROR",
                        "description": "Payment failed"
                    }
                }
            }
        }
    }

    event = parse_payment_event(
        payload=payload,
        provider_event_id="evt_test"
    )

    assert event.event_type == "payment.failed"
    assert event.payment_id == "pay_test"
    assert event.order_id == "order_test"
    assert event.amount_subunits == 450000
    assert event.currency == "INR"
    assert event.payment_status == "failed"
    assert event.failure_code == "BAD_REQUEST_ERROR"


def test_unsupported_event_is_rejected():
    payload = {
        "account_id": "acc_test",
        "event": "payment.unknown",
        "created_at": 1700000000,
        "payload": {}
    }

    with pytest.raises(ValueError):
        parse_payment_event(
            payload=payload,
            provider_event_id="evt_test"
        )

def test_missing_payment_id_is_rejected():
    payload = {
        "account_id": "acc_test",
        "event": "payment.failed",
        "created_at": 1700000000,
        "payload": {
            "payment": {
                "entity": {
                    "amount": 450000,
                    "currency": "INR",
                    "status": "failed"
                }
            }
        }
    }

    with pytest.raises(ValueError):
        parse_payment_event(
            payload=payload,
            provider_event_id="evt_test"
        )
