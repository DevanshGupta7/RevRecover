"use client";

import { useEffect, useState } from "react";

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
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";

import { getDashboardData } from "@/services/dashboard.service";
import { useAuth } from "@/contexts/auth-context";

import type { DashboardData } from "@/types/dashboard";

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

export default function DashboardPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setLoadError(false);

        const data = await getDashboardData();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="page-container">
        <LoadingState message="Loading revenue intelligence..." />
      </div>
    );
  }

  if (loadError || !dashboard) {
    return (
      <div className="page-container">
        <ErrorState
          title="Dashboard unavailable"
          message="We couldn't load the latest recovery intelligence."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-container">

        {/* Header */}
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
              Overview
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Revenue recovery
            </h2>
            <p className="max-w-xl text-sm text-[#94a39c]">
              See where failed payments need attention and how much revenue your recovery engine is returning.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#3b6478] bg-[#173044] px-3 py-2 text-xs text-[#8dd8ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8dd8ff] shadow-[0_0_8px_rgba(141,216,255,0.8)]" aria-hidden="true" />
            Recovery engine active
          </div>
        </section>

        {/* Metrics */}
        <section
          aria-label="Revenue recovery metrics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Unrecovered Revenue"
            value={formatIndianCurrency(
              dashboard.metrics.revenueAtRisk
            )}
            icon={ShieldAlert}
            description="Failed-payment revenue not yet recovered"
            className="border-red-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.08),rgba(22,30,39,0.98))] [&_.metric-label]:text-red-400 [&_.metric-icon]:border-red-500/20 [&_.metric-icon]:bg-red-500/10 [&_.metric-icon_svg]:text-red-400"
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
              label="Revenue Recovery Rate"
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
          <div className="app-surface">
            <div className="flex flex-col justify-between gap-2 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center">
              <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Revenue Recovery
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Revenue at risk versus recovered revenue
              </p>
              </div>
              <span className="text-xs text-[#8ca098]">Cumulative view</span>
            </div>

            <div className="p-5">
              <RevenueRecoveryChart
                data={dashboard.revenueRecovery}
              />

              <div className="mt-2 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-[#d49a73]" />
                  Unrecovered
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
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
