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

import { RecoveryStatus } from "@/components/recovery/RecoveryStatus";
import { RecoveryStrategy } from "@/components/recovery/RecoveryStrategy";

import type { RecoveryCase } from "@/types/recovery";

interface RecoveryTableProps {
  cases: RecoveryCase[];
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function RecoveryTable({
  cases,
}: RecoveryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Customer
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Amount
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Failure
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Strategy
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Status
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Recovery
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {cases.map((recoveryCase) => (
              <TableRow
                key={recoveryCase.id}
                className="border-zinc-800 transition-colors hover:bg-zinc-900/60"
              >
                <TableCell>
                  <Link
                    href={`/recovery/${recoveryCase.id}`}
                    className="group block"
                  >
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                      {recoveryCase.customerName}
                    </p>

                    <p className="mt-0.5 font-mono text-xs text-zinc-600">
                      {recoveryCase.id}
                    </p>
                  </Link>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-zinc-100">
                    {formatCurrency(recoveryCase.amount)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-zinc-400">
                    {recoveryCase.failureReason}
                  </span>
                </TableCell>

                <TableCell>
                  <RecoveryStrategy
                    strategy={recoveryCase.strategy}
                  />
                </TableCell>

                <TableCell>
                  <RecoveryStatus
                    status={recoveryCase.status}
                  />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {recoveryCase.recoveryProbability}%
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-600">
                      {formatCurrency(
                        recoveryCase.expectedRecovery
                      )}{" "}
                      expected
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/recovery/${recoveryCase.id}`}
                    aria-label={`View recovery case ${recoveryCase.id}`}
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

      {cases.length === 0 && (
        <div className="flex min-h-40 items-center justify-center border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            No recovery cases found.
          </p>
        </div>
      )}
    </div>
  );
}
