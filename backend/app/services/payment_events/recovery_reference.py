from uuid import UUID


def recovery_reference_from_case_id(recovery_case_id: UUID) -> str:
    return f"RR-{recovery_case_id}"


def recovery_case_id_from_reference(
    reference_id: str | None,
) -> UUID:
    """
    Extract a RecoveryCase UUID from a Razorpay Payment Link
    reference ID.

    Expected format:
        RR-<recovery_case_uuid>

    The colon form is accepted for compatibility with older links.
    """

    if not reference_id:
        raise ValueError("Recovery reference ID is missing.")

    reference_id = reference_id.strip()

    if reference_id.startswith(("RR-", "RR:")):
        raw_uuid = reference_id[3:]
    else:
        raise ValueError("Invalid RevRecover recovery reference.")

    try:
        return UUID(raw_uuid)
    except ValueError as exc:
        raise ValueError("Invalid recovery case ID in reference.") from exc
