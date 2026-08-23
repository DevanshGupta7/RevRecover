import {
  Activity,
  CircleDollarSign,
  Percent,
  ShieldAlert,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueRecoveryChart } from "@/components/dashboard/RevenueRecoveryChart";
import { FailureReasons } from "@/components/dashboard/FailureReasons";
import { RecoveryFunnel } from "@/components/dashboard/RecoveryFunnel";
import { RecoveryInsights } from "@/components/dashboard/RecoveryInsights";
import { getDashboardData } from "@/services/dashboard.service";

function formatIndianCurrency(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1600px] p-5 md:p-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Revenue Recovery
            </h2>

            <p className="text-sm text-zinc-500">
              Recover revenue that would otherwise be lost.
            </p>
          </div>
        </section>

        {/* Metrics */}
        <section
          aria-label="Revenue recovery metrics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="At Risk"
            value={formatIndianCurrency(
              dashboard.metrics.revenueAtRisk
            )}
            icon={ShieldAlert}
            description="Revenue currently at risk"
          />

          <MetricCard
            label="Recovered"
            value={formatIndianCurrency(
              dashboard.metrics.revenueRecovered
            )}
            icon={CircleDollarSign}
            description="Revenue successfully recovered"
          />

          <MetricCard
            label="Recovery Rate"
            value={`${dashboard.metrics.recoveryRate}%`}
            icon={Percent}
            description="Overall recovery performance"
          />

          <MetricCard
            label="Active Cases"
            value={dashboard.metrics.activeCases.toLocaleString(
              "en-IN"
            )}
            icon={Activity}
            description="Cases currently being recovered"
          />
        </section>

        {/* Revenue Recovery Chart */}
        <section className="mt-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h3 className="text-sm font-medium text-zinc-100">
                Revenue Recovery
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Revenue at risk versus recovered revenue
              </p>
            </div>

            <div className="p-5">
              <RevenueRecoveryChart
                data={dashboard.revenueRecovery}
              />

              <div className="mt-2 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  At Risk
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-zinc-100" />
                  Recovered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Failure reasons + recovery pipeline */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <FailureReasons
            data={dashboard.failureReasons}
          />

          <RecoveryFunnel
            data={dashboard.recoveryPipeline}
          />
        </section>

        {/* Recovery Intelligence */}
        <section className="mt-6">
          <RecoveryInsights
            insights={dashboard.insights}
          />
        </section>
      </div>
    </div>
  );
}
