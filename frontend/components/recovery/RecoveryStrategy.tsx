import { ArrowRight } from "lucide-react";

import type { RecoveryCase } from "@/types/recovery";

interface RecoveryStrategyProps {
  strategy: RecoveryCase["strategy"];
}

const STRATEGY_LABELS: Record<
  RecoveryCase["strategy"],
  string
> = {
  retry_after_delay: "Retry after delay",

  update_payment_method:
    "Update payment method",

  alternate_payment_method:
    "Alternate payment method",

  contact_customer:
    "Contact customer",

  manual_review:
    "Manual review",
};

export function RecoveryStrategy({
  strategy,
}: RecoveryStrategyProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />

      <span className="text-sm text-zinc-300">
        {STRATEGY_LABELS[strategy]}
      </span>
    </div>
  );
}
