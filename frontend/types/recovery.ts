export type RecoveryCaseStatus =
  | "waiting"
  | "scheduled"
  | "contacted"
  | "retrying"
  | "recovered"
  | "failed"
  | "cancelled";

export type RecoveryAction = {
  id: string;
  actionType: string;
  status: string;
  stepNumber: number;
  plannedAt?: string | null;
  executedAt?: string | null;
  resultData?: {
    payment_link_id?: string;
    short_url?: string;
    reference_id?: string;
    [key: string]: unknown;
  } | null;
};

export type RecoveryEventStatus =
  | "completed"
  | "current"
  | "upcoming";

export type RecoveryEventType =
  | "payment_failed"
  | "analyzed"
  | "eligible"
  | "strategy_selected"
  | "customer_contacted"
  | "retry_scheduled"
  | "payment_recovered"
  | "recovery_failed";

export interface RecoveryTimelineEvent {
  id: string;
  type: RecoveryEventType;
  title: string;
  description: string;
  timestamp: string;
  status: RecoveryEventStatus;
}

export interface RecoveryCase {
  id: string;

  paymentId: string;

  customerId: string;
  customerName: string;
  customerEmail: string;

  amount: number;
  currency: "INR";

  failureReason: string;

  strategy:
    | "retry_after_delay"
    | "update_payment_method"
    | "alternate_payment_method"
    | "contact_customer"
    | "manual_review";

  status: RecoveryCaseStatus;

  recoveryProbability: number;
  expectedRecovery: number;

  createdAt: string;
  updatedAt: string;

  attemptNumber: number;

  timeline: RecoveryTimelineEvent[];

  action?: RecoveryAction | null;
}

export interface RecoverySummary {
  activeCases: number;
  recoveredToday: number;
  revenueRecovered: number;
}

export interface RecoveryData {
  summary: RecoverySummary;
  cases: RecoveryCase[];
}
