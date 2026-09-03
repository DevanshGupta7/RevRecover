from types import SimpleNamespace

from app.integrations.razorpay.service import RazorpayService


def test_get_payments_uses_supported_pagination_parameters():
    payment_api = SimpleNamespace(all=lambda params: {"items": [{"id": "pay_test"}]})
    service = RazorpayService(
        client=SimpleNamespace(client=SimpleNamespace(payment=payment_api))
    )

    result = service.get_payments(
        count=25,
        skip=50,
        from_timestamp=100,
        to_timestamp=200,
    )

    assert result == [{"id": "pay_test"}]
