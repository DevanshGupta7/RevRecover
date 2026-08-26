export interface AnalyticsMetrics {
  revenueAtRisk: number;
  eligibleRevenue: number;
  recoveredRevenue: number;
  unrecoverableRevenue: number;

  recoveryRate: number;
  recoveryRoi: number;
  averageRecoveryTime: string;
  averageAttempts: number;
}

export interface RevenueRecoveryPoint {
  date: string;
  atRisk: number;
  recovered: number;
}

export interface FailureReasonData {
  reason: string;
  amount: number;
  percentage: number;
}

export interface StrategyPerformanceData {
  strategy: string;
  successRate: number;
  revenueRecovered: number;
  cases: number;
}

export interface RecoveryFunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface RecoveryOutcomeData {
  outcome: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  revenueRecovery: RevenueRecoveryPoint[];
  failureReasons: FailureReasonData[];
  strategyPerformance: StrategyPerformanceData[];
  recoveryFunnel: RecoveryFunnelData[];
  recoveryOutcomes: RecoveryOutcomeData[];
}
