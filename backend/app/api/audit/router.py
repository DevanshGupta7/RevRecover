from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.core.exceptions import ResourceNotFoundException
from app.db.database import get_db
from app.models.audit import AuditLog
from app.services.audit import list_audit_events

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


def serialize(event: AuditLog) -> dict:
    return {
        "id": event.id,
        "timestamp": event.timestamp,
        "eventType": event.event_type,
        "eventName": event.event_name,
        "actor": event.actor,
        "entityType": event.entity_type,
        "entityId": event.entity_id,
        "result": event.result,
        "description": event.description,
        "decision": event.decision,
        "reason": event.reason,
        "action": event.action,
        "confidence": event.confidence,
        "metadata": event.metadata_json,
    }


@router.get("")
def get_audit_logs_endpoint(
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    event_type: str | None = None,
    result: str | None = None,
    search: str | None = None,
):
    _, membership = current_user
    events, total = list_audit_events(
        db, membership.organisation_id, page, page_size, event_type, result, search
    )
    return {
        "items": [serialize(event) for event in events],
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size,
        },
    }


@router.get("/{audit_id}")
def get_audit_log_endpoint(
    audit_id: str,
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user
    event = (
        db.query(AuditLog)
        .filter(
            AuditLog.id == audit_id,
            AuditLog.organisation_id == membership.organisation_id,
        )
        .first()
    )
    if event is None:
        raise ResourceNotFoundException(message="Audit event not found.")
    return serialize(event)
