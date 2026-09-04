from collections import defaultdict
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.recovery import RecoveryAction, RecoveryAttempt, RecoveryCase


def _money(value: Decimal | int | None) -> float:
    return float(value or 0)


def get_analytics_overview(db: Session, organisation_id: UUID) -> dict:
    failed_payments = db.query(Payment).filter(
        Payment.organisation_id == organisation_id,
        Payment.status == "failed",
    )
    cases = db.query(RecoveryCase).filter(
        RecoveryCase.organisation_id == organisation_id
    )

    risk = cases.with_entities(
        func.coalesce(func.sum(RecoveryCase.risk_amount), 0)
    ).scalar()
    recovered = (
        cases.filter(RecoveryCase.status == "recovered")
        .with_entities(func.coalesce(func.sum(RecoveryCase.recovered_amount), 0))
        .scalar()
    )
    failed_payment_count = failed_payments.count()
    failed_revenue = failed_payments.with_entities(
        func.coalesce(func.sum(Payment.amount), 0)
    ).scalar()
    case_count = cases.count()
    recovery_rate = (
        (_money(recovered) / _money(failed_revenue) * 100) if failed_revenue else 0
    )

    outcome_rows = (
        cases.with_entities(RecoveryCase.status, func.count(RecoveryCase.id))
        .group_by(RecoveryCase.status)
        .all()
    )
    outcome_counts = defaultdict(int)
    for status, count in outcome_rows:
        outcome = {
            "recovered": "Recovered",
            "failed": "Failed",
            "stopped": "Stopped",
        }.get(status, "Waiting")
        outcome_counts[outcome] += count
    outcomes = [
        {
            "outcome": name,
            "count": outcome_counts[name],
            "percentage": round(outcome_counts[name] / case_count * 100, 1)
            if case_count
            else 0,
        }
        for name in ("Recovered", "Waiting", "Failed", "Stopped")
    ]

    failure_rows = (
        failed_payments.with_entities(
            Payment.failure_reason,
            func.coalesce(func.sum(Payment.amount), 0),
        )
        .group_by(Payment.failure_reason)
        .all()
    )
    failure_total = sum(_money(amount) for _, amount in failure_rows)
    failure_reasons = [
        {
            "reason": reason or "Unknown",
            "amount": _money(amount),
            "percentage": round(_money(amount) / failure_total * 100, 1)
            if failure_total
            else 0,
        }
        for reason, amount in failure_rows
    ]

    strategy_rows = (
        db.query(
            RecoveryAction.action_type,
            func.count(RecoveryAction.id),
            func.coalesce(func.sum(RecoveryCase.recovered_amount), 0),
        )
        .join(RecoveryCase, RecoveryAction.recovery_case_id == RecoveryCase.id)
        .filter(RecoveryCase.organisation_id == organisation_id)
        .group_by(RecoveryAction.action_type)
        .all()
    )
    strategy_performance = []
    for action_type, count, revenue in strategy_rows:
        successful = (
            db.query(func.count(RecoveryAction.id))
            .join(RecoveryCase, RecoveryAction.recovery_case_id == RecoveryCase.id)
            .filter(
                RecoveryCase.organisation_id == organisation_id,
                RecoveryAction.action_type == action_type,
                RecoveryCase.status == "recovered",
            )
            .scalar()
            or 0
        )
        strategy_performance.append(
            {
                "strategy": action_type,
                "successRate": round(successful / count * 100, 1) if count else 0,
                "revenueRecovered": _money(revenue),
                "cases": count,
            }
        )

    attempts = (
        db.query(func.count(RecoveryAttempt.id))
        .join(RecoveryCase, RecoveryAttempt.recovery_case_id == RecoveryCase.id)
        .filter(RecoveryCase.organisation_id == organisation_id)
        .scalar()
        or 0
    )

    revenue_rows = (
        db.query(
            cast(RecoveryCase.created_at, Date),
            func.coalesce(func.sum(RecoveryCase.risk_amount), 0),
        )
        .filter(RecoveryCase.organisation_id == organisation_id)
        .group_by(cast(RecoveryCase.created_at, Date))
        .order_by(cast(RecoveryCase.created_at, Date))
        .all()
    )
    recovered_rows = (
        db.query(
            cast(RecoveryCase.recovered_at, Date),
            func.coalesce(func.sum(RecoveryCase.recovered_amount), 0),
        )
        .filter(
            RecoveryCase.organisation_id == organisation_id,
            RecoveryCase.status == "recovered",
            RecoveryCase.recovered_at.is_not(None),
        )
        .group_by(cast(RecoveryCase.recovered_at, Date))
        .all()
    )
    recovered_by_date = {date: _money(amount) for date, amount in recovered_rows}
    risk_by_date = {date: _money(amount) for date, amount in revenue_rows}
    revenue_dates = sorted(set(risk_by_date) | set(recovered_by_date))
    revenue_recovery = [
        {
            "date": date.isoformat(),
            "atRisk": risk_by_date.get(date, 0),
            "recovered": recovered_by_date.get(date, 0),
        }
        for date in revenue_dates
    ]

    return {
        "metrics": {
            "revenueAtRisk": _money(failed_revenue),
            "eligibleRevenue": _money(risk),
            "recoveredRevenue": _money(recovered),
            "unrecoverableRevenue": max(_money(failed_revenue) - _money(recovered), 0),
            "recoveryRate": round(recovery_rate, 1),
            "recoveryRoi": 0,
            "averageRecoveryTime": "-",
            "averageAttempts": round(attempts / case_count, 1) if case_count else 0,
        },
        "revenueRecovery": revenue_recovery,
        "failureReasons": failure_reasons,
        "strategyPerformance": strategy_performance,
        "recoveryFunnel": [],
        "recoveryOutcomes": outcomes,
        "failedPayments": failed_payment_count,
        "recoveryCases": case_count,
    }
