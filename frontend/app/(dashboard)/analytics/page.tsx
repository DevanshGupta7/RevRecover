import {
  Activity,
  Clock3,
  CircleDollarSign,
  Gauge,
  Layers3,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";

import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";
import { RevenueRecoveryChart } from "@/components/analytics/RevenueRecoveryChart";
import { FailureReasonChart } from "@/components/analytics/FailureReasonChart";
import { StrategyPerformance } from "@/components/analytics/StrategyPerformance";
import { RecoveryFunnel } from "@/components/analytics/RecoveryFunnel";
import { RecoveryOutcomeChart } from "@/components/analytics/RecoveryOutcomeChart";

import { getAnalyticsData } from "@/services/analytics.service";

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AnalyticsPage() {
  const analytics = getAnalyticsData();

  const { metrics } = analytics;

  return (
    <div className="min-h-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1500px] min-w-0 p-5 md:p-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <Activity className="h-4 w-4 text-zinc-300" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Analytics
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                Measure the revenue impact of RevRecover&apos;s
                recovery engine.
              </p>
            </div>
          </div>
        </section>

        {/* Revenue metrics */}
        <section className="mb-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsMetricCard
            label="Revenue at Risk"
            value={formatCurrency(
              metrics.revenueAtRisk
            )}
            description="Total failed-payment revenue"
            icon={CircleDollarSign}
          />

          <AnalyticsMetricCard
            label="Eligible"
            value={formatCurrency(
              metrics.eligibleRevenue
            )}
            description="Revenue worth recovering"
            icon={Target}
          />

          <AnalyticsMetricCard
            label="Recovered"
            value={formatCurrency(
              metrics.recoveredRevenue
            )}
            description="Revenue successfully recovered"
            icon={TrendingUp}
            valueClassName="text-emerald-400"
          />

          <AnalyticsMetricCard
            label="Unrecoverable"
            value={formatCurrency(
              metrics.unrecoverableRevenue
            )}
            description="Revenue outside recovery scope"
            icon={Layers3}
          />
        </section>

        {/* Performance metrics */}
        <section className="mb-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsMetricCard
            label="Recovery Rate"
            value={`${metrics.recoveryRate}%`}
            description="Recovered vs revenue at risk"
            icon={Gauge}
          />

          <AnalyticsMetricCard
            label="Recovery ROI"
            value={`${metrics.recoveryRoi}x`}
            description="Recovered revenue per recovery cost"
            icon={TrendingUp}
          />

          <AnalyticsMetricCard
            label="Avg. Recovery Time"
            value={metrics.averageRecoveryTime}
            description="Average time to successful recovery"
            icon={Clock3}
          />

          <AnalyticsMetricCard
            label="Avg. Attempts"
            value={metrics.averageAttempts.toFixed(1)}
            description="Attempts per recovery case"
            icon={RotateCcw}
          />
        </section>

        {/* Revenue recovery chart */}
        <section className="mb-6 min-w-0">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-sm font-medium text-zinc-100">
                Revenue Recovery Over Time
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Compare failed-payment revenue entering the
                recovery pipeline with revenue actually recovered.
              </p>

              <div className="mt-3 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />

                  At Risk
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Recovered
                </div>
              </div>
            </div>

            <div className="min-w-0 p-4 md:p-5">
              <RevenueRecoveryChart
                data={analytics.revenueRecovery}
              />
            </div>
          </div>
        </section>

        {/* Failure + Strategy */}
        <section className="mb-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-sm font-medium text-zinc-100">
                Recovery by Failure Reason
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Revenue at risk grouped by payment failure
                context.
              </p>
            </div>

            <div className="min-w-0 p-4 md:p-5">
              <FailureReasonChart
                data={analytics.failureReasons}
              />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-sm font-medium text-zinc-100">
                Strategy Performance
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Historical performance of RevRecover&apos;s recovery
                strategies.
              </p>
            </div>

            <div className="min-w-0 p-4 md:p-5">
              <StrategyPerformance
                data={analytics.strategyPerformance}
              />
            </div>
          </div>
        </section>

        {/* Funnel + outcomes */}
        <section className="grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-sm font-medium text-zinc-100">
                Recovery Funnel
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                How failed payments move through the recovery
                process.
              </p>
            </div>

            <div className="min-w-0 p-5">
              <RecoveryFunnel
                data={analytics.recoveryFunnel}
              />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-sm font-medium text-zinc-100">
                Recovery Outcomes
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Current distribution of recovery case outcomes.
              </p>
            </div>

            <div className="min-w-0 p-4 md:p-5">
              <RecoveryOutcomeChart
                data={analytics.recoveryOutcomes}
              />

              <div className="grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4">
                {analytics.recoveryOutcomes.map(
                  (outcome) => (
                    <div
                      key={outcome.outcome}
                      className="min-w-0"
                    >
                      <p className="truncate text-[11px] text-zinc-600">
                        {outcome.outcome}
                      </p>

                      <p className="mt-1 text-sm font-medium text-zinc-300">
                        {outcome.count.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="text-[10px] text-zinc-700">
                        {outcome.percentage}%
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
