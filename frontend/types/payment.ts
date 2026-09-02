export type PaymentStatus = "failed" | "succeeded";

export type FailureReason =
  | "insufficient_funds"
  | "expired_card"
  | "bank_decline"
  | "technical_error"
  | "other";

export type RecoveryEligibility =
  | "high"
  | "medium"
  | "low"
  | "not_eligible";

export type RecoveryStrategy =
  | "retry_after_delay"
  | "update_payment_method"
  | "alternate_payment_method"
  | "contact_customer"
  | "manual_review"
  | "none";

export interface FailedPayment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;

  amount: number;
  currency: "INR";

  status: PaymentStatus;

  failureReason: FailureReason;
  failureMessage: string;

  failedAt: string;

  previousAttempts: number;

  recoveryEligibility: RecoveryEligibility;

  recommendedStrategy: RecoveryStrategy;

  expectedRecovery: number;
  confidence: number;

  customerLifetimeValue: number;
  successfulPayments: number;

  previousRetrySucceeded: boolean;
  subscriptionActive: boolean;
}
