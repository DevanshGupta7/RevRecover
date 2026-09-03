from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RecoveryStrategyResponse(BaseModel):
    failure_type: str
    label: str
    recommended_action: str
    action_type: str
    delay_hours: int | None
    channel: str | None
    reason: str
    cases: int
    recovered_amount: Decimal
    success_rate: Decimal


class RecoveryPolicyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID | None
    name: str | None
    max_attempts: int | None
    min_hours_between_attempts: int | None
    max_recovery_amount: Decimal | None
    allowed_channels: list
    allow_discount: bool
    require_approval_above: Decimal | None
    stop_after_success: bool
    is_active: bool


class RecoveryStrategiesResponse(BaseModel):
    strategies: list[RecoveryStrategyResponse]
    policy: RecoveryPolicyResponse


class RecoveryActionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    action_type: str
    status: str
    step_number: int
    planned_at: datetime | None
    executed_at: datetime | None
    result_data: dict | None


class AIDecisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    diagnosis: str
    recommended_action: str
    recommended_delay_hours: int | None
    confidence: Decimal
    reasoning_summary: str
    requires_human_approval: bool


class RecoveryCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organisation_id: UUID
    customer_id: UUID
    payment_id: UUID
    risk_amount: Decimal
    risk_type: str
    failure_reason: str | None
    failure_code: str | None
    risk_score: Decimal | None
    recovery_probability: Decimal | None
    status: str
    current_step: str | None
    max_attempts: int
    started_at: datetime | None
    stopped_at: datetime | None
    recovered_at: datetime | None
    recovered_amount: Decimal | None
    created_at: datetime
    updated_at: datetime


class RecoveryProcessResponse(BaseModel):
    success: bool = True
    already_exists: bool = False
    recovery_case: RecoveryCaseResponse
    ai_decision: AIDecisionResponse | None = None
    recovery_action: RecoveryActionResponse | None = None
