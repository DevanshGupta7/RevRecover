import { api } from "@/lib/api";
import { normalizePercentage } from "@/lib/recovery-formatters";

import type {
  RecoveryCase,
  RecoveryAction,
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

type ApiRecoveryAction = {
  id: string;
  action_type: string;
  status: string;
  step_number: number;
  planned_at?: string | null;
  executed_at?: string | null;
  result_data?: RecoveryAction["resultData"];
};

export type StartRecoveryResponse = {
  success: boolean;
  already_exists: boolean;
  recovery_case: ApiRecoveryCase;
  ai_decision?: {
    recommended_action: string;
  } | null;
  recovery_action?: {
    id: string;
    action_type: string;
    status: string;
  } | null;
};

export async function startRecovery(
  paymentId: string
): Promise<StartRecoveryResponse> {
  return api.post<StartRecoveryResponse>(
    `/recovery/payments/${paymentId}/process`
  );
}

export async function executeRecoveryAction(
  actionId: string
): Promise<ApiRecoveryAction> {
  return api.post<ApiRecoveryAction>(
    `/recovery/actions/${actionId}/execute`
  );
}

export async function approveRecoveryAction(
  actionId: string
): Promise<ApiRecoveryAction> {
  return api.post<ApiRecoveryAction>(
    `/recovery/actions/${actionId}/approve`
  );
}

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
    case "awaiting_approval":
      return "awaiting_approval";
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
  recoveryCase: ApiRecoveryCase,
  action?: ApiRecoveryAction
): RecoveryTimelineEvent[] {
  const currentStatus = mapRecoveryStatus(recoveryCase.status);
  const events: RecoveryTimelineEvent[] = [
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
  ];

  if (action) {
    const isPaymentLink = action.action_type === "CREATE_PAYMENT_LINK";
    const actionExecuted = action.status === "executed";
    events.push({
      id: `${recoveryCase.id}-action`,
      type: isPaymentLink ? "payment_link_created" : "recovery_action",
      title: isPaymentLink ? "Payment Link Created" : "Recovery Action Scheduled",
      description: isPaymentLink
        ? "A secure payment link was created for the customer to complete payment."
        : "The selected recovery action was scheduled by the recovery workflow.",
      timestamp: action.executed_at ?? action.planned_at ?? recoveryCase.updated_at,
      status: currentStatus === "recovered" || actionExecuted ? "completed" : "current",
    });
  }

  if (currentStatus === "recovered") {
    events.push({
      id: `${recoveryCase.id}-recovered`,
      type: "payment_recovered",
      title: "Payment Recovered",
      description: "The customer completed payment and the recovery was finalized.",
      timestamp: recoveryCase.recovered_at ?? recoveryCase.updated_at,
      status: "completed",
    });
  } else if (currentStatus === "failed") {
    events.push({
      id: `${recoveryCase.id}-failed-recovery`,
      type: "recovery_failed",
      title: "Recovery Failed",
      description: "The recovery workflow ended without recovering the payment.",
      timestamp: recoveryCase.updated_at,
      status: "completed",
    });
  }

  return events;
}

export async function getRecoveryData(): Promise<RecoveryData> {
  try {
    const recoveryCases = await api.get<ApiRecoveryCase[]>("/recovery", {
      params: { limit: 100 },
    });

    const cases = await Promise.all(
      (recoveryCases ?? []).map((recoveryCase) =>
        mapRecoveryCase(recoveryCase)
      )
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
  recoveryCase: ApiRecoveryCase,
  action?: ApiRecoveryAction
): Promise<RecoveryCase> {
  const customer = await api
    .get<{ id: string; name?: string | null; email?: string | null }>(
      `/customers/${recoveryCase.customer_id}`
    )
    .catch(() => null);

  const amount = toNumber(recoveryCase.risk_amount);
  const probability = normalizePercentage(
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
    recoveryProbability: probability,
    expectedRecovery: toNumber(
      recoveryCase.recovered_amount ?? recoveryCase.risk_amount
    ),
    createdAt: recoveryCase.created_at,
    updatedAt: recoveryCase.updated_at,
    attemptNumber: recoveryCase.max_attempts,
    timeline: mapRecoveryTimeline(recoveryCase, action),
  };
}

export async function getRecoveryCaseById(
  id: string
): Promise<RecoveryCase | null> {
  try {
    const [recoveryCase, actions] = await Promise.all([
      api.get<ApiRecoveryCase>(
      `/recovery/${id}`
      ),
      api.get<ApiRecoveryAction[]>(
        `/recovery/${id}/actions`
      ),
    ]);

    const action = actions[0];
    const mappedCase = await mapRecoveryCase(recoveryCase, action);

    return {
      ...mappedCase,
      action: action
        ? {
            id: action.id,
            actionType: action.action_type,
            status: action.status,
            stepNumber: action.step_number,
            plannedAt: action.planned_at,
            executedAt: action.executed_at,
            resultData: action.result_data,
          }
        : null,
    };
  } catch {
    return null;
  }
}
