from types import SimpleNamespace
from unittest.mock import MagicMock
from uuid import uuid4

from app.services.payments import sync as sync_module


def test_sync_processes_multiple_pages_and_counts_new_attempts(monkeypatch):
    organisation_id = uuid4()
    pages = [
        [
            {
                "id": "pay_1",
                "amount": 1000,
                "currency": "INR",
                "status": "failed",
                "email": "one@example.com",
            }
        ],
        [
            {
                "id": "pay_2",
                "amount": 2000,
                "currency": "INR",
                "status": "captured",
                "email": "two@example.com",
            }
        ],
        [],
    ]
    provider = MagicMock()
    provider.get_payments.side_effect = pages
    db = MagicMock()
    db.begin_nested.return_value.__enter__.return_value = None
    monkeypatch.setattr(
        sync_module, "get_payment_by_provider_id", lambda *args, **kwargs: None
    )
    monkeypatch.setattr(
        sync_module, "process_payment_event", lambda **kwargs: SimpleNamespace()
    )

    result = sync_module.sync_razorpay_payments(
        db,
        organisation_id=organisation_id,
        provider=provider,
        count=1,
    )

    assert result == {
        "payments_fetched": 2,
        "payments_created": 2,
        "payments_updated": 0,
        "attempts_created": 2,
        "skipped": 0,
        "failed": 0,
    }
    assert [call.kwargs["skip"] for call in provider.get_payments.call_args_list] == [
        0,
        1,
        2,
    ]


def test_sync_marks_existing_payment_attempt_as_skipped(monkeypatch):
    existing_payment = SimpleNamespace(id=uuid4())
    existing_attempt = SimpleNamespace(id=uuid4())
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = existing_attempt
    db.begin_nested.return_value.__enter__.return_value = None
    provider = MagicMock()
    provider.get_payments.side_effect = [
        [
            {
                "id": "pay_existing",
                "amount": 1000,
                "status": "captured",
                "email": "one@example.com",
            }
        ],
        [],
    ]
    monkeypatch.setattr(
        sync_module,
        "get_payment_by_provider_id",
        lambda *args, **kwargs: existing_payment,
    )
    monkeypatch.setattr(
        sync_module, "process_payment_event", lambda **kwargs: existing_payment
    )

    result = sync_module.sync_razorpay_payments(
        db,
        organisation_id=uuid4(),
        provider=provider,
    )

    assert result["payments_created"] == 0
    assert result["payments_updated"] == 1
    assert result["attempts_created"] == 0
    assert result["skipped"] == 1
