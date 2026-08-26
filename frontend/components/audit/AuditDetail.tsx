import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cog,
  Lightbulb,
  Target,
  UserRound,
} from "lucide-react";

import { AuditStatus } from "@/components/audit/AuditStatus";

import type { AuditEvent } from "@/types/audit";

interface AuditDetailProps {
  event: AuditEvent;
}

const ACTOR_ICONS = {
  "AI Agent": Bot,
  System: Cog,
  Merchant: UserRound,
};

export function AuditDetail({
  event,
}: AuditDetailProps) {
  const ActorIcon = ACTOR_ICONS[event.actor];

  return (
    <div className="space-y-6">
      {/* Event overview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <ActorIcon className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-medium text-zinc-100">
                {event.eventName}
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                {event.description}
              </p>
            </div>
          </div>

          <AuditStatus result={event.result} />
        </div>

        <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-700">
              Actor
            </p>

            <p className="mt-1 text-sm text-zinc-300">
              {event.actor}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-700">
              Entity
            </p>

            <p className="mt-1 font-mono text-xs text-zinc-400">
              {event.entityId}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-700">
              Event ID
            </p>

            <p className="mt-1 font-mono text-xs text-zinc-400">
              {event.id}
            </p>
          </div>
        </div>
      </div>

      {/* Decision */}
      {event.decision && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <Target className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                Decision
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {event.decision}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reason */}
      {event.reason && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <Lightbulb className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                Why RevRecover made this decision
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {event.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action */}
      {event.action && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                Action
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {event.action}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      {event.confidence !== undefined && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Decision confidence
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Confidence assigned by the recovery decision
                  engine.
                </p>
              </div>
            </div>

            <span className="text-lg font-semibold text-zinc-100">
              {event.confidence}%
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{
                width: `${event.confidence}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      {event.metadata &&
        Object.keys(event.metadata).length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-4">
              <p className="text-sm font-medium text-zinc-200">
                Event Metadata
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Additional context recorded with this event.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(event.metadata).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3"
                  >
                    <p className="truncate text-[10px] uppercase tracking-wider text-zinc-700">
                      {key}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-400">
                      {String(value)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}
