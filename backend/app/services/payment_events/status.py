PAYMENT_STATUS_PRIORITY = {
    "created": 10,
    "failed": 20,
    "authorized": 30,
    "captured": 40,
    "refunded": 50
}

def should_update_payment_status(
    current_status: str | None,
    incoming_status: str | None
) -> bool:
    """
    Determine whether an incoming provider status should replace
    the current internal payment status.
    """

    if not incoming_status:
        return False

    if not current_status:
        return True

    current_priority = PAYMENT_STATUS_PRIORITY.get(
        current_status,
        0
    )

    incoming_priority = PAYMENT_STATUS_PRIORITY.get(
        incoming_status,
        0
    )

    return incoming_priority >= current_priority
