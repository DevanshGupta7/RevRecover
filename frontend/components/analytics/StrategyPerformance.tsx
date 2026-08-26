import {
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import type {
  StrategyPerformanceData,
} from "@/types/analytics";

interface StrategyPerformanceProps {
  data: StrategyPerformanceData[];
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function StrategyPerformance({
  data,
}: StrategyPerformanceProps) {
  return (
    <div className="space-y-3">
      {data.map((strategy) => (
        <div
          key={strategy.strategy}
          className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

                <p className="truncate text-xs font-medium text-zinc-300">
                  {strategy.strategy}
                </p>
              </div>

              <p className="mt-1 text-[11px] text-zinc-600">
                {strategy.cases} recovery cases
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
              <ArrowUpRight className="h-3 w-3" />

              {strategy.successRate}%
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] text-zinc-700">
                Success rate
              </span>

              <span className="text-[10px] text-zinc-600">
                {strategy.successRate}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-500"
                style={{
                  width: `${strategy.successRate}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-zinc-700">
              Revenue recovered
            </span>

            <span className="text-xs font-medium text-emerald-400">
              {formatCurrency(
                strategy.revenueRecovered
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
