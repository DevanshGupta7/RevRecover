"use client";

import { CheckCircle2, ExternalLink, LoaderCircle, Play, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  approveRecoveryAction,
  executeRecoveryAction,
} from "@/services/recovery.service";
import type { RecoveryAction, RecoveryCaseStatus } from "@/types/recovery";

interface RecoveryActionCardProps {
  action: RecoveryAction | null | undefined;
  caseStatus: RecoveryCaseStatus;
  onExecuted: () => Promise<void>;
}

function actionLabel(actionType: string) {
  if (actionType === "CREATE_PAYMENT_LINK") {
    return "Create Payment Link";
  }

  if (actionType === "RETRY_PAYMENT") {
    return "Retry Payment";
  }

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
      return "Waiting for payment";
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
    action.actionType !== "HUMAN_APPROVAL" &&
    !["recovered", "stopped", "failed"].includes(caseStatus);
  const requiresApproval = action?.actionType === "HUMAN_APPROVAL" &&
    caseStatus === "awaiting_approval";
  const shortUrl = typeof action?.resultData?.short_url === "string"
    ? action.resultData.short_url
    : null;
  const orderId = typeof action?.resultData?.order_id === "string"
    ? action.resultData.order_id
    : null;
  const lastPaymentStatus = typeof action?.resultData?.last_payment_status === "string"
    ? action.resultData.last_payment_status
    : null;
  const lastFailureReason = typeof action?.resultData?.last_failure_reason === "string"
    ? action.resultData.last_failure_reason
    : null;
  const isPaymentLink = Boolean(shortUrl);
  const isRetryOrder = action?.actionType === "RETRY_PAYMENT";

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

  async function handleApprove() {
    setExecuting(true);
    setError(null);

    try {
      await approveRecoveryAction(recoveryAction.id);
      await onExecuted();
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : "Unable to approve recovery action."
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
          {requiresApproval
            ? "A human must approve this recovery before execution."
            : "Execute the approved recovery action when it is ready."}
        </p>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-xs text-zinc-500">Action</p>
          <p className="mt-1 text-sm font-medium text-zinc-200">
            {actionLabel(action.actionType)}
          </p>
        </div>

        {requiresApproval && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              Human Approval Required
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Approving this action will make the planned recovery executable.
            </p>
          </div>
        )}

        {requiresApproval && (
          <Button
            className="w-full"
            disabled={executing}
            onClick={handleApprove}
          >
            {executing ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ShieldCheck />
            )}
            {executing ? "Approving..." : "Approve Recovery"}
          </Button>
        )}

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

        {action.status === "executed" && isRetryOrder && orderId && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="text-sm font-medium text-amber-300">
              Payment Link Created
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              The customer must complete this Razorpay payment. Recovery will
              update after the payment webhook is received.
            </p>
            <p className="mt-3 break-all font-mono text-xs text-zinc-300">
              {orderId}
            </p>
          </div>
        )}

        {action.status === "executed" && lastPaymentStatus === "failed" && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="text-sm font-medium text-red-300">
              Latest payment attempt failed
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              The payment link is still available. The customer can try again,
              or you can choose another recovery action.
            </p>
            {lastFailureReason && (
              <p className="mt-2 text-xs text-red-400">
                Reason: {lastFailureReason}
              </p>
            )}
          </div>
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
