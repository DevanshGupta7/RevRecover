import type {
  FailedPayment,
} from "@/types/payment";

const FAILED_PAYMENTS: FailedPayment[] = [
  {
    id: "pay_123",
    customerId: "cus_001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@example.com",
    amount: 4500,
    currency: "INR",
    status: "failed",
    failureReason: "insufficient_funds",
    failureMessage:
      "The customer's account did not have sufficient funds to complete the payment.",
    failedAt: "2026-08-23T10:24:00Z",
    previousAttempts: 2,
    recoveryEligibility: "high",
    recommendedStrategy: "retry_after_delay",
    expectedRecovery: 4500,
    confidence: 87,
    customerLifetimeValue: 42000,
    successfulPayments: 18,
    previousRetrySucceeded: true,
    subscriptionActive: true,
  },

  {
    id: "pay_124",
    customerId: "cus_002",
    customerName: "Aman Gupta",
    customerEmail: "aman@example.com",
    amount: 2100,
    currency: "INR",
    status: "failed",
    failureReason: "expired_card",
    failureMessage:
      "The payment method associated with this customer has expired.",
    failedAt: "2026-08-23T09:18:00Z",
    previousAttempts: 1,
    recoveryEligibility: "high",
    recommendedStrategy: "update_payment_method",
    expectedRecovery: 2100,
    confidence: 76,
    customerLifetimeValue: 18000,
    successfulPayments: 11,
    previousRetrySucceeded: false,
    subscriptionActive: true,
  },

  {
    id: "pay_125",
    customerId: "cus_003",
    customerName: "Priya Singh",
    customerEmail: "priya@example.com",
    amount: 8900,
    currency: "INR",
    status: "failed",
    failureReason: "bank_decline",
    failureMessage:
      "The issuing bank declined the payment.",
    failedAt: "2026-08-22T17:42:00Z",
    previousAttempts: 3,
    recoveryEligibility: "medium",
    recommendedStrategy: "alternate_payment_method",
    expectedRecovery: 5340,
    confidence: 64,
    customerLifetimeValue: 67000,
    successfulPayments: 24,
    previousRetrySucceeded: false,
    subscriptionActive: true,
  },

  {
    id: "pay_126",
    customerId: "cus_004",
    customerName: "Arjun Mehta",
    customerEmail: "arjun@example.com",
    amount: 1200,
    currency: "INR",
    status: "failed",
    failureReason: "technical_error",
    failureMessage:
      "The payment could not be completed due to a temporary technical error.",
    failedAt: "2026-08-22T15:10:00Z",
    previousAttempts: 1,
    recoveryEligibility: "high",
    recommendedStrategy: "retry_after_delay",
    expectedRecovery: 1200,
    confidence: 81,
    customerLifetimeValue: 15000,
    successfulPayments: 7,
    previousRetrySucceeded: true,
    subscriptionActive: true,
  },

  {
    id: "pay_127",
    customerId: "cus_005",
    customerName: "Neha Kapoor",
    customerEmail: "neha@example.com",
    amount: 3200,
    currency: "INR",
    status: "failed",
    failureReason: "insufficient_funds",
    failureMessage:
      "The customer's account did not have sufficient funds to complete the payment.",
    failedAt: "2026-08-21T12:34:00Z",
    previousAttempts: 4,
    recoveryEligibility: "medium",
    recommendedStrategy: "retry_after_delay",
    expectedRecovery: 1920,
    confidence: 60,
    customerLifetimeValue: 27000,
    successfulPayments: 14,
    previousRetrySucceeded: true,
    subscriptionActive: true,
  },

  {
    id: "pay_128",
    customerId: "cus_006",
    customerName: "Vikram Malhotra",
    customerEmail: "vikram@example.com",
    amount: 7600,
    currency: "INR",
    status: "failed",
    failureReason: "other",
    failureMessage:
      "The payment failed due to an unspecified payment issue.",
    failedAt: "2026-08-20T08:15:00Z",
    previousAttempts: 2,
    recoveryEligibility: "low",
    recommendedStrategy: "manual_review",
    expectedRecovery: 760,
    confidence: 38,
    customerLifetimeValue: 9200,
    successfulPayments: 3,
    previousRetrySucceeded: false,
    subscriptionActive: false,
  },
];

export function getFailedPayments(): FailedPayment[] {
  return FAILED_PAYMENTS;
}

export function getPaymentById(
  id: string
): FailedPayment | null {
  return (
    FAILED_PAYMENTS.find((payment) => payment.id === id) ?? null
  );
}
