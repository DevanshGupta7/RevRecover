import { api } from "@/lib/api";
import type { AnalyticsData } from "@/types/analytics";

export function getAnalyticsData(): Promise<AnalyticsData> {
  return api.get<AnalyticsData>("/analytics/overview");
}
