ALLOWED_AI_ACTIONS = {
    "RETRY",
    "SEND_PAYMENT_REMINDER",
    "REQUEST_PAYMENT_METHOD_UPDATE",
    "WAIT",
    "ESCALATE",
    "STOP",
}


RECOVERY_STATUSES = {
    "detected",
    "analyzing",
    "planned",
    "awaiting_approval",
    "executing",
    "waiting",
    "recovered",
    "failed",
    "escalated",
    "stopped",
}


RETRYABLE_FAILURE_CODES = {
    "INSUFFICIENT_FUNDS",
    "TEMPORARY_ERROR",
    "BANK_ERROR",
    "NETWORK_ERROR",
    "GATEWAY_ERROR",
}


NON_RETRYABLE_FAILURE_CODES = {"INVALID_CARD", "EXPIRED_CARD", "CARD_NOT_SUPPORTED"}
