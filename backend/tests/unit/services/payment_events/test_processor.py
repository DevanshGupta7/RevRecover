from app.services.payment_events.status import should_update_payment_status


def test_captured_can_replace_failed():
    assert should_update_payment_status("failed", "captured")


def test_failed_does_not_replace_captured():
    assert not should_update_payment_status("captured", "failed")


def test_authorized_can_replace_failed():
    assert should_update_payment_status("failed", "authorized")
