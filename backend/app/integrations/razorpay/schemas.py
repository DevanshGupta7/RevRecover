from decimal import Decimal


def amount_to_subunits(
    amount: Decimal
) -> int:
    """
    Convert a major currency amount to the smallest currency unit.

    Example:
        Decimal("4500.00") -> 450000
    """

    return int(
        amount * Decimal(100)
    )


def subunits_to_amount(
    amount: int
) -> Decimal:
    """
    Convert Razorpay smallest-unit amount to major currency unit.

    Example:
        450000 -> Decimal("4500.00")
    """

    return Decimal(amount) / Decimal(100)
