import {
  CircleCheck,
  CircleX,
  HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RecoveryEligibility as Eligibility } from "@/types/payment";

interface RecoveryEligibilityProps {
  eligibility: Eligibility;
}

const CONFIG = {
  high: {
    label: "High",
    icon: CircleCheck,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  medium: {
    label: "Medium",
    icon: HelpCircle,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  low: {
    label: "Low",
    icon: HelpCircle,
    className:
      "border-zinc-700 bg-zinc-900 text-zinc-400",
  },

  not_eligible: {
    label: "Not Eligible",
    icon: CircleX,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
} satisfies Record<
  Eligibility,
  {
    label: string;
    icon: typeof CircleCheck;
    className: string;
  }
>;

export function RecoveryEligibility({
  eligibility,
}: RecoveryEligibilityProps) {
  const config = CONFIG[eligibility];

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 ${config.className}`}
    >
      <Icon className="h-3 w-3" />

      {config.label}
    </Badge>
  );
}
