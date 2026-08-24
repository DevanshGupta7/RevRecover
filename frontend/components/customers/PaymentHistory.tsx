import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type {
  CustomerPayment,
} from "@/types/customer";

interface PaymentHistoryProps {
  payments: CustomerPayment[];
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function PaymentHistory({
  payments,
}: PaymentHistoryProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Payment
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Status
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Failure Reason
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Date
              </th>

              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => {
              const statusConfig = {
                succeeded: {
                  label: "Succeeded",
                  icon: CheckCircle2,
                  className: "text-emerald-400",
                },

                failed: {
                  label: "Failed",
                  icon: XCircle,
                  className: "text-red-400",
                },

                pending: {
                  label: "Pending",
                  icon: Clock3,
                  className: "text-amber-400",
                },
              };

              const config = statusConfig[payment.status];

              const Icon = config.icon;

              return (
                <tr
                  key={payment.id}
                  className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/payments/${payment.id}`}
                      className="font-mono text-xs text-zinc-500 hover:text-zinc-200"
                    >
                      {payment.id}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {formatCurrency(payment.amount)}
                  </td>

                  <td className="px-4 py-3">
                    <div
                      className={`flex items-center gap-1.5 text-xs ${config.className}`}
                    >
                      <Icon className="h-3.5 w-3.5" />

                      {config.label}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-500">
                      {payment.failureReason ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {formatDate(payment.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/payments/${payment.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
