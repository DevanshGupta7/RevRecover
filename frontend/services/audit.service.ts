import { api } from "@/lib/api";
import type { AuditData, AuditEvent } from "@/types/audit";

interface AuditResponse {
  items: AuditEvent[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export async function getAuditData(): Promise<AuditData> {
  const response = await api.get<AuditResponse>("/audit-logs", {
    params: { page: 1, page_size: 50 },
  });
  const events = response.items;

  return {
    totalEvents: response.pagination.total,
    aiDecisions: events.filter((event) => event.actor === "AI Agent").length,
    automatedActions: events.filter((event) => event.actor === "System").length,
    successfulActions: events.filter((event) => event.result === "success").length,
    events,
  };
}

export function getAuditEventById(id: string): Promise<AuditEvent> {
  return api.get<AuditEvent>(`/audit-logs/${id}`);
}
