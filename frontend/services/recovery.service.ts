import type {
  RecoveryCase,
  RecoveryData,
} from "@/types/recovery";

const RECOVERY_CASES: RecoveryCase[] = [
  {
    id: "rec_001",
    paymentId: "pay_123",
    customerId: "cus_001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@example.com",
    amount: 4500,
    currency: "INR",
    failureReason: "Insufficient Funds",
    strategy: "retry_after_delay",
    status: "scheduled",
    recoveryProbability: 87,
    expectedRecovery: 4500,
    createdAt: "2026-08-23T10:25:00Z",
    updatedAt: "2026-08-23T12:15:00Z",
    attemptNumber: 2,

    timeline: [
      {
        id: "evt_001",
        type: "payment_failed",
        title: "Payment Failed",
        description:
          "Payment pay_123 failed because the customer had insufficient funds.",
        timestamp: "2026-08-23T10:24:00Z",
        status: "completed",
      },
      {
        id: "evt_002",
        type: "analyzed",
        title: "RevRecover Analyzed",
        description:
          "Customer history and payment context were analyzed.",
        timestamp: "2026-08-23T10:25:00Z",
        status: "completed",
      },
      {
        id: "evt_003",
        type: "eligible",
        title: "Recovery Eligible",
        description:
          "The payment was classified as having high recovery potential.",
        timestamp: "2026-08-23T10:25:30Z",
        status: "completed",
      },
      {
        id: "evt_004",
        type: "strategy_selected",
        title: "Strategy Selected",
        description:
          "RevRecover selected a delayed retry based on the failure context.",
        timestamp: "2026-08-23T10:26:00Z",
        status: "completed",
      },
      {
        id: "evt_005",
        type: "customer_contacted",
        title: "Customer Contacted",
        description:
          "A recovery communication was sent to the customer.",
        timestamp: "2026-08-23T10:30:00Z",
        status: "completed",
      },
      {
        id: "evt_006",
        type: "retry_scheduled",
        title: "Retry Scheduled",
        description:
          "Payment retry scheduled for the recommended recovery window.",
        timestamp: "2026-08-24T10:30:00Z",
        status: "current",
      },
      {
        id: "evt_007",
        type: "payment_recovered",
        title: "Payment Recovered",
        description:
          "The original payment amount was successfully recovered.",
        timestamp: "",
        status: "upcoming",
      },
    ],
  },

  {
    id: "rec_002",
    paymentId: "pay_124",
    customerId: "cus_002",
    customerName: "Aman Gupta",
    customerEmail: "aman@example.com",
    amount: 2100,
    currency: "INR",
    failureReason: "Expired Card",
    strategy: "update_payment_method",
    status: "contacted",
    recoveryProbability: 76,
    expectedRecovery: 2100,
    createdAt: "2026-08-23T09:20:00Z",
    updatedAt: "2026-08-23T11:10:00Z",
    attemptNumber: 1,

    timeline: [
      {
        id: "evt_101",
        type: "payment_failed",
        title: "Payment Failed",
        description:
          "Payment pay_124 failed because the payment card had expired.",
        timestamp: "2026-08-23T09:18:00Z",
        status: "completed",
      },
      {
        id: "evt_102",
        type: "analyzed",
        title: "RevRecover Analyzed",
        description:
          "Customer payment history and payment-method status were analyzed.",
        timestamp: "2026-08-23T09:19:00Z",
        status: "completed",
      },
      {
        id: "evt_103",
        type: "eligible",
        title: "Recovery Eligible",
        description:
          "The payment was classified as having high recovery potential.",
        timestamp: "2026-08-23T09:19:30Z",
        status: "completed",
      },
      {
        id: "evt_104",
        type: "strategy_selected",
        title: "Strategy Selected",
        description:
          "RevRecover selected payment-method update as the recovery strategy.",
        timestamp: "2026-08-23T09:20:00Z",
        status: "completed",
      },
      {
        id: "evt_105",
        type: "customer_contacted",
        title: "Customer Contacted",
        description:
          "The customer was sent a secure request to update their payment method.",
        timestamp: "2026-08-23T09:25:00Z",
        status: "current",
      },
      {
        id: "evt_106",
        type: "retry_scheduled",
        title: "Retry Scheduled",
        description:
          "Retry will be scheduled after the payment method is updated.",
        timestamp: "",
        status: "upcoming",
      },
      {
        id: "evt_107",
        type: "payment_recovered",
        title: "Payment Recovered",
        description:
          "Payment will be marked recovered after a successful retry.",
        timestamp: "",
        status: "upcoming",
      },
    ],
  },

  {
    id: "rec_003",
    paymentId: "pay_125",
    customerId: "cus_003",
    customerName: "Priya Singh",
    customerEmail: "priya@example.com",
    amount: 8900,
    currency: "INR",
    failureReason: "Bank Decline",
    strategy: "alternate_payment_method",
    status: "retrying",
    recoveryProbability: 64,
    expectedRecovery: 5340,
    createdAt: "2026-08-22T17:45:00Z",
    updatedAt: "2026-08-23T13:20:00Z",
    attemptNumber: 4,

    timeline: [
      {
        id: "evt_201",
        type: "payment_failed",
        title: "Payment Failed",
        description:
          "Payment pay_125 was declined by the issuing bank.",
        timestamp: "2026-08-22T17:42:00Z",
        status: "completed",
      },
      {
        id: "evt_202",
        type: "analyzed",
        title: "RevRecover Analyzed",
        description:
          "Previous payment attempts and customer history were analyzed.",
        timestamp: "2026-08-22T17:43:00Z",
        status: "completed",
      },
      {
        id: "evt_203",
        type: "eligible",
        title: "Recovery Eligible",
        description:
          "The payment was classified as having medium recovery potential.",
        timestamp: "2026-08-22T17:44:00Z",
        status: "completed",
      },
      {
        id: "evt_204",
        type: "strategy_selected",
        title: "Strategy Selected",
        description:
          "RevRecover selected an alternate payment method.",
        timestamp: "2026-08-22T17:45:00Z",
        status: "completed",
      },
      {
        id: "evt_205",
        type: "customer_contacted",
        title: "Customer Contacted",
        description:
          "The customer was asked to complete payment using an alternate method.",
        timestamp: "2026-08-22T18:00:00Z",
        status: "completed",
      },
      {
        id: "evt_206",
        type: "retry_scheduled",
        title: "Retry Scheduled",
        description:
          "A retry was scheduled using the alternate payment method.",
        timestamp: "2026-08-23T12:00:00Z",
        status: "completed",
      },
      {
        id: "evt_207",
        type: "payment_recovered",
        title: "Payment Recovered",
        description:
          "The retry is currently being processed.",
        timestamp: "",
        status: "current",
      },
    ],
  },

  {
    id: "rec_004",
    paymentId: "pay_126",
    customerId: "cus_004",
    customerName: "Arjun Mehta",
    customerEmail: "arjun@example.com",
    amount: 1200,
    currency: "INR",
    failureReason: "Technical Error",
    strategy: "retry_after_delay",
    status: "recovered",
    recoveryProbability: 81,
    expectedRecovery: 1200,
    createdAt: "2026-08-22T15:12:00Z",
    updatedAt: "2026-08-23T08:40:00Z",
    attemptNumber: 2,

    timeline: [
      {
        id: "evt_301",
        type: "payment_failed",
        title: "Payment Failed",
        description:
          "Payment pay_126 failed due to a temporary technical error.",
        timestamp: "2026-08-22T15:10:00Z",
        status: "completed",
      },
      {
        id: "evt_302",
        type: "analyzed",
        title: "RevRecover Analyzed",
        description:
          "The failure was identified as a recoverable technical issue.",
        timestamp: "2026-08-22T15:11:00Z",
        status: "completed",
      },
      {
        id: "evt_303",
        type: "eligible",
        title: "Recovery Eligible",
        description:
          "The payment was classified as high recovery potential.",
        timestamp: "2026-08-22T15:11:30Z",
        status: "completed",
      },
      {
        id: "evt_304",
        type: "strategy_selected",
        title: "Strategy Selected",
        description:
          "RevRecover selected a delayed retry.",
        timestamp: "2026-08-22T15:12:00Z",
        status: "completed",
      },
      {
        id: "evt_305",
        type: "customer_contacted",
        title: "Customer Contacted",
        description:
          "A recovery communication was sent.",
        timestamp: "2026-08-22T15:20:00Z",
        status: "completed",
      },
      {
        id: "evt_306",
        type: "retry_scheduled",
        title: "Retry Scheduled",
        description:
          "Retry was scheduled after the recommended delay.",
        timestamp: "2026-08-23T08:00:00Z",
        status: "completed",
      },
      {
        id: "evt_307",
        type: "payment_recovered",
        title: "Payment Recovered",
        description:
          "The retry succeeded and ₹1,200 was recovered.",
        timestamp: "2026-08-23T08:40:00Z",
        status: "completed",
      },
    ],
  },
];

export function getRecoveryData(): RecoveryData {
  // const recoveredToday = RECOVERY_CASES.filter(
  //   (recoveryCase) =>
  //     recoveryCase.status === "recovered"
  // ).length;

  // const revenueRecovered = RECOVERY_CASES
  //   .filter(
  //     (recoveryCase) =>
  //       recoveryCase.status === "recovered"
  //   )
  //   .reduce(
  //     (total, recoveryCase) =>
  //       total + recoveryCase.amount,
  //     0
  //   );

  return {
    summary: {
      activeCases: 247,
      recoveredToday: 89,
      revenueRecovered: 318000,
    },

    cases: RECOVERY_CASES,
  };
}

export function getRecoveryCaseById(
  id: string
): RecoveryCase | null {
  return (
    RECOVERY_CASES.find(
      (recoveryCase) => recoveryCase.id === id
    ) ?? null
  );
}
