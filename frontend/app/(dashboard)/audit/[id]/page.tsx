"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AuditDetail } from "@/components/audit/AuditDetail";

import { getAuditEventById } from "@/services/audit.service";

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default function AuditDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [event, setEvent] = useState<
    Awaited<ReturnType<typeof getAuditEventById>> | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadAuditEvent() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAuditEventById(id);

        if (!data) {
          setError("Audit event not found.");
          return;
        }

        setEvent(data);
      } catch (err) {
        console.error(
          "Failed to load audit event:",
          err
        );

        setError("Unable to load audit event.");
      } finally {
        setLoading(false);
      }
    }

    loadAuditEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1000px] p-5 md:p-8">
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Loading audit event...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1000px] p-5 md:p-8">
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h1 className="text-lg font-medium text-zinc-100">
              Audit event not found
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error ??
                "The requested audit event could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
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
