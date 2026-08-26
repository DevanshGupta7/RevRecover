"use client";

import { useMemo, useState } from "react";

import { AuditFilters } from "@/components/audit/AuditFilters";
import { AuditTable } from "@/components/audit/AuditTable";

import type {
  AuditActor,
  AuditEvent,
  AuditEventType,
} from "@/types/audit";

interface AuditExplorerProps {
  events: AuditEvent[];
}

export function AuditExplorer({
  events,
}: AuditExplorerProps) {
  const [search, setSearch] = useState("");

  const [actor, setActor] = useState<
    AuditActor | "all"
  >("all");

  const [eventType, setEventType] = useState<
    AuditEventType | "all"
  >("all");

  const filteredEvents = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return events.filter((event) => {
      // Actor filter
      if (
        actor !== "all" &&
        event.actor !== actor
      ) {
        return false;
      }

      // Event type filter
      if (
        eventType !== "all" &&
        event.eventType !== eventType
      ) {
        return false;
      }

      // Search filter
      if (normalizedSearch) {
        const metadataText = event.metadata
          ? Object.entries(event.metadata)
              .map(
                ([key, value]) =>
                  `${key} ${String(value)}`
              )
              .join(" ")
          : "";

        const searchableText = [
          event.eventName,
          event.eventType,
          event.actor,
          event.entityType,
          event.entityId,
          event.result,
          event.description,
          event.decision ?? "",
          event.reason ?? "",
          event.action ?? "",
          metadataText,
        ]
          .join(" ")
          .toLowerCase();

        if (
          !searchableText.includes(
            normalizedSearch
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [events, search, actor, eventType]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    actor !== "all" ||
    eventType !== "all";

  function resetFilters() {
    setSearch("");
    setActor("all");
    setEventType("all");
  }

  return (
    <div className="min-w-0">
      <AuditFilters
        search={search}
        actor={actor}
        eventType={eventType}
        onSearchChange={setSearch}
        onActorChange={setActor}
        onEventTypeChange={setEventType}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Result count */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-600">
          Showing{" "}
          <span className="font-medium text-zinc-400">
            {filteredEvents.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-400">
            {events.length}
          </span>{" "}
          events
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-3">
        <AuditTable events={filteredEvents} />
      </div>
    </div>
  );
}
