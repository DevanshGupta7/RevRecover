import { api } from "@/lib/api";

import type {
  RecoveryCase,
  RecoveryCaseStatus,
  RecoveryData,
  RecoveryTimelineEvent,
} from "@/types/recovery";

type ApiRecoveryCase = {
  id: string;
  organisation_id: string;
  customer_id: string;
  payment_id: string;
  risk_amount: number | string;
  risk_type: string;
  failure_reason?: string | null;
  failure_code?: string | null;
  risk_score?: number | string | null;
  recovery_probability?: number | string | null;
  status: string;
  current_step?: string | null;
  max_attempts: number;
  started_at?: string | null;
  stopped_at?: string | null;
  recovered_at?: string | null;
  recovered_amount?: number | string | null;
  created_at: string;
  updated_at: string;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapRecoveryStatus(
  status: string
): RecoveryCaseStatus {
  switch (status) {
    case "detected":
      return "waiting";
    case "scheduled":
      return "scheduled";
    case "contacted":
      return "contacted";
    case "retrying":
      return "retrying";
    case "recovered":
      return "recovered";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    default:
      return "waiting";
  }
}

function mapRecoveryStrategy(
  failureReason?: string | null,
  failureCode?: string | null
): RecoveryCase["strategy"] {
  const normalizedReason = (failureReason ?? "")
    .toLowerCase();
  const normalizedCode = (failureCode ?? "").toLowerCase();

  if (
    normalizedReason.includes("insufficient") ||
    normalizedCode.includes("insufficient")
  ) {
    return "retry_after_delay";
  }

  if (
    normalizedReason.includes("expired") ||
    normalizedCode.includes("card_expired")
  ) {
    return "update_payment_method";
  }

  if (
    normalizedReason.includes("bank") ||
    normalizedCode.includes("bank")
  ) {
    return "alternate_payment_method";
  }

  return "manual_review";
}

function mapRecoveryTimeline(
  recoveryCase: ApiRecoveryCase
): RecoveryTimelineEvent[] {
  const currentStatus = mapRecoveryStatus(recoveryCase.status);
  const events = [
    {
      id: `${recoveryCase.id}-failed`,
      type: "payment_failed",
      title: "Payment Failed",
      description:
        recoveryCase.failure_reason ??
        "The payment failed during processing.",
      timestamp: recoveryCase.updated_at,
      status: "completed",
    },
    {
      id: `${recoveryCase.id}-analysis`,
      type: "analyzed",
      title: "RevRecover Analyzed",
      description: "Customer and payment context were reviewed.",
      timestamp: recoveryCase.created_at,
      status: "completed",
    },
    {
      id: `${recoveryCase.id}-eligible`,
      type: "eligible",
      title: "Recovery Eligible",
      description: "The payment matched recoverable conditions.",
      timestamp: recoveryCase.created_at,
      status: "completed",
    },
    {
      id: `${recoveryCase.id}-strategy`,
      type: "strategy_selected",
      title: "Strategy Selected",
      description: "The recovery strategy was selected.",
      timestamp: recoveryCase.created_at,
      status: "completed",
    },
    {
      id: `${recoveryCase.id}-contacted`,
      type: "customer_contacted",
      title: "Customer Contacted",
      description: "The customer was notified about the recovery action.",
      timestamp: recoveryCase.updated_at,
      status:
        currentStatus === "waiting" ||
        currentStatus === "scheduled" ||
        currentStatus === "contacted"
          ? "current"
          : "completed",
    },
    {
      id: `${recoveryCase.id}-retry`,
      type: "retry_scheduled",
      title: "Retry Scheduled",
      description: "A retry or follow-up action was scheduled.",
      timestamp: recoveryCase.updated_at,
      status:
        currentStatus === "retrying" ||
        currentStatus === "scheduled"
          ? "current"
          : currentStatus === "recovered"
            ? "completed"
            : "upcoming",
    },
    {
      id: `${recoveryCase.id}-recovered`,
      type: "payment_recovered",
      title: "Payment Recovered",
      description: "The payment outcome was finalized.",
      timestamp:
        recoveryCase.recovered_at ?? "",
      status:
        currentStatus === "recovered"
          ? "completed"
          : "upcoming",
    },
  ];

  return events as RecoveryTimelineEvent[];
}

export async function getRecoveryData(): Promise<RecoveryData> {
  try {
    const recoveryCases = await api.get<ApiRecoveryCase[]>("/recovery", {
      params: { limit: 100 },
    });

    const cases = await Promise.all(
      (recoveryCases ?? []).map(mapRecoveryCase)
    );

    const activeCases = cases.filter(
      (recoveryCase) =>
        recoveryCase.status !== "recovered" &&
        recoveryCase.status !== "failed" &&
        recoveryCase.status !== "cancelled"
    ).length;

    const recoveredToday = cases.filter(
      (recoveryCase) => recoveryCase.status === "recovered"
    ).length;

    const revenueRecovered = cases.reduce(
      (sum, recoveryCase) =>
        recoveryCase.status === "recovered"
          ? sum + recoveryCase.expectedRecovery
          : sum,
      0
    );

    return {
      summary: {
        activeCases,
        recoveredToday,
        revenueRecovered,
      },
      cases,
    };
  } catch {
    return {
      summary: {
        activeCases: 0,
        recoveredToday: 0,
        revenueRecovered: 0,
      },
      cases: [],
    };
  }
}

async function mapRecoveryCase(
  recoveryCase: ApiRecoveryCase
): Promise<RecoveryCase> {
  const customer = await api
    .get<{ id: string; name?: string | null; email?: string | null }>(
      `/customers/${recoveryCase.customer_id}`
    )
    .catch(() => null);

  const amount = toNumber(recoveryCase.risk_amount);
  const probability = toNumber(
    recoveryCase.recovery_probability
  );

  const status = mapRecoveryStatus(recoveryCase.status);

  return {
    id: recoveryCase.id,
    paymentId: recoveryCase.payment_id,
    customerId: recoveryCase.customer_id,
    customerName: customer?.name ?? "Customer",
    customerEmail: customer?.email ?? "",
    amount,
    currency: "INR",
    failureReason:
      recoveryCase.failure_reason ??
      recoveryCase.failure_code ??
      "Unknown failure",
    strategy: mapRecoveryStrategy(
      recoveryCase.failure_reason,
      recoveryCase.failure_code
    ),
    status,
    recoveryProbability: Number.isFinite(probability)
      ? probability
      : 0,
    expectedRecovery: toNumber(
      recoveryCase.recovered_amount ?? recoveryCase.risk_amount
    ),
    createdAt: recoveryCase.created_at,
    updatedAt: recoveryCase.updated_at,
    attemptNumber: recoveryCase.max_attempts,
    timeline: mapRecoveryTimeline(recoveryCase),
  };
}

export async function getRecoveryCaseById(
  id: string
): Promise<RecoveryCase | null> {
  try {
    const recoveryCase = await api.get<ApiRecoveryCase>(
      `/recovery/${id}`
    );

    return await mapRecoveryCase(recoveryCase);
  } catch {
    return null;
  }
}
