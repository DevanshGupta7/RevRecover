import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FailureReasonBadge } from "@/components/payments/FailureReasonBadge";
import { RecoveryEligibility } from "@/components/payments/RecoveryEligibility";

import type { FailedPayment } from "@/types/payment";

interface PaymentTableProps {
  payments: FailedPayment[];
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

export function PaymentTable({
  payments,
}: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Payment
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Customer
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Amount
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Failure Reason
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Failed At
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Recoverable
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="border-zinc-800 transition-colors hover:bg-zinc-900/60"
              >
                <TableCell>
                  <Link
                    href={`/payments/${payment.id}`}
                    className="group inline-flex items-center gap-1.5 font-mono text-xs text-zinc-200 hover:text-white"
                  >
                    {payment.id}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="text-sm text-zinc-200">
                      {payment.customerName}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-600">
                      {payment.customerEmail}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-zinc-100">
                    {formatCurrency(payment.amount)}
                  </span>
                </TableCell>

                <TableCell>
                  <FailureReasonBadge
                    reason={payment.failureReason}
                  />
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-xs text-zinc-500">
                    {formatDate(payment.failedAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <RecoveryEligibility
                    eligibility={payment.recoveryEligibility}
                  />
                </TableCell>

                <TableCell>
                  <Link
                    href={`/payments/${payment.id}`}
                    aria-label={`View ${payment.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {payments.length === 0 && (
        <div className="flex min-h-40 items-center justify-center border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            No failed payments found.
          </p>
        </div>
      )}
    </div>
  );
}
