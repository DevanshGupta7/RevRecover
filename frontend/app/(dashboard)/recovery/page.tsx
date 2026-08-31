"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BrainCircuit,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

import { RecoverySummary } from "@/components/recovery/RecoverySummary";
import { RecoveryTable } from "@/components/recovery/RecoveryTable";

import { getRecoveryData } from "@/services/recovery.service";

import type { RecoveryData } from "@/types/recovery";

export default function RecoveryPage() {
  const [recovery, setRecovery] = useState<RecoveryData>({
    summary: {
      activeCases: 0,
      recoveredToday: 0,
      revenueRecovered: 0,
    },
    cases: [],
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getRecoveryData();

        if (active) {
          setRecovery(data);
        }
      } catch {
        if (active) {
          setRecovery({
            summary: { activeCases: 0, recoveredToday: 0, revenueRecovered: 0 },
            cases: [],
          });
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1600px] p-5 md:p-8">
        {/* Header */}
        <section className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <BrainCircuit className="h-4 w-4 text-zinc-300" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Recovery Cases
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Monitor recovery decisions, actions, and
                outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-8">
          <RecoverySummary data={recovery.summary} />
        </section>

        {/* Explanation */}
        <section className="mb-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
              </div>

              <div>
                <h2 className="text-sm font-medium text-zinc-100">
                  RevRecover is actively recovering revenue
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-500">
                  Each recovery case represents a failed payment
                  that RevRecover evaluated, selected a recovery
                  strategy for, and moved into an automated
                  recovery workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cases */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">
                Active Recovery Workflow
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Payments currently being evaluated or recovered.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs text-zinc-600 sm:flex">
              <CircleDollarSign className="h-3.5 w-3.5" />

              {recovery.cases.length} detailed cases
            </div>
          </div>

          <RecoveryTable cases={recovery.cases} />
        </section>
      </div>
    </div>
  );
}
