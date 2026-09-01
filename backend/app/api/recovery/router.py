from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.api.recovery.schemas import (
    AIDecisionResponse,
    RecoveryActionResponse,
    RecoveryCaseResponse,
    RecoveryProcessResponse,
)
from app.core.exceptions import ResourceNotFoundException
from app.db.database import get_db
from app.services.recovery.execution import execute_recovery_action
from app.services.recovery.repository import (
    get_ai_decision,
    get_recovery_action,
    get_recovery_actions,
    get_recovery_case,
    get_recovery_cases,
)
from app.services.recovery.service import RecoveryService

router = APIRouter(prefix="/recovery", tags=["Recovery"])


@router.get("", response_model=list[RecoveryCaseResponse])
def list_recovery_cases(
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    _, membership = current_user

    return get_recovery_cases(
        db=db, organisation_id=membership.organisation_id, limit=limit, offset=offset
    )


@router.get("/{recovery_case_id}", response_model=RecoveryCaseResponse)
def get_recovery_case_endpoint(
    recovery_case_id: UUID,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user

    recovery_case = get_recovery_case(
        db=db,
        recovery_case_id=recovery_case_id,
        organisation_id=membership.organisation_id,
    )

    if recovery_case is None:
        raise ResourceNotFoundException(message="Recovery case not found.")

    return recovery_case


@router.get("/{recovery_case_id}/ai", response_model=AIDecisionResponse)
def get_recovery_ai(
    recovery_case_id: UUID,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user

    recovery_case = get_recovery_case(
        db=db,
        recovery_case_id=recovery_case_id,
        organisation_id=membership.organisation_id,
    )

    if recovery_case is None:
        raise ResourceNotFoundException(message="Recovery case not found.")

    decision = get_ai_decision(
        db=db,
        recovery_case_id=recovery_case_id,
        organisation_id=membership.organisation_id,
    )

    if decision is None:
        raise ResourceNotFoundException(message="AI decision not found.")

    return decision


@router.get("/{recovery_case_id}/actions", response_model=list[RecoveryActionResponse])
def get_recovery_actions_endpoint(
    recovery_case_id: UUID,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user

    recovery_case = get_recovery_case(
        db=db,
        recovery_case_id=recovery_case_id,
        organisation_id=membership.organisation_id,
    )

    if recovery_case is None:
        raise ResourceNotFoundException(message="Recovery case not found.")

    return get_recovery_actions(db=db, recovery_case_id=recovery_case_id)


@router.post(
    "/actions/{recovery_action_id}/execute",
    response_model=RecoveryActionResponse,
)
def execute_recovery_action_endpoint(
    recovery_action_id: UUID,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user

    recovery_action = get_recovery_action(
        db=db,
        recovery_action_id=recovery_action_id,
        organisation_id=membership.organisation_id,
    )

    if recovery_action is None:
        raise ResourceNotFoundException(message="Recovery action not found.")

    recovery_case = get_recovery_case(
        db=db,
        recovery_case_id=recovery_action.recovery_case_id,
        organisation_id=membership.organisation_id,
    )

    if recovery_case is None:
        raise ResourceNotFoundException(message="Recovery case not found.")

    result = execute_recovery_action(
        db=db,
        recovery_case=recovery_case,
        recovery_action=recovery_action,
    )

    db.commit()

    return result


@router.post(
    "/payments/{payment_id}/process",
    response_model=RecoveryProcessResponse,
    status_code=status.HTTP_201_CREATED,
)
def process_payment_recovery(
    payment_id: UUID,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user

    result = RecoveryService().process_payment(
        db=db, payment_id=payment_id, organisation_id=membership.organisation_id
    )

    if result is None:
        raise ResourceNotFoundException(
            message="Payment is not eligible for recovery or recovery case already exists."
        )

    recovery_case, ai_decision, recovery_action = result

    return RecoveryProcessResponse(
        recovery_case=recovery_case,
        ai_decision=ai_decision,
        recovery_action=recovery_action,
    )
