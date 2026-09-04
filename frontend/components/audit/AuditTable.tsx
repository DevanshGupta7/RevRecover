import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Cog,
  UserRound,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AuditStatus } from "@/components/audit/AuditStatus";

import type { AuditActor, AuditEvent } from "@/types/audit";

interface AuditTableProps {
  events: AuditEvent[];
}

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

const ACTOR_ICONS: Record<AuditActor, typeof Bot> = {
  "AI Agent": Bot,
  System: Cog,
  Merchant: UserRound,
  User: UserRound,
};

export function AuditTable({
  events,
}: AuditTableProps) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-zinc-800">
      <div className="w-full min-w-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Time
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Event
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Actor
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Entity
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Result
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {events.map((event) => {
              const ActorIcon = ACTOR_ICONS[event.actor] ?? UserRound;

              return (
                <TableRow
                  key={event.id}
                  className="border-zinc-800 hover:bg-zinc-900/60"
                >
                  <TableCell className="whitespace-nowrap">
                    <div>
                      <p className="text-xs font-medium text-zinc-400">
                        {formatTime(event.timestamp)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-zinc-700">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/audit/${event.id}`}
                      className="group block"
                    >
                      <p className="text-sm font-medium text-zinc-300 group-hover:text-white">
                        {event.eventName}
                      </p>

                      <p className="mt-0.5 max-w-[360px] truncate text-xs text-zinc-700">
                        {event.description}
                      </p>
                    </Link>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ActorIcon className="h-3.5 w-3.5 text-zinc-600" />

                      <span className="text-xs text-zinc-500">
                        {event.actor}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                        {event.entityType}
                      </p>

                      <p className="mt-0.5 font-mono text-xs text-zinc-500">
                        {event.entityId}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <AuditStatus
                      result={event.result}
                    />
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/audit/${event.id}`}
                      aria-label={`View ${event.eventName}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {events.length === 0 && (
        <div className="flex min-h-40 items-center justify-center border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            No audit events found.
          </p>
        </div>
      )}
    </div>
  );
}
