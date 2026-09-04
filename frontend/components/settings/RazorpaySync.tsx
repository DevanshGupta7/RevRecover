"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { syncRazorpayPayments } from "@/services/razorpay.service";

export function RazorpaySync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setIsSyncing(true);
    setMessage(null);
    setError(null);

    try {
      const result = await syncRazorpayPayments();
      setMessage(
        `Razorpay sync completed. ${result.payments_created} created, ${result.payments_updated} updated, ${result.skipped} skipped.`
      );
    } catch (syncError) {
      setError(
        syncError instanceof Error
          ? syncError.message
          : "Razorpay sync failed."
      );
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:max-w-xl">
        <p className="text-sm font-medium text-zinc-300">
          Sync Razorpay Payments
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          Import recent Test Mode payments without creating duplicates.
        </p>
        {message && <p className="mt-2 text-xs text-emerald-400">{message}</p>}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>

      <Button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="shrink-0 gap-2"
      >
        <RefreshCw className={isSyncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        {isSyncing ? "Syncing..." : "Sync Payments"}
      </Button>
    </div>
  );
}