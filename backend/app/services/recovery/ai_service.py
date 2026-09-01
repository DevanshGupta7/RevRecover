import logging
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.ai_decision import AIDecision
from app.models.payment import Payment
from app.models.recovery import RecoveryCase
from app.services.ai.openai_provider import OpenAIRecoveryProvider
from app.services.recovery.context import build_ai_context

logger = logging.getLogger(__name__)


def analyze_recovery_case(
    db: Session, payment: Payment, recovery_case: RecoveryCase
) -> AIDecision:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    context = build_ai_context(payment=payment, recovery_case=recovery_case)

    provider = OpenAIRecoveryProvider(
        api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL
    )

    decision = provider.analyze_recovery(context=context)

    ai_decision = AIDecision(
        organisation_id=recovery_case.organisation_id,
        recovery_case_id=recovery_case.id,
        provider="openai",
        model=settings.OPENAI_MODEL,
        diagnosis=decision.diagnosis,
        recommended_action=decision.recommended_action,
        recommended_delay_hours=decision.recommended_delay_hours,
        confidence=Decimal(str(decision.confidence)),
        reasoning_summary=decision.reasoning_summary,
        requires_human_approval=decision.requires_human_approval,
        input_context=context,
        raw_output=decision.model_dump(),
    )

    db.add(ai_decision)

    recovery_case.recovery_probability = Decimal(str(decision.confidence))
    recovery_case.status = "analyzed"
    recovery_case.current_step = "policy_validation"

    db.flush()

    logger.info(
        "AI recovery decision created | case_id=%s action=%s",
        recovery_case.id,
        decision.recommended_action,
    )

    return ai_decision
