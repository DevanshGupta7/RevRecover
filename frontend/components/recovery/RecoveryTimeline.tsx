import {
  BrainCircuit,
  Check,
  Clock3,
  CreditCard,
  Mail,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type {
  RecoveryEventStatus,
  RecoveryEventType,
  RecoveryTimelineEvent,
} from "@/types/recovery";

interface RecoveryTimelineProps {
  events: RecoveryTimelineEvent[];
}

const EVENT_ICONS: Record<
  RecoveryEventType,
  typeof Check
> = {
  payment_failed: XCircle,
  analyzed: BrainCircuit,
  eligible: ShieldCheck,
  strategy_selected: BrainCircuit,
  recovery_action: RotateCcw,
  payment_link_created: CreditCard,
  customer_contacted: Mail,
  retry_scheduled: Clock3,
  payment_recovered: CreditCard,
  recovery_failed: XCircle,
};

function formatTimestamp(timestamp: string) {
  if (!timestamp) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function getIconClassName(
  status: RecoveryEventStatus
) {
  switch (status) {
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "current":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "upcoming":
      return "border-zinc-800 bg-zinc-900 text-zinc-600";
  }
}

export function RecoveryTimeline({
  events,
}: RecoveryTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const Icon = EVENT_ICONS[event.type];

        const isLast = index === events.length - 1;

        return (
          <div
            key={event.id}
            className="relative flex gap-4"
          >
            {!isLast && (
              <div
                className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                  event.status === "completed"
                    ? "bg-emerald-500/20"
                    : "bg-zinc-800"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${getIconClassName(
                event.status
              )}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0 flex-1 pb-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3
                  className={`text-sm font-medium ${
                    event.status === "upcoming"
                      ? "text-zinc-600"
                      : "text-zinc-200"
                  }`}
                >
                  {event.title}
                </h3>

                <span className="text-xs text-zinc-600">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>

              <p
                className={`mt-1 max-w-2xl text-xs leading-5 ${
                  event.status === "upcoming"
                    ? "text-zinc-700"
                    : "text-zinc-500"
                }`}
              >
                {event.description}
              </p>

              {event.status === "current" && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 px-2.5 py-1.5 text-xs text-blue-400">
                  <RotateCcw className="h-3 w-3" />

                  Current step
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
