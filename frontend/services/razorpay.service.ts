import { api } from "@/lib/api";

export interface RazorpaySyncResult {
  payments_fetched: number;
  payments_created: number;
  payments_updated: number;
  attempts_created: number;
  skipped: number;
  failed: number;
}

export function syncRazorpayPayments(): Promise<RazorpaySyncResult> {
  return api.post<RazorpaySyncResult>("/integrations/razorpay/sync");
}