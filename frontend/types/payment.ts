export type PaymentStatus = "failed";

export type FailureReason =
  | "Insufficient Funds"
  | "Expired Card"
  | "Bank Decline"
  | "Technical Error"
  | "Other";

export type RecoveryEligibility = "high" | "medium" | "low";

export interface FailedPayment {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: "INR";
  failureReason: FailureReason;
  status: PaymentStatus;
  recoveryEligibility: RecoveryEligibility;
  failedAt: string;
  previousAttempts: number;
}
