from abc import ABC, abstractmethod
from pydantic import BaseModel


class RecoveryAIDecision(BaseModel):
    """
    Structured output produced by the AI recovery advisor.
    """

    diagnosis: str

    confidence: float

    recommended_action: str

    recommended_delay_hours: int | None

    reasoning_summary: str

    requires_human_approval: bool


class AIProvider(ABC):
    """
    Provider abstraction for AI recovery decisions.
    """

    @abstractmethod
    def analyze_recovery(
        self,
        context: dict
    ) -> RecoveryAIDecision:
        """
        Analyze a recovery case and return a structured decision.
        """
        raise NotImplementedError
