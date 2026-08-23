import type {
  FailureReason,
  RecoveryEligibility,
} from "@/types/payment";

export interface PaymentFilters {
  search: string;
  failureReason: FailureReason | "all";
  eligibility: RecoveryEligibility | "all";
}
