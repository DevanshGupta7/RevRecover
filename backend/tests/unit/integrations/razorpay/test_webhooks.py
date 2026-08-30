import hashlib
import hmac

import pytest

from app.integrations.razorpay.exceptions import RazorpaySignatureException
from app.integrations.razorpay.webhooks import verify_webhook_signature


def generate_signature(body: bytes, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()


def test_valid_webhook_signature():
    body = b'{"event":"payment.failed"}'
    secret = "test_secret"

    signature = generate_signature(body, secret)

    verify_webhook_signature(raw_body=body, signature=signature, secret=secret)


def test_invalid_webhook_signature():
    body = b'{"event":"payment.failed"}'

    with pytest.raises(RazorpaySignatureException):
        verify_webhook_signature(
            raw_body=body, signature="invalid", secret="test_secret"
        )


def test_modified_body_fails_signature():
    body = b'{"event":"payment.failed"}'
    secret = "test_secret"

    signature = generate_signature(body, secret)

    modified_body = b'{"event": "payment.failed"}'

    with pytest.raises(RazorpaySignatureException):
        verify_webhook_signature(
            raw_body=modified_body, signature=signature, secret=secret
        )
