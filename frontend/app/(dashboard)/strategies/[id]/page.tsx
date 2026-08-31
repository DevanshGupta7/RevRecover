"use client";

import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { StrategyStatus } from "@/components/strategies/StrategyStatus";
import { StrategyStats } from "@/components/strategies/StrategyStats";
import { StrategyWorkflow } from "@/components/strategies/StrategyWorkflow";
import { StrategyCases } from "@/components/strategies/StrategyCases";

import { getStrategyById } from "@/services/strategy.service";

export default function StrategyDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [strategy, setStrategy] = useState<
    Awaited<ReturnType<typeof getStrategyById>> | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadStrategy() {
      try {
        setLoading(true);
        setError(null);

        const data = await getStrategyById(id);

        if (!data) {
          setError("Strategy not found.");
          return;
        }

        setStrategy(data);
      } catch (err) {
        console.error(
          "Failed to load strategy:",
          err
        );

        setError("Unable to load strategy.");
      } finally {
        setLoading(false);
      }
    }

    loadStrategy();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Link href="/strategies">
                <ArrowLeft className="h-4 w-4" />
                Back to Recovery Strategies
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Loading strategy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Link href="/strategies">
                <ArrowLeft className="h-4 w-4" />
                Back to Recovery Strategies
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h1 className="text-lg font-medium text-zinc-100">
              Strategy not found
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error ??
                "The requested strategy could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
        {/* Back */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <Link href="/strategies">
              <ArrowLeft className="h-4 w-4" />
              Back to Recovery Strategies
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  {strategy.name}
                </h1>

                <StrategyStatus
                  status={strategy.status}
                />
              </div>

              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                {strategy.description}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 lg:min-w-[260px]">
              <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                Recommended action
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {strategy.action}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8">
          <StrategyStats stats={strategy.stats} />
        </section>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Workflow */}
          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5 md:p-6">
              <div className="mb-7 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <BrainCircuit className="h-4 w-4 text-zinc-300" />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-zinc-100">
                    Recovery Workflow
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    How RevRecover executes this strategy.
                  </p>
                </div>
              </div>

              <StrategyWorkflow
                steps={strategy.workflow}
              />
            </CardContent>
          </Card>

          {/* Intelligence */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardContent className="p-5">
                <h2 className="text-sm font-medium text-zinc-100">
                  Why this strategy?
                </h2>

                <p className="mt-3 text-xs leading-6 text-zinc-500">
                  {strategy.whyItWorks}
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardContent className="p-5">
                <h2 className="text-sm font-medium text-zinc-100">
                  Applicable failures
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {strategy.applicableFailureReasons.map(
                    (reason) => (
                      <span
                        key={reason}
                        className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400"
                      >
                        {reason}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cases */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-zinc-200">
              Recovery Cases Using This Strategy
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Recent recovery workflows associated with this
              strategy.
            </p>
          </div>

          <StrategyCases cases={strategy.cases} />
        </section>
      </div>
    </div>
  );
}
