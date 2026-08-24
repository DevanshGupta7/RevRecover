export type StrategyStatus =
  | "active"
  | "paused"
  | "experimental";

export type StrategyType =
  | "retry_after_delay"
  | "update_payment_method"
  | "alternate_payment_method"
  | "customer_contact"
  | "manual_review";

export interface StrategyStats {
  successRate: number;
  revenueRecovered: number;
  recoveryCases: number;
  averageRecoveryTime: string;
  averageAttempts: number;
}

export interface StrategyWorkflowStep {
  id: string;
  title: string;
  description: string;
}

export interface StrategyCase {
  id: string;
  customerName: string;
  amount: number;
  status:
    | "waiting"
    | "scheduled"
    | "contacted"
    | "retrying"
    | "recovered"
    | "failed";
  recoveryProbability: number;
}

export interface RecoveryStrategy {
  id: string;

  name: string;

  type: StrategyType;

  description: string;

  action: string;

  status: StrategyStatus;

  applicableFailureReasons: string[];

  stats: StrategyStats;

  workflow: StrategyWorkflowStep[];

  cases: StrategyCase[];

  whyItWorks: string;

  createdAt: string;
  updatedAt: string;
}

export interface StrategyData {
  strategies: RecoveryStrategy[];
}
