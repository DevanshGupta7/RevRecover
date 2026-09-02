from uuid import UUID, uuid4

from app.services.payment_events.recovery_reference import (
    recovery_case_id_from_reference,
    recovery_reference_from_case_id,
)


def test_recovery_reference_round_trips_with_emitted_format():
    recovery_case_id = uuid4()

    reference = recovery_reference_from_case_id(recovery_case_id)

    assert reference == f"RR-{recovery_case_id}"
    assert recovery_case_id_from_reference(reference) == recovery_case_id


def test_legacy_colon_recovery_reference_remains_supported():
    recovery_case_id = uuid4()

    assert recovery_case_id_from_reference(
        f"RR:{recovery_case_id}"
    ) == recovery_case_id