import type {
  AnalyticsData,
} from "@/types/analytics";

const ANALYTICS_DATA: AnalyticsData = {
  metrics: {
    revenueAtRisk: 842000,
    eligibleRevenue: 673000,
    recoveredRevenue: 318000,
    unrecoverableRevenue: 169000,

    recoveryRate: 37.8,
    recoveryRoi: 4.2,
    averageRecoveryTime: "18.4h",
    averageAttempts: 1.7,
  },

  revenueRecovery: [
    {
      date: "Aug 01",
      atRisk: 48000,
      recovered: 17000,
    },
    {
      date: "Aug 03",
      atRisk: 62000,
      recovered: 24000,
    },
    {
      date: "Aug 05",
      atRisk: 55000,
      recovered: 21000,
    },
    {
      date: "Aug 07",
      atRisk: 71000,
      recovered: 29000,
    },
    {
      date: "Aug 09",
      atRisk: 68000,
      recovered: 31000,
    },
    {
      date: "Aug 11",
      atRisk: 76000,
      recovered: 33000,
    },
    {
      date: "Aug 13",
      atRisk: 69000,
      recovered: 28000,
    },
    {
      date: "Aug 15",
      atRisk: 83000,
      recovered: 35000,
    },
    {
      date: "Aug 17",
      atRisk: 79000,
      recovered: 36000,
    },
    {
      date: "Aug 19",
      atRisk: 92000,
      recovered: 42000,
    },
    {
      date: "Aug 21",
      atRisk: 88000,
      recovered: 41000,
    },
    {
      date: "Aug 23",
      atRisk: 94000,
      recovered: 44000,
    },
  ],

  failureReasons: [
    {
      reason: "Insufficient Funds",
      amount: 142000,
      percentage: 41,
    },
    {
      reason: "Expired Card",
      amount: 82000,
      percentage: 23,
    },
    {
      reason: "Bank Decline",
      amount: 54000,
      percentage: 17,
    },
    {
      reason: "Technical Error",
      amount: 30000,
      percentage: 11,
    },
    {
      reason: "Other",
      amount: 22000,
      percentage: 8,
    },
  ],

  strategyPerformance: [
    {
      strategy: "Retry after delay",
      successRate: 42,
      revenueRecovered: 124000,
      cases: 128,
    },
    {
      strategy: "Update payment method",
      successRate: 61,
      revenueRecovered: 84000,
      cases: 74,
    },
    {
      strategy: "Alternate payment method",
      successRate: 34,
      revenueRecovered: 54000,
      cases: 61,
    },
    {
      strategy: "Technical retry",
      successRate: 68,
      revenueRecovered: 30000,
      cases: 39,
    },
  ],

  recoveryFunnel: [
    {
      stage: "Failed",
      count: 1240,
      percentage: 100,
    },
    {
      stage: "Eligible",
      count: 890,
      percentage: 71.8,
    },
    {
      stage: "Contacted",
      count: 720,
      percentage: 58.1,
    },
    {
      stage: "Retried",
      count: 430,
      percentage: 34.7,
    },
    {
      stage: "Recovered",
      count: 247,
      percentage: 19.9,
    },
  ],

  recoveryOutcomes: [
    {
      outcome: "Recovered",
      count: 247,
      percentage: 19.9,
    },
    {
      outcome: "Active",
      count: 193,
      percentage: 15.6,
    },
    {
      outcome: "Failed",
      count: 89,
      percentage: 7.2,
    },
    {
      outcome: "Unrecoverable",
      count: 711,
      percentage: 57.3,
    },
  ],
};

export function getAnalyticsData(): AnalyticsData {
  return ANALYTICS_DATA;
}
