import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return {
    metrics: {
      revenueAtRisk: 842000,
      revenueRecovered: 318000,
      recoveryRate: 37.8,
      activeCases: 247,
    },

    revenueRecovery: [
      {
        date: "Aug 17",
        atRisk: 610000,
        recovered: 210000,
      },
      {
        date: "Aug 18",
        atRisk: 660000,
        recovered: 225000,
      },
      {
        date: "Aug 19",
        atRisk: 710000,
        recovered: 245000,
      },
      {
        date: "Aug 20",
        atRisk: 760000,
        recovered: 265000,
      },
      {
        date: "Aug 21",
        atRisk: 790000,
        recovered: 280000,
      },
      {
        date: "Aug 22",
        atRisk: 820000,
        recovered: 300000,
      },
      {
        date: "Aug 23",
        atRisk: 842000,
        recovered: 318000,
      },
    ],

    failureReasons: [
      {
        reason: "Insufficient Funds",
        percentage: 41,
        amount: 142000,
      },
      {
        reason: "Expired Card",
        percentage: 23,
        amount: 82000,
      },
      {
        reason: "Bank Decline",
        percentage: 17,
        amount: 54000,
      },
      {
        reason: "Technical Error",
        percentage: 11,
        amount: 30000,
      },
      {
        reason: "Other",
        percentage: 8,
        amount: 22000,
      },
    ],

    recoveryPipeline: {
      failed: 1240,
      eligible: 890,
      contacted: 720,
      retried: 430,
      recovered: 247,
    },

    insights: [
      {
        title: "Insufficient funds dominate failures",
        description:
          "41% of failed payments are caused by insufficient funds. Delayed retries are the strongest recovery opportunity.",
        type: "warning",
      },
      {
        title: "Recovery performance is improving",
        description:
          "Recovered revenue has increased consistently over the last 7 days.",
        type: "positive",
      },
      {
        title: "247 cases are currently active",
        description:
          "Most active cases are waiting for their recommended retry window.",
        type: "info",
      },
    ],
  };
}
