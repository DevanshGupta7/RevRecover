from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.organisations.dependencies import get_current_organisation_id
from app.api.payments.schemas import (
    CustomerCreateRequest,
    CustomerListResponse,
    CustomerResponse,
    PaymentAttemptResponse,
    PaymentDetailResponse,
    PaymentListResponse,
)
from app.api.payments.service import (
    create_new_customer,
    get_customer,
    get_payment_detail,
    list_customer_payments,
    list_customers,
    list_payment_attempts,
    list_payments,
)
from app.db.database import get_db

router = APIRouter(
    tags=["Payments"]
)

OrganisationId = Annotated[
    UUID,
    Depends(get_current_organisation_id)
]

@router.get(
    "/payments",
    response_model=PaymentListResponse
)
def get_payments_endpoint(
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ],
    page: int = Query(
        default=1,
        ge=1
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100
    ),
    payment_status: str | None = Query(
        default=None,
        alias="status"
    )
):
    """
    List payments belonging to the current organisation.
    """

    return list_payments(
        db=db,
        organisation_id=organisation_id,
        page=page,
        page_size=page_size,
        status=payment_status
    )

@router.get(
    "/payments/{payment_id}",
    response_model=PaymentDetailResponse,
)
def get_payment_endpoint(
    payment_id: UUID,
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Return one organisation-owned payment with attempt count.
    """

    return get_payment_detail(
        db=db,
        organisation_id=organisation_id,
        payment_id=payment_id
    )

@router.get(
    "/payments/{payment_id}/attempts",
    response_model=list[PaymentAttemptResponse]
)
def get_payment_attempts_endpoint(
    payment_id: UUID,
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Return attempts for an organisation-owned payment.
    """

    return list_payment_attempts(
        db=db,
        organisation_id=organisation_id,
        payment_id=payment_id
    )

@router.get(
    "/customers",
    response_model=CustomerListResponse
)
def get_customers_endpoint(
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ],
    page: int = Query(
        default=1,
        ge=1
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100
    )
):
    """
    List customers belonging to the current organisation.
    """

    return list_customers(
        db=db,
        organisation_id=organisation_id,
        page=page,
        page_size=page_size
    )

@router.post(
    "/customers",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED
)
def create_customer_endpoint(
    request: CustomerCreateRequest,
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Create a customer inside the current organisation.
    """

    return create_new_customer(
        db=db,
        organisation_id=organisation_id,
        request=request
    )

@router.get(
    "/customers/{customer_id}",
    response_model=CustomerResponse
)
def get_customer_endpoint(
    customer_id: UUID,
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ]
):
    """
    Return one organisation-owned customer.
    """

    return get_customer(
        db=db,
        organisation_id=organisation_id,
        customer_id=customer_id
    )

@router.get(
    "/customers/{customer_id}/payments",
    response_model=PaymentListResponse
)
def get_customer_payments_endpoint(
    customer_id: UUID,
    organisation_id: OrganisationId,
    db: Annotated[
        Session,
        Depends(get_db)
    ],
    page: int = Query(
        default=1,
        ge=1
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100
    )
):
    """
    Return payments belonging to an organisation-owned customer.
    """

    return list_customer_payments(
        db=db,
        organisation_id=organisation_id,
        customer_id=customer_id,
        page=page,
        page_size=page_size
    )
