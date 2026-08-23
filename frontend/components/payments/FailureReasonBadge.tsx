import { AlertTriangle, CreditCard, Landmark, ServerCrash, Wallet } from "lucide-react";
import { FailureReason } from "@/types/payment";

interface FailureReasonBadgeProps {
  reason: FailureReason;
}

const reasonConfig: Record<
  FailureReason,
  {
    icon: typeof AlertTriangle;
    className: string;
  }
> = {
  "Insufficient Funds": {
    icon: Wallet,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  "Expired Card": {
    icon: CreditCard,
    className: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  "Bank Decline": {
    icon: Landmark,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  "Technical Error": {
    icon: ServerCrash,
    className: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  Other: {
    icon: AlertTriangle,
    className: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  },
};

export function FailureReasonBadge({
  reason,
}: FailureReasonBadgeProps) {
  const config = reasonConfig[reason];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {reason}
    </span>
  );
}
