RAZORPAY_PAYMENT_STATUS_MAP = {
    "created": "created",
    "authorized": "authorized",
    "captured": "captured",
    "failed": "failed",
    "refunded": "refunded"
}


def map_payment_status(
    provider_status: str
) -> str:
    """
    Convert Razorpay payment status to RevRecover status.
    """

    return RAZORPAY_PAYMENT_STATUS_MAP.get(
        provider_status,
        "unknown"
    )
