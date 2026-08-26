import {
  BrainCircuit,
  GitBranch,
} from "lucide-react";

import { StrategyCard } from "@/components/strategies/StrategyCard";

import { getStrategyData } from "@/services/strategy.service";

export default function StrategiesPage() {
  const { strategies } = getStrategyData();

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <BrainCircuit className="h-4 w-4 text-zinc-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Recovery Strategies
                </h1>

                <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-500">
                  <GitBranch className="h-3 w-3" />

                  {strategies.length} active strategies
                </div>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm text-zinc-500">
                Understand how RevRecover chooses the right
                recovery action for each payment failure.
              </p>
            </div>
          </div>
        </section>

        {/* Explanation */}
        <section className="mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Decision engine
            </p>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              RevRecover does not retry every failed payment
              the same way. It evaluates the failure context
              and selects the recovery strategy with the
              highest expected chance of recovering revenue.
            </p>
          </div>
        </section>

        {/* Strategy cards */}
        <section>
          <div className="grid gap-4 lg:grid-cols-2">
            {strategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
