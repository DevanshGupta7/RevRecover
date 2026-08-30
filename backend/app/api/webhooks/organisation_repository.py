
from sqlalchemy.orm import Session

from app.models.organisation import Organisation


def get_organisation_by_razorpay_account_id(
    db: Session,
    razorpay_account_id: str
) -> Organisation | None:
    return (
        db.query(Organisation)
        .filter(
            Organisation.razorpay_account_id
            == razorpay_account_id
        )
        .first()
    )
