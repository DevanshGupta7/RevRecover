from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.db.database import get_db
from app.services.analytics import get_analytics_overview

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
def get_analytics_overview_endpoint(
    current_user: Annotated[tuple, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    _, membership = current_user
    return get_analytics_overview(db, membership.organisation_id)
