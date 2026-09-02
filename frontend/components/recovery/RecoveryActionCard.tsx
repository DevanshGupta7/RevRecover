"use client";

import { CheckCircle2, ExternalLink, LoaderCircle, Play } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { executeRecoveryAction } from "@/services/recovery.service";
import type { RecoveryAction, RecoveryCaseStatus } from "@/types/recovery";

interface RecoveryActionCardProps {
  action: RecoveryAction | null | undefined;
  caseStatus: RecoveryCaseStatus;
  onExecuted: () => Promise<void>;
}

function actionLabel(actionType: string) {
  return actionType
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function executionStatusLabel(
  actionType: string,
  actionStatus: string,
  caseStatus: RecoveryCaseStatus
) {
  if (caseStatus === "waiting" && actionStatus === "executed") {
    if (actionType === "CREATE_PAYMENT_LINK") {
      return "Waiting for payment";
    }

    if (actionType === "RETRY_PAYMENT") {
      return "Retry executed";
    }
  }

  return actionStatus;
}

export function RecoveryActionCard({
  action,
  caseStatus,
  onExecuted,
}: RecoveryActionCardProps) {
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canExecute = action?.status === "planned" &&
    !["recovered", "stopped", "failed"].includes(caseStatus);
  const shortUrl = action?.resultData?.short_url;
  const isPaymentLink = action?.actionType === "CREATE_PAYMENT_LINK";

  if (!action) {
    return null;
  }

  const recoveryAction = action;

  async function handleExecute() {
    setExecuting(true);
    setError(null);

    try {
      await executeRecoveryAction(recoveryAction.id);
      await onExecuted();
    } catch (executeError) {
      setError(
        executeError instanceof Error
          ? executeError.message
          : "Unable to execute recovery action."
      );
    } finally {
      setExecuting(false);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-none">
      <CardHeader className="border-b border-zinc-800 p-5">
        <h2 className="text-sm font-medium text-zinc-100">Recovery Action</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Execute the approved recovery action when it is ready.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-xs text-zinc-500">Action</p>
          <p className="mt-1 text-sm font-medium text-zinc-200">
            {actionLabel(action.actionType)}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize text-zinc-200">
            {executionStatusLabel(
              action.actionType,
              action.status,
              caseStatus
            )}
          </p>
        </div>

        {canExecute && (
          <Button
            className="w-full"
            disabled={executing}
            onClick={handleExecute}
          >
            {executing ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Play />
            )}
            {executing ? "Executing..." : "Execute Recovery"}
          </Button>
        )}

        {action.status === "executed" && isPaymentLink && shortUrl && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Payment Link Created
            </div>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-200 underline underline-offset-4 hover:text-white"
            >
              Open Payment Link
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}
