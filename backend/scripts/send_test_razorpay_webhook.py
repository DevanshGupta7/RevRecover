"""
Send a simulated Razorpay payment.failed webhook
to the local RevRecover backend.

This script is for local development/testing only.
It does not contact the real Razorpay API.
"""

import hashlib
import hmac
import json
import sys
import time
import urllib.error
import urllib.request
import uuid

from app.core.config import settings

# ============================================================
# CONFIGURATION
# ============================================================

WEBHOOK_URL = "http://127.0.0.1:8000/webhooks/razorpay"

RAZORPAY_ACCOUNT_ID = "acc_123"

CUSTOMER_EMAIL = "rahul.test@gmail.com"

TEST_PAYMENT_ID = f"pay_test_{uuid.uuid4().hex[:16]}"

TEST_EVENT_ID = f"evt_test_{uuid.uuid4().hex}"


# ₹4,500 = 450000 paise
AMOUNT_SUBUNITS = 4500000


# ============================================================
# VALIDATION
# ============================================================

if RAZORPAY_ACCOUNT_ID.startswith("REPLACE_"):
    print(
        "ERROR: Replace RAZORPAY_ACCOUNT_ID with the "
        "Razorpay account ID associated with your organisation."
    )
    sys.exit(1)


if not settings.RAZORPAY_WEBHOOK_SECRET:
    print("ERROR: RAZORPAY_WEBHOOK_SECRET is not configured.")
    sys.exit(1)


# ============================================================
# BUILD PAYMENT.FAILED PAYLOAD
# ============================================================

payload = {
    "entity": "event",
    "account_id": RAZORPAY_ACCOUNT_ID,
    "event": "payment.failed",
    "contains": ["payment"],
    "payload": {
        "payment": {
            "entity": {
                "id": TEST_PAYMENT_ID,
                "entity": "payment",
                "amount": AMOUNT_SUBUNITS,
                "currency": "INR",
                "status": "failed",
                "order_id": None,
                "email": CUSTOMER_EMAIL,
                "contact": "+919876543210",
                "method": "card",
                "error_code": "INSUFFICIENT_FUNDS",
                "error_description": "Insufficient funds",
                "error": {
                    "code": "INSUFFICIENT_FUNDS",
                    "description": "Insufficient funds",
                    "source": "bank",
                    "step": "payment_authentication",
                    "reason": "insufficient_funds",
                },
            }
        }
    },
    "created_at": int(time.time()),
}


# ============================================================
# SERIALIZE EXACTLY ONCE
# ============================================================

raw_body = json.dumps(payload, separators=(",", ":")).encode("utf-8")


# ============================================================
# GENERATE RAZORPAY WEBHOOK SIGNATURE
# ============================================================

signature = hmac.new(
    settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256
).hexdigest()


# ============================================================
# BUILD HTTP REQUEST
# ============================================================

request = urllib.request.Request(
    WEBHOOK_URL,
    data=raw_body,
    method="POST",
    headers={
        "Content-Type": "application/json",
        "X-Razorpay-Signature": signature,
        "X-Razorpay-Event-Id": TEST_EVENT_ID,
    },
)


# ============================================================
# SEND WEBHOOK
# ============================================================

print()
print("=" * 60)
print("RevRecover Razorpay Webhook Test")
print("=" * 60)
print()

print(f"Webhook URL: {WEBHOOK_URL}")
print("Event:       payment.failed")
print(f"Event ID:    {TEST_EVENT_ID}")
print(f"Payment ID:  {TEST_PAYMENT_ID}")
print("Amount:      ₹4,500")
print("Currency:    INR")
print(f"Customer:    {CUSTOMER_EMAIL}")
print("Failure:     Insufficient funds")
print("FailureCode: INSUFFICIENT_FUNDS")
print()

try:
    with urllib.request.urlopen(request, timeout=15) as response:
        response_body = response.read().decode("utf-8")

        print(f"HTTP Status: {response.status}")

        print(f"Response:    {response_body}")

        print()

        if response.status == 200:
            print("SUCCESS: Webhook accepted by RevRecover.")
        else:
            print("WARNING: Webhook returned a non-200 response.")

except urllib.error.HTTPError as exc:
    response_body = exc.read().decode("utf-8", errors="replace")

    print(f"HTTP Status: {exc.code}")

    print(f"Response:    {response_body}")

    print()
    print("ERROR: RevRecover rejected the webhook.")

    sys.exit(1)

except urllib.error.URLError as exc:
    print("ERROR: Could not connect to the backend.")

    print(f"Reason: {exc.reason}")

    print()
    print("Make sure FastAPI is running:")

    print("uvicorn app.main:app --reload")

    sys.exit(1)
