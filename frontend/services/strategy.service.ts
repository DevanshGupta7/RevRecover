import type {
  RecoveryStrategy,
  StrategyData,
} from "@/types/strategy";

const STRATEGIES: RecoveryStrategy[] = [
  {
    id: "insufficient-funds",

    name: "Insufficient Funds",

    type: "retry_after_delay",

    description:
      "Wait for the customer's balance to recover before retrying the failed payment.",

    action: "Wait 24 hours → Retry payment",

    status: "active",

    applicableFailureReasons: [
      "Insufficient Funds",
    ],

    stats: {
      successRate: 42,
      revenueRecovered: 124000,
      recoveryCases: 128,
      averageRecoveryTime: "18.4 hours",
      averageAttempts: 1.7,
    },

    workflow: [
      {
        id: "step-1",
        title: "Payment fails",
        description:
          "The payment processor reports an insufficient-funds failure.",
      },
      {
        id: "step-2",
        title: "Evaluate recovery potential",
        description:
          "RevRecover evaluates customer history and payment context.",
      },
      {
        id: "step-3",
        title: "Wait 24 hours",
        description:
          "The system waits for the customer's available balance to recover.",
      },
      {
        id: "step-4",
        title: "Retry payment",
        description:
          "RevRecover automatically retries the payment.",
      },
      {
        id: "step-5",
        title: "Evaluate outcome",
        description:
          "The retry result is recorded and the recovery case is updated.",
      },
    ],

    cases: [
      {
        id: "rec_001",
        customerName: "Rahul Sharma",
        amount: 4500,
        status: "scheduled",
        recoveryProbability: 87,
      },
      {
        id: "rec_007",
        customerName: "Neha Verma",
        amount: 3200,
        status: "recovered",
        recoveryProbability: 79,
      },
      {
        id: "rec_011",
        customerName: "Vikram Singh",
        amount: 6800,
        status: "retrying",
        recoveryProbability: 71,
      },
    ],

    whyItWorks:
      "Insufficient-funds failures are often temporary. Waiting before retrying gives customers time to restore their available balance while avoiding unnecessary immediate retry attempts.",

    createdAt: "2026-07-12T10:00:00Z",
    updatedAt: "2026-08-23T14:30:00Z",
  },

  {
    id: "expired-card",

    name: "Expired Card",

    type: "update_payment_method",

    description:
      "Request an updated payment method before attempting to collect the failed payment again.",

    action: "Request payment method update",

    status: "active",

    applicableFailureReasons: [
      "Expired Card",
      "Invalid Card",
    ],

    stats: {
      successRate: 61,
      revenueRecovered: 84000,
      recoveryCases: 74,
      averageRecoveryTime: "11.2 hours",
      averageAttempts: 1.3,
    },

    workflow: [
      {
        id: "step-1",
        title: "Payment fails",
        description:
          "The payment processor reports an expired or invalid card.",
      },
      {
        id: "step-2",
        title: "Identify payment-method issue",
        description:
          "RevRecover determines that retrying the same card is unlikely to succeed.",
      },
      {
        id: "step-3",
        title: "Request payment update",
        description:
          "The customer receives a secure payment-method update request.",
      },
      {
        id: "step-4",
        title: "Payment method updated",
        description:
          "The new payment method is stored for the recovery attempt.",
      },
      {
        id: "step-5",
        title: "Retry payment",
        description:
          "The failed payment is retried using the updated method.",
      },
    ],

    cases: [
      {
        id: "rec_002",
        customerName: "Aman Gupta",
        amount: 2100,
        status: "contacted",
        recoveryProbability: 76,
      },
      {
        id: "rec_015",
        customerName: "Karan Mehta",
        amount: 5600,
        status: "recovered",
        recoveryProbability: 83,
      },
      {
        id: "rec_022",
        customerName: "Simran Kapoor",
        amount: 1800,
        status: "waiting",
        recoveryProbability: 68,
      },
    ],

    whyItWorks:
      "Retrying an expired card repeatedly is unlikely to succeed. Updating the payment method addresses the actual failure condition before another collection attempt.",

    createdAt: "2026-07-14T09:00:00Z",
    updatedAt: "2026-08-23T13:10:00Z",
  },

  {
    id: "bank-decline",

    name: "Bank Decline",

    type: "alternate_payment_method",

    description:
      "Use an alternate payment method when the issuing bank declines the original payment.",

    action: "Try alternate payment method",

    status: "active",

    applicableFailureReasons: [
      "Bank Decline",
      "Issuer Decline",
    ],

    stats: {
      successRate: 34,
      revenueRecovered: 54000,
      recoveryCases: 61,
      averageRecoveryTime: "22.1 hours",
      averageAttempts: 2.1,
    },

    workflow: [
      {
        id: "step-1",
        title: "Bank declines payment",
        description:
          "The issuing bank rejects the payment attempt.",
      },
      {
        id: "step-2",
        title: "Analyze decline",
        description:
          "RevRecover evaluates whether another payment route could succeed.",
      },
      {
        id: "step-3",
        title: "Contact customer",
        description:
          "The customer receives an option to use an alternate payment method.",
      },
      {
        id: "step-4",
        title: "Retry with alternate method",
        description:
          "The payment is attempted using the selected alternative.",
      },
      {
        id: "step-5",
        title: "Evaluate outcome",
        description:
          "RevRecover records the result and updates the recovery case.",
      },
    ],

    cases: [
      {
        id: "rec_003",
        customerName: "Priya Singh",
        amount: 8900,
        status: "retrying",
        recoveryProbability: 64,
      },
      {
        id: "rec_019",
        customerName: "Rohan Shah",
        amount: 4300,
        status: "recovered",
        recoveryProbability: 72,
      },
    ],

    whyItWorks:
      "A bank decline does not always mean the customer cannot pay. An alternate payment route can bypass temporary issuer or payment-network issues.",

    createdAt: "2026-07-18T12:00:00Z",
    updatedAt: "2026-08-22T16:45:00Z",
  },

  {
    id: "technical-error",

    name: "Technical Error",

    type: "retry_after_delay",

    description:
      "Retry temporary technical failures after a short delay when the underlying issue is likely transient.",

    action: "Wait 30 minutes → Retry payment",

    status: "active",

    applicableFailureReasons: [
      "Technical Error",
      "Gateway Timeout",
      "Temporary Processing Error",
    ],

    stats: {
      successRate: 68,
      revenueRecovered: 30000,
      recoveryCases: 39,
      averageRecoveryTime: "2.8 hours",
      averageAttempts: 1.2,
    },

    workflow: [
      {
        id: "step-1",
        title: "Technical failure detected",
        description:
          "The payment fails because of a temporary processing issue.",
      },
      {
        id: "step-2",
        title: "Classify failure",
        description:
          "RevRecover determines that the failure is likely transient.",
      },
      {
        id: "step-3",
        title: "Wait 30 minutes",
        description:
          "The system allows the temporary issue to clear.",
      },
      {
        id: "step-4",
        title: "Retry payment",
        description:
          "RevRecover retries the payment.",
      },
    ],

    cases: [
      {
        id: "rec_004",
        customerName: "Arjun Mehta",
        amount: 1200,
        status: "recovered",
        recoveryProbability: 81,
      },
      {
        id: "rec_031",
        customerName: "Meera Joshi",
        amount: 2800,
        status: "recovered",
        recoveryProbability: 74,
      },
    ],

    whyItWorks:
      "Temporary technical failures often resolve without customer intervention. A short delay avoids unnecessary customer communication while allowing the system to retry automatically.",

    createdAt: "2026-07-20T08:30:00Z",
    updatedAt: "2026-08-23T09:20:00Z",
  },
];

export function getStrategyData(): StrategyData {
  return {
    strategies: STRATEGIES,
  };
}

export function getStrategyById(
  id: string
): RecoveryStrategy | null {
  return (
    STRATEGIES.find(
      (strategy) => strategy.id === id
    ) ?? null
  );
}
