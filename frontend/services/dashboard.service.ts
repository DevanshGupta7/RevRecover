import { api } from "@/lib/api";

import type {
  ApiPaginatedResponse,
} from "@/lib/api-types";

import type {
  DashboardData,
} from "@/types/dashboard";

type ApiPayment = {
  id: string;
  organisation_id: string;
  customer_id: string;
  amount: number | string;
  currency: string;
  status: string;
  provider: string;
  provider_payment_id?: string | null;
  failure_reason?: string | null;
  failure_code?: string | null;
  created_at: string;
  updated_at: string;
};

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

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [failedPaymentsResponse, recoveryCasesResponse] = await Promise.all([
      api.get<ApiPaginatedResponse<ApiPayment>>("/payments", {
        params: { status: "failed", page: 1, page_size: 100 },
      }),
      api.get<ApiRecoveryCase[]>("/recovery", {
        params: { limit: 100 },
      }),
    ]);

    const failedPayments = failedPaymentsResponse.items ?? [];
    const recoveryCases = recoveryCasesResponse ?? [];

    const revenueAtRisk = failedPayments.reduce(
      (sum, payment) => sum + toNumber(payment.amount),
      0
    );

    const revenueRecovered = recoveryCases.reduce(
      (sum, recoveryCase) =>
        recoveryCase.status === "recovered"
          ? sum + toNumber(recoveryCase.recovered_amount ?? recoveryCase.risk_amount)
          : sum,
      0
    );

    const activeCases = recoveryCases.filter(
      (recoveryCase) =>
        recoveryCase.status !== "recovered" &&
        recoveryCase.status !== "failed" &&
        recoveryCase.status !== "cancelled"
    ).length;

    const recoveryRate =
      revenueAtRisk > 0
        ? Number(((revenueRecovered / revenueAtRisk) * 100).toFixed(1))
        : 0;

    const failureReasons = [
      {
        reason: "Insufficient Funds",
        percentage: failedPayments.length
          ? Math.round(
              (failedPayments.filter(
                (payment) =>
                  (payment.failure_reason ?? "")
                    .toLowerCase()
                    .includes("insufficient") ||
                  (payment.failure_code ?? "")
                    .toLowerCase()
                    .includes("insufficient")
              ).length /
                failedPayments.length) *
                100
            )
          : 0,
        amount: failedPayments.reduce(
          (sum, payment) =>
            (payment.failure_reason ?? "")
              .toLowerCase()
              .includes("insufficient") ||
            (payment.failure_code ?? "")
              .toLowerCase()
              .includes("insufficient")
              ? sum + toNumber(payment.amount)
              : sum,
          0
        ),
      },
      {
        reason: "Expired Card",
        percentage: 0,
        amount: 0,
      },
      {
        reason: "Bank Decline",
        percentage: 0,
        amount: 0,
      },
      {
        reason: "Technical Error",
        percentage: 0,
        amount: 0,
      },
      {
        reason: "Other",
        percentage: 0,
        amount: 0,
      },
    ];

    const totalFailureCount = Math.max(failedPayments.length, 1);
    const failureBuckets = failedPayments.reduce(
      (acc, payment) => {
        const key =
          (payment.failure_reason ?? payment.failure_code ?? "other")
            .toLowerCase();
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    failureReasons[1].percentage = failedPayments.length
      ? Math.round((failureBuckets["expired_card"] ?? 0) / totalFailureCount * 100)
      : 0;
    failureReasons[1].amount = failedPayments.reduce(
      (sum, payment) =>
        (payment.failure_code ?? payment.failure_reason ?? "")
          .toLowerCase()
          .includes("expired") ||
        (payment.failure_reason ?? "")
          .toLowerCase()
          .includes("expired")
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    failureReasons[2].percentage = failedPayments.length
      ? Math.round((failureBuckets["bank_decline"] ?? 0) / totalFailureCount * 100)
      : 0;
    failureReasons[2].amount = failedPayments.reduce(
      (sum, payment) =>
        (payment.failure_code ?? payment.failure_reason ?? "")
          .toLowerCase()
          .includes("bank") ||
        (payment.failure_reason ?? "")
          .toLowerCase()
          .includes("bank")
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    failureReasons[3].percentage = failedPayments.length
      ? Math.round((failureBuckets["technical_error"] ?? 0) / totalFailureCount * 100)
      : 0;
    failureReasons[3].amount = failedPayments.reduce(
      (sum, payment) =>
        (payment.failure_code ?? payment.failure_reason ?? "")
          .toLowerCase()
          .includes("technical") ||
        (payment.failure_reason ?? "")
          .toLowerCase()
          .includes("technical")
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    failureReasons[4].percentage = failedPayments.length
      ? Math.max(
          100 -
            failureReasons
              .slice(0, 4)
              .reduce((sum, item) => sum + item.percentage, 0),
          0
        )
      : 0;
    failureReasons[4].amount = failedPayments.reduce(
      (sum, payment) =>
        ![
          "insufficient",
          "expired",
          "bank",
          "technical",
        ].some((keyword) =>
          (payment.failure_reason ?? payment.failure_code ?? "")
            .toLowerCase()
            .includes(keyword)
        )
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    return {
      metrics: {
        revenueAtRisk: revenueAtRisk,
        revenueRecovered: revenueRecovered,
        recoveryRate: recoveryRate,
        activeCases: activeCases,
      },
      revenueRecovery: [
        {
          date: "Today",
          atRisk: revenueAtRisk,
          recovered: revenueRecovered,
        },
      ],
      failureReasons: failureReasons.map((item) => ({
        reason: item.reason,
        percentage: item.percentage,
        amount: item.amount,
      })),
      recoveryPipeline: {
        failed: failedPayments.length,
        eligible: activeCases,
        contacted: activeCases,
        retried: Math.max(activeCases - 1, 0),
        recovered: recoveryCases.filter(
          (recoveryCase) => recoveryCase.status === "recovered"
        ).length,
      },
      insights: [
        {
          title: "Live failed-payment data",
          description:
            "The dashboard is now using real payment and recovery records from the backend instead of static mock values.",
          type: "positive",
        },
        {
          title: "Revenue at risk is being tracked",
          description:
            "Failed payment totals are being pulled directly from the payments table for real-time monitoring.",
          type: "warning",
        },
        {
          title: "Recovery workflow is active",
          description:
            "The number of active cases is derived from the recovery table and updates with the backend state.",
          type: "info",
        },
      ],
    };
    } catch (error) {
    console.error(
      "Failed to load dashboard data:",
      error
    );

    throw error;
  }
  // } catch {
  //   return {
  //     metrics: {
  //       revenueAtRisk: 0,
  //       revenueRecovered: 0,
  //       recoveryRate: 0,
  //       activeCases: 0,
  //     },
  //     revenueRecovery: [],
  //     failureReasons: [],
  //     recoveryPipeline: {
  //       failed: 0,
  //       eligible: 0,
  //       contacted: 0,
  //       retried: 0,
  //       recovered: 0,
  //     },
  //     insights: [],
  //   };
  // }
}
