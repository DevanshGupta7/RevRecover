export interface DashboardMetrics {
  revenueAtRisk: number;
  revenueRecovered: number;
  recoveryRate: number;
  activeCases: number;
}

export interface FailureReason {
  reason: string;
  percentage: number;
  amount?: number;
}

export interface RecoveryPipeline {
  failed: number;
  eligible: number;
  contacted: number;
  retried: number;
  recovered: number;
}
