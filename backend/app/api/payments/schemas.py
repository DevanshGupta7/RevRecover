from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PaymentAttemptResponse(BaseModel):
    """Public payment attempt representation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    payment_id: UUID
    attempt_number: int
    status: str
    provider_attempt_id: str | None
    failure_reason: str | None
    failure_code: str | None
    attempted_at: datetime
    created_at: datetime


class PaymentResponse(BaseModel):
    """Public payment representation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organisation_id: UUID
    customer_id: UUID
    amount: Decimal
    currency: str
    status: str
    provider: str
    provider_payment_id: str | None
    failure_reason: str | None
    failure_code: str | None
    created_at: datetime
    updated_at: datetime


class PaymentDetailResponse(PaymentResponse):
    """Detailed payment representation."""

    attempt_count: int = 0


class CustomerResponse(BaseModel):
    """Public customer representation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organisation_id: UUID
    external_customer_id: str | None
    name: str | None
    email: str | None
    phone: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class CustomerCreateRequest(BaseModel):
    """Create a customer."""

    external_customer_id: str | None = Field(default=None, max_length=255)

    name: str | None = Field(default=None, max_length=255)

    email: str | None = Field(default=None, max_length=320)

    phone: str | None = Field(default=None, max_length=50)


class CustomerPaymentSummary(BaseModel):
    """Customer payment summary."""

    total_payments: int
    successful_payments: int
    failed_payments: int
    total_paid: Decimal
    total_failed_amount: Decimal


class PaginationMeta(BaseModel):
    """Pagination information."""

    page: int
    page_size: int
    total: int
    total_pages: int


class PaymentListResponse(BaseModel):
    """Paginated payment response."""

    items: list[PaymentResponse]
    pagination: PaginationMeta


class CustomerListResponse(BaseModel):
    """Paginated customer response."""

    items: list[CustomerResponse]
    pagination: PaginationMeta
