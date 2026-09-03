from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def record_audit_event(db: Session, organisation_id: UUID, **values) -> AuditLog:
    event = AuditLog(organisation_id=organisation_id, **values)
    db.add(event)
    return event


def list_audit_events(
    db: Session,
    organisation_id: UUID,
    page: int,
    page_size: int,
    event_type: str | None = None,
    result: str | None = None,
    search: str | None = None,
) -> tuple[list[AuditLog], int]:
    query = db.query(AuditLog).filter(AuditLog.organisation_id == organisation_id)
    if event_type:
        query = query.filter(AuditLog.event_type == event_type)
    if result:
        query = query.filter(AuditLog.result == result)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                AuditLog.event_name.ilike(term),
                AuditLog.description.ilike(term),
                AuditLog.entity_id.ilike(term),
            )
        )
    total = query.count()
    events = (
        query.order_by(AuditLog.timestamp.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return events, total
