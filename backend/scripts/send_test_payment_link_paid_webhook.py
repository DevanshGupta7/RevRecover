"""Send a signed local payment_link.paid webhook for recovery testing."""

import hashlib
import hmac
import json
import sys
import time
import urllib.request
import uuid

from app.core.config import settings

WEBHOOK_URL = "http://127.0.0.1:8000/webhooks/razorpay"
ACCOUNT_ID = sys.argv[4] if len(sys.argv) > 4 else "acc_TSQqllHjAAmAXx"

PAYMENT_LINK_ID = sys.argv[1] if len(sys.argv) > 1 else "plink_REPLACE_ME"
REFERENCE_ID = sys.argv[2] if len(sys.argv) > 2 else "RR-REPLACE_ME"
AMOUNT_SUBUNITS = int(sys.argv[3]) if len(sys.argv) > 3 else 10000000

if "REPLACE_ME" in PAYMENT_LINK_ID or "REPLACE_ME" in REFERENCE_ID:
    raise SystemExit(
        "Usage: python scripts/send_test_payment_link_paid_webhook.py "
        "plink_<id> RR-<recovery-case-uuid> <amount-in-paise> [account_id]"
    )

payload = {
    "entity": "event",
    "account_id": ACCOUNT_ID,
    "event": "payment_link.paid",
    "payload": {
        "payment_link": {
            "entity": {
                "id": PAYMENT_LINK_ID,
                "reference_id": REFERENCE_ID,
            }
        },
        "payment": {
            "entity": {
                "id": f"pay_test_{uuid.uuid4().hex[:16]}",
                "amount": AMOUNT_SUBUNITS,
                "currency": "INR",
                "status": "captured",
            }
        },
    },
    "created_at": int(time.time()),
}

raw_body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
signature = hmac.new(
    settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256
).hexdigest()

request = urllib.request.Request(
    WEBHOOK_URL,
    data=raw_body,
    method="POST",
    headers={
        "Content-Type": "application/json",
        "X-Razorpay-Signature": signature,
        "X-Razorpay-Event-Id": f"evt_test_{uuid.uuid4().hex}",
    },
)

with urllib.request.urlopen(request, timeout=15) as response:
    print(response.status, response.read().decode("utf-8"))
