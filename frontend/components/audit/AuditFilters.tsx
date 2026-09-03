"use client";

import {
  Filter,
  Search,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import type {
  AuditActor,
  AuditEventType,
} from "@/types/audit";

interface AuditFiltersProps {
  search: string;
  actor: AuditActor | "all";
  eventType: AuditEventType | "all";

  onSearchChange: (value: string) => void;
  onActorChange: (
    value: AuditActor | "all"
  ) => void;
  onEventTypeChange: (
    value: AuditEventType | "all"
  ) => void;

  onReset: () => void;

  hasActiveFilters: boolean;
}

const EVENT_TYPES: {
  value: AuditEventType;
  label: string;
}[] = [
  {
    value: "payment_failed",
    label: "Payment failed",
  },
  {
    value: "recovery_case_created",
    label: "Recovery case created",
  },
  {
    value: "ai_decision_created",
    label: "AI decision created",
  },
  {
    value: "strategy_selected",
    label: "Strategy selected",
  },
  {
    value: "recovery_action_executed",
    label: "Recovery action executed",
  },
  {
    value: "recovery_action_failed",
    label: "Recovery action failed",
  },
  {
    value: "recovery_case_recovered",
    label: "Recovery case recovered",
  },
];

const ACTORS: {
  value: AuditActor;
  label: string;
}[] = [
  {
    value: "AI Agent",
    label: "AI Agent",
  },
  {
    value: "System",
    label: "System",
  },
  {
    value: "Merchant",
    label: "Merchant",
  },
];

export function AuditFilters({
  search,
  actor,
  eventType,
  onSearchChange,
  onActorChange,
  onEventTypeChange,
  onReset,
  hasActiveFilters,
}: AuditFiltersProps) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search events, entities, or IDs..."
            className="h-10 border-zinc-800 bg-zinc-900 pl-9 text-sm text-zinc-300 placeholder:text-zinc-700 focus-visible:ring-zinc-700"
          />
        </div>

        {/* Event type */}
        <select
          value={eventType}
          onChange={(event) =>
            onEventTypeChange(
              event.target.value as
                | AuditEventType
                | "all"
            )
          }
          className="h-10 w-full shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-400 outline-none transition-colors focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 lg:w-[190px]"
          aria-label="Filter by event type"
        >
          <option value="all">
            All event types
          </option>

          {EVENT_TYPES.map((type) => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </select>

        {/* Actor */}
        <select
          value={actor}
          onChange={(event) =>
            onActorChange(
              event.target.value as
                | AuditActor
                | "all"
            )
          }
          className="h-10 w-full shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-400 outline-none transition-colors focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 lg:w-[150px]"
          aria-label="Filter by actor"
        >
          <option value="all">
            All actors
          </option>

          {ACTORS.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-4 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-3.5 w-3.5" />

            Reset
          </button>
        )}

        {!hasActiveFilters && (
          <div className="hidden h-10 shrink-0 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-4 text-xs text-zinc-600 lg:flex">
            <Filter className="h-3.5 w-3.5" />

            Filters
          </div>
        )}
      </div>
    </div>
  );
}
