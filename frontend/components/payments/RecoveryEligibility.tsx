import { Check, HelpCircle, Minus } from "lucide-react";
import { RecoveryEligibility as RecoveryEligibilityType } from "@/types/payment";

interface RecoveryEligibilityProps {
  eligibility: RecoveryEligibilityType;
}

const eligibilityConfig = {
  high: {
    label: "Yes",
    icon: Check,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  medium: {
    label: "Maybe",
    icon: HelpCircle,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  low: {
    label: "No",
    icon: Minus,
    className: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  },
} satisfies Record<
  RecoveryEligibilityType,
  {
    label: string;
    icon: typeof Check;
    className: string;
  }
>;

export function RecoveryEligibility({
  eligibility,
}: RecoveryEligibilityProps) {
  const config = eligibilityConfig[eligibility];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
