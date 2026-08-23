import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FailedPayment } from "@/types/payment";

interface RecoveryDecisionProps {
  payment: FailedPayment;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStrategyLabel(
  strategy: FailedPayment["recommendedStrategy"]
) {
  switch (strategy) {
    case "retry_after_delay":
      return "WAIT 24 HOURS → RETRY PAYMENT";

    case "update_payment_method":
      return "REQUEST PAYMENT METHOD UPDATE";

    case "alternate_payment_method":
      return "REQUEST ALTERNATE PAYMENT METHOD";

    case "contact_customer":
      return "CONTACT CUSTOMER";

    case "manual_review":
      return "SEND FOR MANUAL REVIEW";

    default:
      return "NO RECOVERY ACTION";
  }
}

export function RecoveryDecision({
  payment,
}: RecoveryDecisionProps) {
  const reasons = [
    `Customer has successfully paid ${payment.successfulPayments} times previously`,
    `Customer lifetime value: ${formatCurrency(
      payment.customerLifetimeValue
    )}`,
    `Failed payment amount: ${formatCurrency(payment.amount)}`,
    `Failure reason: ${getFailureReasonLabel(
      payment.failureReason
    )}`,
    payment.previousRetrySucceeded
      ? "Previous retry succeeded"
      : "Previous retry has not succeeded",
    payment.subscriptionActive
      ? "Subscription currently active"
      : "Subscription is currently inactive",
  ];

  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-none">
      <CardHeader className="border-b border-zinc-800 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <BrainCircuit className="h-4 w-4 text-zinc-300" />
          </div>

          <div>
            <h2 className="text-sm font-medium text-zinc-100">
              Recovery Decision
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Why RevRecover believes this payment is worth
              pursuing.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />

            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
              {payment.recoveryEligibility === "high"
                ? "High Recovery Potential"
                : `${capitalize(
                    payment.recoveryEligibility
                  )} Recovery Potential`}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Why?
          </h3>

          <div className="mt-3 space-y-3">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-start gap-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />

                <p className="text-sm leading-6 text-zinc-300">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-6 h-px bg-zinc-800" />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Recommended Action
          </h3>

          <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />

            <span className="text-sm font-medium text-zinc-100">
              {getStrategyLabel(
                payment.recommendedStrategy
              )}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
            <p className="text-xs text-zinc-500">
              Expected recovery
            </p>

            <p className="mt-1 text-xl font-semibold text-zinc-100">
              {formatCurrency(payment.expectedRecovery)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
            <p className="text-xs text-zinc-500">
              Confidence
            </p>

            <p className="mt-1 text-xl font-semibold text-zinc-100">
              {payment.confidence}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getFailureReasonLabel(
  reason: FailedPayment["failureReason"]
) {
  switch (reason) {
    case "insufficient_funds":
      return "Insufficient Funds";

    case "expired_card":
      return "Expired Card";

    case "bank_decline":
      return "Bank Decline";

    case "technical_error":
      return "Technical Error";

    default:
      return "Other";
  }
}
