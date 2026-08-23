"use client";

import { ChevronRight } from "lucide-react";
import { FailedPayment } from "@/types/payment";
import { FailureReasonBadge } from "./FailureReasonBadge";
import { PaymentStatus } from "./PaymentStatus";
import { RecoveryEligibility } from "./RecoveryEligibility";

interface PaymentTableProps {
  payments: FailedPayment[];
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div>
      {/* ============================================================
          DESKTOP TABLE
          ============================================================ */}

      <div className="hidden overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 xl:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Payment
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Failure Reason
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Recoverable
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Failed At
                </th>

                <th className="w-10 px-4 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/80">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="group transition-colors hover:bg-zinc-900/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-zinc-200">
                        {payment.id}
                      </p>

                      <div className="mt-1">
                        <PaymentStatus status={payment.status} />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200">
                        {payment.customerName}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {payment.customerEmail}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-100">
                      {formatAmount(payment.amount, payment.currency)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <FailureReasonBadge reason={payment.failureReason} />
                  </td>

                  <td className="px-6 py-4">
                    <RecoveryEligibility
                      eligibility={payment.recoveryEligibility}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">
                      {formatDate(payment.failedAt)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <ChevronRight className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-zinc-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
          MOBILE CARDS
          ============================================================ */}

      <div className="space-y-3 xl:hidden">
        {payments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:bg-zinc-900/50"
          >
            {/* Payment ID + Arrow */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-medium text-zinc-200">
                  {payment.id}
                </p>

                <div className="mt-1">
                  <PaymentStatus status={payment.status} />
                </div>
              </div>

              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-600" />
            </div>

            {/* Customer */}
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-200">
                {payment.customerName}
              </p>

              <p className="mt-1 truncate text-xs text-zinc-500">
                {payment.customerEmail}
              </p>
            </div>

            {/* Amount */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Amount
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-100">
                {formatAmount(payment.amount, payment.currency)}
              </p>
            </div>

            {/* Failure Reason */}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Failure Reason
              </p>

              <FailureReasonBadge reason={payment.failureReason} />
            </div>

            {/* Recovery */}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Recoverable
              </p>

              <RecoveryEligibility
                eligibility={payment.recoveryEligibility}
              />
            </div>

            {/* Failed At */}
            <div className="mt-4 border-t border-zinc-800 pt-3">
              <p className="text-xs text-zinc-500">
                Failed {formatDate(payment.failedAt)}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Empty state */}
      {payments.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-500">
          No failed payments found.
        </div>
      )}
    </div>
  );
}
