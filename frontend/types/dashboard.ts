export interface DashboardMetrics {
  revenueAtRisk: number;
  revenueRecovered: number;
  recoveryRate: number;
  activeCases: number;
}

export interface RevenueRecoveryPoint {
  date: string;
  atRisk: number;
  recovered: number;
}

export interface FailureReason {
  reason: string;
  percentage: number;
  amount: number;
}

export interface RecoveryPipeline {
  failed: number;
  eligible: number;
  contacted: number;
  retried: number;
  recovered: number;
}

export type InsightType = "positive" | "warning" | "info";

export interface RecoveryInsight {
  title: string;
  description: string;
  type: InsightType;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenueRecovery: RevenueRecoveryPoint[];
  failureReasons: FailureReason[];
  recoveryPipeline: RecoveryPipeline;
  insights: RecoveryInsight[];
}
