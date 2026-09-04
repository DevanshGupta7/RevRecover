import { api } from "@/lib/api";

import type {
  RecoveryStrategy,
  StrategyData,
} from "@/types/strategy";

interface ApiStrategy {
  failure_type: string;
  label: string;
  recommended_action: string;
  action_type: string;
  delay_hours: number | null;
  channel: string | null;
  reason: string;
  cases: number;
  recovered_amount: number | string;
  success_rate: number | string;
}

interface ApiStrategyData {
  strategies: ApiStrategy[];
}

function toStrategy(strategy: ApiStrategy): RecoveryStrategy {
  const delay = strategy.delay_hours
    ? `Wait ${strategy.delay_hours} hours -> `
    : "";

  return {
    id: strategy.failure_type,
    name: strategy.label,
    type: strategy.action_type === "RETRY_PAYMENT"
      ? "retry_after_delay"
      : strategy.action_type === "CREATE_PAYMENT_LINK"
        ? "update_payment_method"
        : "manual_review",
    description: strategy.reason,
    action: `${delay}${strategy.action_type === "CREATE_PAYMENT_LINK" ? "Create Payment Link" : strategy.action_type === "RETRY_PAYMENT" ? "Retry Payment" : "Manual Review"}`,
    status: "active",
    applicableFailureReasons: [strategy.label],
    stats: {
      successRate: Number(strategy.success_rate),
      revenueRecovered: Number(strategy.recovered_amount),
      recoveryCases: strategy.cases,
      averageRecoveryTime: "-",
      averageAttempts: 0,
    },
    workflow: [],
    cases: [],
    whyItWorks: strategy.reason,
    createdAt: "",
    updatedAt: "",
  };
}

export async function getStrategyData(): Promise<StrategyData> {
  const data = await api.get<ApiStrategyData>("/recovery/strategies");

  return {
    strategies: data.strategies.map(toStrategy),
  };
}

export async function getStrategyById(
  id: string
): Promise<RecoveryStrategy | null> {
  const data = await getStrategyData();

  return data.strategies.find((strategy) => strategy.id === id) ?? null;
}
