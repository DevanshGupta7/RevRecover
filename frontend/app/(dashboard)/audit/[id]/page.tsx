import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AuditDetail } from "@/components/audit/AuditDetail";

import { getAuditEventById } from "@/services/audit.service";

interface AuditDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default async function AuditDetailsPage({
  params,
}: AuditDetailsPageProps) {
  const { id } = await params;

  const event = getAuditEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1000px] min-w-0 p-5 md:p-8">
        {/* Back */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <Link href="/audit">
              <ArrowLeft className="h-4 w-4" />

              Back to Audit Logs
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mb-8">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-zinc-700">
              Audit Event
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
              {event.eventName}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
              <Clock3 className="h-3.5 w-3.5" />

              {formatDateTime(event.timestamp)}
            </div>
          </div>
        </section>

        <AuditDetail event={event} />
      </div>
    </div>
  );
}
