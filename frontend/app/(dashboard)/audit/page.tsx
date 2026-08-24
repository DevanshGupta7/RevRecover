import {
  Activity,
  Bot,
  CheckCircle2,
  Cog,
} from "lucide-react";

import { AuditExplorer } from "@/components/audit/AuditExplorer";

import { getAuditData } from "@/services/audit.service";

export default function AuditPage() {
  const auditData = getAuditData();

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
                Audit Logs
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                Track decisions, actions, and outcomes across
                the RevRecover recovery engine.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <Activity className="h-4 w-4" />

              <span className="text-xs">
                Total Events
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {auditData.totalEvents.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <Bot className="h-4 w-4" />

              <span className="text-xs">
                AI Decisions
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {auditData.aiDecisions.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <Cog className="h-4 w-4" />

              <span className="text-xs">
                Automated Actions
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {auditData.automatedActions.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <CheckCircle2 className="h-4 w-4" />

              <span className="text-xs">
                Successful Actions
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {auditData.successfulActions.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        </section>

        {/* Audit information */}
        <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <Bot className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-medium text-zinc-100">
                Agent decision trail
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-600">
                Every important recovery decision records the
                decision itself, the reasoning behind it, the
                action taken, and the resulting outcome.
              </p>
            </div>
          </div>
        </section>

        {/* Audit explorer */}
        <section>
          <AuditExplorer events={auditData.events} />
        </section>
      </div>
    </div>
  );
}
