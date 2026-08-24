export type AuditActor =
  | "AI Agent"
  | "System"
  | "Merchant";

export type AuditEventType =
  | "payment_analyzed"
  | "recovery_eligible"
  | "strategy_selected"
  | "customer_contacted"
  | "retry_scheduled"
  | "retry_executed"
  | "payment_recovered"
  | "recovery_failed";

export type AuditResult =
  | "eligible"
  | "ineligible"
  | "retry"
  | "sent"
  | "scheduled"
  | "success"
  | "failed";

export interface AuditEvent {
  id: string;

  timestamp: string;

  eventType: AuditEventType;

  eventName: string;

  actor: AuditActor;

  entityType:
    | "payment"
    | "recovery"
    | "customer"
    | "strategy";

  entityId: string;

  result: AuditResult;

  description: string;

  decision?: string;

  reason?: string;

  action?: string;

  confidence?: number;

  metadata?: Record<string, string | number | boolean>;
}

export interface AuditData {
  totalEvents: number;
  aiDecisions: number;
  automatedActions: number;
  successfulActions: number;

  events: AuditEvent[];
}
