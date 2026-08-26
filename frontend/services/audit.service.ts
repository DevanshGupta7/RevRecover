import type {
  AuditData,
  AuditEvent,
} from "@/types/audit";

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "audit_001",

    timestamp: "2026-08-24T10:42:00Z",

    eventType: "payment_analyzed",

    eventName: "Payment analyzed",

    actor: "AI Agent",

    entityType: "payment",

    entityId: "pay_101",

    result: "eligible",

    description:
      "RevRecover analyzed a failed payment and evaluated its recovery potential.",

    decision:
      "Recovery eligible",

    reason:
      "Customer has 18 successful payments, high lifetime value, and previous retry attempts have succeeded.",

    action:
      "Create a recovery case and evaluate the retry-after-delay strategy.",

    confidence: 87,

    metadata: {
      paymentAmount: 4500,
      failureReason: "Insufficient Funds",
      customerLtv: 42000,
    },
  },

  {
    id: "audit_002",

    timestamp: "2026-08-24T10:43:00Z",

    eventType: "strategy_selected",

    eventName: "Strategy selected",

    actor: "AI Agent",

    entityType: "recovery",

    entityId: "rec_001",

    result: "retry",

    description:
      "RevRecover selected the most appropriate recovery strategy for the failed payment.",

    decision:
      "Use retry after delay",

    reason:
      "Insufficient-funds failures for this customer have previously recovered successfully after waiting.",

    action:
      "Wait 24 hours before retrying the payment.",

    confidence: 87,

    metadata: {
      strategy: "Retry after delay",
      delayHours: 24,
      expectedRecovery: 4500,
    },
  },

  {
    id: "audit_003",

    timestamp: "2026-08-24T10:44:00Z",

    eventType: "customer_contacted",

    eventName: "Customer contacted",

    actor: "System",

    entityType: "customer",

    entityId: "cus_001",

    result: "sent",

    description:
      "The recovery workflow contacted the customer using the selected communication channel.",

    action:
      "Send payment recovery notification.",

    metadata: {
      channel: "email",
      recoveryId: "rec_001",
    },
  },

  {
    id: "audit_004",

    timestamp: "2026-08-24T11:12:00Z",

    eventType: "retry_executed",

    eventName: "Payment retry executed",

    actor: "System",

    entityType: "payment",

    entityId: "pay_101",

    result: "success",

    description:
      "The scheduled payment retry was executed after the configured delay.",

    action:
      "Retry payment for ₹4,500.",

    metadata: {
      attemptNumber: 1,
      amount: 4500,
      strategy: "Retry after delay",
    },
  },

  {
    id: "audit_005",

    timestamp: "2026-08-24T11:13:00Z",

    eventType: "payment_recovered",

    eventName: "Revenue recovered",

    actor: "System",

    entityType: "recovery",

    entityId: "rec_001",

    result: "success",

    description:
      "The payment retry succeeded and the recovery case was marked as recovered.",

    decision:
      "Recovery successful",

    action:
      "Close recovery case and record recovered revenue.",

    metadata: {
      recoveredAmount: 4500,
      paymentId: "pay_101",
      attempts: 1,
    },
  },

  {
    id: "audit_006",

    timestamp: "2026-08-24T12:18:00Z",

    eventType: "payment_analyzed",

    eventName: "Payment analyzed",

    actor: "AI Agent",

    entityType: "payment",

    entityId: "pay_124",

    result: "eligible",

    description:
      "RevRecover analyzed a payment failure caused by an expired card.",

    decision:
      "Recovery eligible",

    reason:
      "Customer has a strong payment history but the current payment method has expired.",

    action:
      "Request an updated payment method instead of retrying the expired card.",

    confidence: 91,

    metadata: {
      paymentAmount: 2100,
      failureReason: "Expired Card",
      customerLtv: 18000,
    },
  },

  {
    id: "audit_007",

    timestamp: "2026-08-24T12:19:00Z",

    eventType: "strategy_selected",

    eventName: "Strategy selected",

    actor: "AI Agent",

    entityType: "recovery",

    entityId: "rec_002",

    result: "retry",

    description:
      "RevRecover selected a payment-method-update strategy for an expired card.",

    decision:
      "Request payment method update",

    reason:
      "Retrying an expired card is unlikely to succeed. Updating the payment method provides a higher recovery probability.",

    action:
      "Send payment-method update request to the customer.",

    confidence: 91,

    metadata: {
      strategy: "Update payment method",
      expectedRecovery: 2100,
    },
  },

  {
    id: "audit_008",

    timestamp: "2026-08-24T12:20:00Z",

    eventType: "customer_contacted",

    eventName: "Customer contacted",

    actor: "System",

    entityType: "customer",

    entityId: "cus_002",

    result: "sent",

    description:
      "The customer received a request to update their payment method.",

    action:
      "Send payment-method update notification.",

    metadata: {
      channel: "email",
      recoveryId: "rec_002",
    },
  },

  {
    id: "audit_009",

    timestamp: "2026-08-24T13:02:00Z",

    eventType: "retry_executed",

    eventName: "Payment retry executed",

    actor: "System",

    entityType: "payment",

    entityId: "pay_125",

    result: "failed",

    description:
      "The recovery retry was executed but the payment was declined again.",

    action:
      "Record failed recovery attempt and evaluate next strategy.",

    metadata: {
      attemptNumber: 2,
      amount: 8900,
      failureReason: "Bank Decline",
    },
  },

  {
    id: "audit_010",

    timestamp: "2026-08-24T13:04:00Z",

    eventType: "recovery_failed",

    eventName: "Recovery attempt failed",

    actor: "System",

    entityType: "recovery",

    entityId: "rec_003",

    result: "failed",

    description:
      "The recovery attempt did not recover the payment.",

    decision:
      "Continue recovery workflow",

    reason:
      "The first retry failed, but the payment remains within the configured recovery window.",

    action:
      "Evaluate alternate payment method strategy.",

    confidence: 64,

    metadata: {
      amount: 8900,
      attempts: 2,
    },
  },
];

export function getAuditData(): AuditData {
  return {
    totalEvents: 12480,
    aiDecisions: 4210,
    automatedActions: 7820,
    successfulActions: 3180,

    events: AUDIT_EVENTS,
  };
}

export function getAuditEventById(
  id: string
): AuditEvent | null {
  return (
    AUDIT_EVENTS.find(
      (event) => event.id === id
    ) ?? null
  );
}
