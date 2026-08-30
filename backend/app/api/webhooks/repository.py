from datetime import datetime
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.webhook_event import WebhookEvent


def get_webhook_event_by_provider_id(
    db: Session, *, provider: str, provider_event_id: str
) -> WebhookEvent | None:
    return (
        db.query(WebhookEvent)
        .filter(
            WebhookEvent.provider == provider,
            WebhookEvent.provider_event_id == provider_event_id,
        )
        .first()
    )


def create_webhook_event(
    db: Session,
    *,
    organisation_id: UUID,
    provider: str,
    provider_event_id: str,
    provider_account_id: str | None,
    event_type: str,
    payload: dict,
    signature: str | None,
    provider_created_at: datetime | None,
) -> tuple[WebhookEvent, bool]:
    event = WebhookEvent(
        organisation_id=organisation_id,
        provider=provider,
        provider_event_id=provider_event_id,
        provider_account_id=provider_account_id,
        event_type=event_type,
        payload=payload,
        signature=signature,
        provider_created_at=provider_created_at,
        status="received",
    )

    db.add(event)

    try:
        db.flush()
    except IntegrityError:
        db.rollback()

        existing = get_webhook_event_by_provider_id(
            db, provider=provider, provider_event_id=provider_event_id
        )

        if existing:
            return existing, False

        raise

    return event, True
