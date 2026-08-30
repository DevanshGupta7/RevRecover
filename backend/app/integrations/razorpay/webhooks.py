import hashlib
import hmac

from app.integrations.razorpay.exceptions import RazorpaySignatureException


def verify_webhook_signature(raw_body: bytes, signature: str, secret: str) -> None:
    """
    Verify the Razorpay webhook signature.

    The raw request body must be used without parsing or
    re-serializing it.
    """

    if not secret:
        raise RazorpaySignatureException("Razorpay webhook secret is not configured.")

    if not signature:
        raise RazorpaySignatureException("Razorpay webhook signature is missing.")

    expected_signature = hmac.new(
        secret.encode("utf-8"), raw_body, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        raise RazorpaySignatureException("Invalid Razorpay webhook signature.")
