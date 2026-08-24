import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  Layers3,
  Percent,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { StrategyStatus } from "@/components/strategies/StrategyStatus";

import type { RecoveryStrategy } from "@/types/strategy";

interface StrategyCardProps {
  strategy: RecoveryStrategy;
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function StrategyCard({
  strategy,
}: StrategyCardProps) {
  return (
    <Card className="group border-zinc-800 bg-zinc-950 shadow-none transition-colors hover:border-zinc-700">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              {strategy.name}
            </h2>

            <p className="mt-1.5 text-sm text-zinc-400">
              {strategy.action}
            </p>
          </div>

          <StrategyStatus status={strategy.status} />
        </div>

        {/* Description */}
        <p className="mt-4 text-xs leading-5 text-zinc-600">
          {strategy.description}
        </p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800 py-4">
          <div className="pr-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Percent className="h-3 w-3" />

              <span className="text-[11px]">
                Success Rate
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {strategy.stats.successRate}%
            </p>
          </div>

          <div className="px-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <CircleDollarSign className="h-3 w-3" />

              <span className="text-[11px]">
                Recovered
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {formatCurrency(
                strategy.stats.revenueRecovered
              )}
            </p>
          </div>

          <div className="pl-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Layers3 className="h-3 w-3" />

              <span className="text-[11px]">
                Cases
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {strategy.stats.recoveryCases}
            </p>
          </div>
        </div>

        {/* Failure reasons */}
        <div className="mt-4">
          <p className="text-[11px] text-zinc-600">
            Applies to
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {strategy.applicableFailureReasons.map(
              (reason) => (
                <span
                  key={reason}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-500"
                >
                  {reason}
                </span>
              )
            )}
          </div>
        </div>

        {/* Link */}
        <div className="mt-5">
          <Link
            href={`/strategies/${strategy.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            View Strategy

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
