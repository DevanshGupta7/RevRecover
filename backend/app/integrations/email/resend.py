import httpx

from app.core.config import settings
from app.integrations.email.exceptions import (
    EmailConfigurationException,
    EmailDeliveryException,
)


class ResendEmailProvider:
    """Send transactional email through the Resend REST API."""

    def __init__(self) -> None:
        if not settings.EMAIL_ENABLED:
            raise EmailConfigurationException("Email integration is disabled.")
        if not settings.RESEND_API_KEY or not settings.RECOVERY_EMAIL_FROM:
            raise EmailConfigurationException(
                "RESEND_API_KEY and RECOVERY_EMAIL_FROM must be configured."
            )

    def send(self, *, to: str, subject: str, html: str) -> str:
        try:
            response = httpx.post(
                settings.RESEND_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.RECOVERY_EMAIL_FROM,
                    "to": [to],
                    "subject": subject,
                    "html": html,
                },
                timeout=15.0,
            )
            response.raise_for_status()
            message_id = response.json().get("id")
        except (httpx.HTTPError, ValueError) as error:
            raise EmailDeliveryException(
                "Email provider failed to deliver the message."
            ) from error

        if not message_id:
            raise EmailDeliveryException("Email provider returned no message ID.")

        return str(message_id)
