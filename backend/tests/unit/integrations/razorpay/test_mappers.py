from app.integrations.razorpay.mappers import map_payment_status


def test_map_captured_status():
    assert map_payment_status("captured") == "captured"


def test_map_failed_status():
    assert map_payment_status("failed") == "failed"


def test_unknown_status():
    assert map_payment_status("future_status") == "unknown"
