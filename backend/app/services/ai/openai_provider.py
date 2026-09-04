import logging

from openai import OpenAI

from app.services.ai.provider import AIProvider, RecoveryAIDecision

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """
You are the AI recovery advisor for RevRecover.

RevRecover helps merchants recover failed payments.

You are an ADVISORY component.

You do NOT have permission to directly execute payments,
send messages, issue refunds, provide discounts, or perform
any financial action.

Your job is only to analyze the payment and customer context
and recommend a safe recovery action.

Allowed actions:

- RETRY
- CREATE_PAYMENT_LINK
- SEND_PAYMENT_REMINDER
- REQUEST_PAYMENT_METHOD_UPDATE
- WAIT
- ESCALATE
- STOP

Rules:

1. Never invent customer history.
2. Use only the supplied context.
3. Prefer conservative recommendations.
4. High-value payments may require human approval.
5. Never recommend actions outside the allowed action list.
6. Return structured information.
7. For expired cards, invalid payment methods, or cases where the
   customer needs to provide a new payment method, prefer
   CREATE_PAYMENT_LINK when it is supported by the recovery system.
8. Do not recommend REQUEST_PAYMENT_METHOD_UPDATE when a
   CREATE_PAYMENT_LINK can directly provide the customer with a
   secure way to complete the payment.
"""


class OpenAIRecoveryProvider(AIProvider):
    """
    OpenAI implementation of the recovery AI provider.
    """

    def __init__(self, api_key: str, model: str):
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def analyze_recovery(self, context: dict) -> RecoveryAIDecision:

        response = self.client.responses.parse(
            model=self.model,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (f"Analyze this recovery case:\n\n{context}"),
                },
            ],
            text_format=RecoveryAIDecision,
        )

        parsed = response.output_parsed

        if parsed is None:
            raise RuntimeError("AI provider returned no structured decision.")

        return parsed
