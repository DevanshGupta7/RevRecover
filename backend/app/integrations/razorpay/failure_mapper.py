def extract_failure_information(payment: dict) -> tuple[str | None, str | None]:
    """
    Extract failure reason and code from a Razorpay payment.
    """

    error = payment.get("error")

    if not isinstance(error, dict):
        return None, None

    reason = error.get("description")
    code = error.get("code")

    return reason, code
