export type AuditActor =
  | "AI Agent"
  | "System"
  | "Merchant"
  | "User";

export type AuditEventType =
  | "payment_failed"
  | "recovery_case_created"
  | "ai_decision_created"
  | "strategy_selected"
  | "recovery_action_planned"
  | "recovery_action_executed"
  | "payment_link_created"
  | "recovery_action_failed"
  | "recovery_case_recovered";

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
