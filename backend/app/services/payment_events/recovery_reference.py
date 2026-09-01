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
        recovery:<recovery_case_uuid>
    """

    if not reference_id:
        raise ValueError("Recovery reference ID is missing.")
    
    reference_id = reference_id.strip()

    if not reference_id.startswith("RR:"):
        raise ValueError("Invalid RevRecover recovery reference.")

    raw_uuid = reference_id[3:]

    try:
        return UUID(raw_uuid)
    except ValueError as exc:
        raise ValueError(
            "Invalid recovery case ID in reference."
        ) from exc
