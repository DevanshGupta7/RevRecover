import type {
  Customer,
  CustomerData,
} from "@/types/customer";

const CUSTOMERS: Customer[] = [
  {
    id: "cus_001",

    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",

    lifetimeValue: 42000,

    successfulPayments: 18,
    failedPayments: 3,

    recoveredRevenue: 8500,

    recoverySuccessRate: 66,

    risk: "high",

    preferredStrategy: "Retry after delay",

    averagePaymentAmount: 2333,

    activeRecoveryCases: 1,

    paymentHistory: [
      {
        id: "pay_101",
        amount: 4500,
        status: "failed",
        failureReason: "Insufficient Funds",
        createdAt: "2026-08-23T10:24:00Z",
      },
      {
        id: "pay_098",
        amount: 4500,
        status: "succeeded",
        createdAt: "2026-08-01T10:20:00Z",
      },
      {
        id: "pay_091",
        amount: 4200,
        status: "succeeded",
        createdAt: "2026-07-01T10:20:00Z",
      },
      {
        id: "pay_083",
        amount: 4500,
        status: "failed",
        failureReason: "Insufficient Funds",
        createdAt: "2026-06-01T10:20:00Z",
      },
    ],

    recoveryHistory: [
      {
        id: "rec_001",
        paymentId: "pay_101",
        amount: 4500,
        strategy: "Retry after delay",
        status: "scheduled",
        probability: 87,
        recoveredAmount: 0,
        createdAt: "2026-08-23T10:25:00Z",
      },
      {
        id: "rec_087",
        paymentId: "pay_083",
        amount: 4000,
        strategy: "Retry after delay",
        status: "recovered",
        probability: 79,
        recoveredAmount: 4000,
        createdAt: "2026-06-01T11:00:00Z",
      },
      {
        id: "rec_051",
        paymentId: "pay_062",
        amount: 4500,
        strategy: "Retry after delay",
        status: "recovered",
        probability: 74,
        recoveredAmount: 4500,
        createdAt: "2026-05-01T12:00:00Z",
      },
    ],

    insights: [
      {
        id: "insight_001",
        title: "High-value customer",
        description:
          "This customer has generated ₹42,000 in lifetime revenue and has a strong history of successful payments.",
        type: "positive",
      },
      {
        id: "insight_002",
        title: "Previous retries succeeded",
        description:
          "Previous insufficient-funds failures were successfully recovered using delayed retries.",
        type: "positive",
      },
      {
        id: "insight_003",
        title: "Retry after delay recommended",
        description:
          "The customer's historical recovery behavior suggests waiting before retrying is the highest-potential action.",
        type: "recommendation",
      },
    ],

    createdAt: "2025-08-12T10:00:00Z",
    updatedAt: "2026-08-23T10:30:00Z",
  },

  {
    id: "cus_002",

    name: "Aman Gupta",
    email: "aman@example.com",
    phone: "+91 91234 56789",

    lifetimeValue: 18000,

    successfulPayments: 9,
    failedPayments: 1,

    recoveredRevenue: 2100,

    recoverySuccessRate: 100,

    risk: "medium",

    preferredStrategy: "Update payment method",

    averagePaymentAmount: 2000,

    activeRecoveryCases: 1,

    paymentHistory: [
      {
        id: "pay_124",
        amount: 2100,
        status: "failed",
        failureReason: "Expired Card",
        createdAt: "2026-08-23T09:18:00Z",
      },
      {
        id: "pay_119",
        amount: 2000,
        status: "succeeded",
        createdAt: "2026-07-23T09:18:00Z",
      },
      {
        id: "pay_112",
        amount: 2000,
        status: "succeeded",
        createdAt: "2026-06-23T09:18:00Z",
      },
    ],

    recoveryHistory: [
      {
        id: "rec_002",
        paymentId: "pay_124",
        amount: 2100,
        strategy: "Update payment method",
        status: "contacted",
        probability: 76,
        recoveredAmount: 0,
        createdAt: "2026-08-23T09:20:00Z",
      },
    ],

    insights: [
      {
        id: "insight_004",
        title: "Strong payment history",
        description:
          "9 successful payments indicate a reliable payment relationship.",
        type: "positive",
      },
      {
        id: "insight_005",
        title: "Payment method issue",
        description:
          "The current failure is related to an expired card rather than customer payment behavior.",
        type: "warning",
      },
      {
        id: "insight_006",
        title: "Update payment method",
        description:
          "Requesting a new payment method is more appropriate than repeatedly retrying the expired card.",
        type: "recommendation",
      },
    ],

    createdAt: "2025-11-05T10:00:00Z",
    updatedAt: "2026-08-23T09:30:00Z",
  },

  {
    id: "cus_003",

    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 99887 66554",

    lifetimeValue: 67000,

    successfulPayments: 27,
    failedPayments: 4,

    recoveredRevenue: 12400,

    recoverySuccessRate: 75,

    risk: "high",

    preferredStrategy: "Alternate payment method",

    averagePaymentAmount: 2481,

    activeRecoveryCases: 1,

    paymentHistory: [
      {
        id: "pay_125",
        amount: 8900,
        status: "failed",
        failureReason: "Bank Decline",
        createdAt: "2026-08-22T17:42:00Z",
      },
      {
        id: "pay_116",
        amount: 8500,
        status: "succeeded",
        createdAt: "2026-07-22T17:42:00Z",
      },
      {
        id: "pay_107",
        amount: 8500,
        status: "succeeded",
        createdAt: "2026-06-22T17:42:00Z",
      },
    ],

    recoveryHistory: [
      {
        id: "rec_003",
        paymentId: "pay_125",
        amount: 8900,
        strategy: "Alternate payment method",
        status: "retrying",
        probability: 64,
        recoveredAmount: 0,
        createdAt: "2026-08-22T17:45:00Z",
      },
      {
        id: "rec_074",
        paymentId: "pay_072",
        amount: 6200,
        strategy: "Alternate payment method",
        status: "recovered",
        probability: 72,
        recoveredAmount: 6200,
        createdAt: "2026-05-12T11:30:00Z",
      },
      {
        id: "rec_065",
        paymentId: "pay_061",
        amount: 6200,
        strategy: "Alternate payment method",
        status: "recovered",
        probability: 69,
        recoveredAmount: 6200,
        createdAt: "2026-04-12T11:30:00Z",
      },
    ],

    insights: [
      {
        id: "insight_007",
        title: "Very high lifetime value",
        description:
          "This customer has generated ₹67,000 and represents a high-value relationship.",
        type: "positive",
      },
      {
        id: "insight_008",
        title: "Bank declines are recoverable",
        description:
          "Previous bank-decline cases have been successfully recovered using alternate payment methods.",
        type: "positive",
      },
      {
        id: "insight_009",
        title: "Protect customer relationship",
        description:
          "Because of the customer's high lifetime value, recovery attempts should prioritize low-friction alternatives.",
        type: "recommendation",
      },
    ],

    createdAt: "2025-03-17T10:00:00Z",
    updatedAt: "2026-08-22T18:00:00Z",
  },

  {
    id: "cus_004",

    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 90123 45678",

    lifetimeValue: 15000,

    successfulPayments: 11,
    failedPayments: 2,

    recoveredRevenue: 1200,

    recoverySuccessRate: 50,

    risk: "low",

    preferredStrategy: "Retry after delay",

    averagePaymentAmount: 1364,

    activeRecoveryCases: 0,

    paymentHistory: [
      {
        id: "pay_126",
        amount: 1200,
        status: "failed",
        failureReason: "Technical Error",
        createdAt: "2026-08-22T15:10:00Z",
      },
      {
        id: "pay_118",
        amount: 1200,
        status: "succeeded",
        createdAt: "2026-07-22T15:10:00Z",
      },
      {
        id: "pay_110",
        amount: 1300,
        status: "succeeded",
        createdAt: "2026-06-22T15:10:00Z",
      },
    ],

    recoveryHistory: [
      {
        id: "rec_004",
        paymentId: "pay_126",
        amount: 1200,
        strategy: "Retry after delay",
        status: "recovered",
        probability: 81,
        recoveredAmount: 1200,
        createdAt: "2026-08-22T15:12:00Z",
      },
    ],

    insights: [
      {
        id: "insight_010",
        title: "Low payment risk",
        description:
          "The customer has a consistent history of successful payments.",
        type: "positive",
      },
      {
        id: "insight_011",
        title: "Technical failure recovered",
        description:
          "The recent technical payment failure was successfully recovered after a delayed retry.",
        type: "positive",
      },
      {
        id: "insight_012",
        title: "Continue automated retries",
        description:
          "Future temporary technical failures can continue using the automated delayed-retry strategy.",
        type: "recommendation",
      },
    ],

    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-08-23T08:45:00Z",
  },
];

export function getCustomerData(): CustomerData {
  return {
    summary: {
      totalCustomers: 12480,
      highValueCustomers: 842,
      customersWithRecoveryCases: 247,
      totalCustomerLtv: 184000000,
    },

    customers: CUSTOMERS,
  };
}

export function getCustomerById(
  id: string
): Customer | null {
  return (
    CUSTOMERS.find(
      (customer) => customer.id === id
    ) ?? null
  );
}
