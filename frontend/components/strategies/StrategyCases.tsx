import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { RecoveryStatus } from "@/components/recovery/RecoveryStatus";

import type { StrategyCase } from "@/types/strategy";

interface StrategyCasesProps {
  cases: StrategyCase[];
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function StrategyCases({
  cases,
}: StrategyCasesProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Customer
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Status
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-600">
                Recovery
              </th>

              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {cases.map((recoveryCase) => (
              <tr
                key={recoveryCase.id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <p className="text-sm text-zinc-300">
                    {recoveryCase.customerName}
                  </p>

                  <p className="mt-0.5 font-mono text-[11px] text-zinc-700">
                    {recoveryCase.id}
                  </p>
                </td>

                <td className="px-4 py-3 text-sm text-zinc-300">
                  {formatCurrency(recoveryCase.amount)}
                </td>

                <td className="px-4 py-3">
                  <RecoveryStatus
                    status={recoveryCase.status}
                  />
                </td>

                <td className="px-4 py-3">
                  <span className="text-sm text-zinc-300">
                    {recoveryCase.recoveryProbability}%
                  </span>
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/recovery/${recoveryCase.id}`}
                    aria-label={`View ${recoveryCase.id}`}
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
