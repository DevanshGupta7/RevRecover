import {
  Clock3,
  CircleDollarSign,
  Layers3,
  Percent,
  RotateCcw,
} from "lucide-react";

import type { StrategyStats as StrategyStatsType } from "@/types/strategy";

interface StrategyStatsProps {
  stats: StrategyStatsType;
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function StrategyStats({
  stats,
}: StrategyStatsProps) {
  const metrics = [
    {
      label: "Success Rate",
      value: `${stats.successRate}%`,
      icon: Percent,
    },
    {
      label: "Revenue Recovered",
      value: formatCurrency(
        stats.revenueRecovered
      ),
      icon: CircleDollarSign,
    },
    {
      label: "Recovery Cases",
      value: stats.recoveryCases.toLocaleString("en-IN"),
      icon: Layers3,
    },
    {
      label: "Avg. Recovery Time",
      value: stats.averageRecoveryTime,
      icon: Clock3,
    },
    {
      label: "Avg. Attempts",
      value: stats.averageAttempts.toFixed(1),
      icon: RotateCcw,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Icon className="h-3.5 w-3.5" />

              <span className="text-[11px]">
                {metric.label}
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
