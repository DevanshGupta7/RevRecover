import {
  AlertTriangle,
  Ban,
  CircleDollarSign,
  CreditCard,
  ServerCrash,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { FailureReason } from "@/types/payment";

interface FailureReasonBadgeProps {
  reason: FailureReason;
}

const FAILURE_REASON_CONFIG: Record<
  FailureReason,
  {
    label: string;
    icon: typeof AlertTriangle;
  }
> = {
  insufficient_funds: {
    label: "Insufficient Funds",
    icon: CircleDollarSign,
  },

  expired_card: {
    label: "Expired Card",
    icon: CreditCard,
  },

  bank_decline: {
    label: "Bank Decline",
    icon: Ban,
  },

  technical_error: {
    label: "Technical Error",
    icon: ServerCrash,
  },

  other: {
    label: "Other",
    icon: AlertTriangle,
  },
};

export function FailureReasonBadge({
  reason,
}: FailureReasonBadgeProps) {
  const config = FAILURE_REASON_CONFIG[reason];

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-zinc-800 bg-zinc-900 text-zinc-400"
    >
      <Icon className="h-3 w-3" />

      {config.label}
    </Badge>
  );
}
