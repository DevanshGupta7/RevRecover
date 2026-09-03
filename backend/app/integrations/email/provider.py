from typing import Protocol


class EmailProvider(Protocol):
    def send(self, *, to: str, subject: str, html: str) -> str:
        """Send an email and return the provider message ID."""
