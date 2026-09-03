from unittest.mock import MagicMock

import httpx
import pytest

from app.integrations.email.exceptions import EmailDeliveryException
from app.integrations.email.resend import ResendEmailProvider


def test_resend_provider_sends_expected_payload(monkeypatch):
    monkeypatch.setattr("app.integrations.email.resend.settings.EMAIL_ENABLED", True)
    monkeypatch.setattr(
        "app.integrations.email.resend.settings.RESEND_API_KEY", "re_test"
    )
    monkeypatch.setattr(
        "app.integrations.email.resend.settings.RECOVERY_EMAIL_FROM",
        "payments@example.com",
    )
    response = MagicMock()
    response.json.return_value = {"id": "email_123"}
    monkeypatch.setattr(
        "app.integrations.email.resend.httpx.post", lambda *args, **kwargs: response
    )

    provider = ResendEmailProvider()
    message_id = provider.send(
        to="customer@example.com",
        subject="Payment recovery",
        html="<p>Please retry.</p>",
    )

    assert message_id == "email_123"
    response.raise_for_status.assert_called_once_with()


def test_resend_provider_wraps_provider_failure(monkeypatch):
    monkeypatch.setattr("app.integrations.email.resend.settings.EMAIL_ENABLED", True)
    monkeypatch.setattr(
        "app.integrations.email.resend.settings.RESEND_API_KEY", "re_test"
    )
    monkeypatch.setattr(
        "app.integrations.email.resend.settings.RECOVERY_EMAIL_FROM",
        "payments@example.com",
    )
    response = MagicMock()
    response.raise_for_status.side_effect = httpx.HTTPError("provider error")
    monkeypatch.setattr(
        "app.integrations.email.resend.httpx.post", lambda *args, **kwargs: response
    )

    with pytest.raises(EmailDeliveryException):
        ResendEmailProvider().send(
            to="customer@example.com",
            subject="Payment recovery",
            html="<p>Please retry.</p>",
        )
