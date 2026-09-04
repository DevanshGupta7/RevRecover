import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { RecoveryStatus } from "@/components/recovery/RecoveryStatus";
import { formatPercentage } from "@/lib/recovery-formatters";

import type {
  CustomerRecovery,
} from "@/types/customer";

interface RecoveryHistoryProps {
  recoveries: CustomerRecovery[];
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function RecoveryHistory({
  recoveries,
}: RecoveryHistoryProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Recovery
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Strategy
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Status
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Probability
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Recovered
              </th>

              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {recoveries.map((recovery) => (
              <tr
                key={recovery.id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/recovery/${recovery.id}`}
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-200"
                  >
                    {recovery.id}
                  </Link>
                </td>

                <td className="px-4 py-3 text-sm text-zinc-300">
                  {formatCurrency(recovery.amount)}
                </td>

                <td className="px-4 py-3 text-xs text-zinc-500">
                  {recovery.strategy}
                </td>

                <td className="px-4 py-3">
                  <RecoveryStatus
                    status={recovery.status}
                  />
                </td>

                <td className="px-4 py-3 text-sm text-zinc-300">
                  {formatPercentage(recovery.probability)}
                </td>

                <td className="px-4 py-3 text-sm text-emerald-400">
                  {recovery.recoveredAmount > 0
                    ? formatCurrency(
                        recovery.recoveredAmount
                      )
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/recovery/${recovery.id}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
