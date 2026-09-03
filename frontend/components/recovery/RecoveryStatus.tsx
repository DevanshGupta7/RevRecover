import {
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RecoveryCaseStatus } from "@/types/recovery";

interface RecoveryStatusProps {
  status: RecoveryCaseStatus;
}

const STATUS_CONFIG: Record<
  RecoveryCaseStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  waiting: {
    label: "Waiting",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  awaiting_approval: {
    label: "Approval Required",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },

  scheduled: {
    label: "Scheduled",
    icon: Clock3,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  contacted: {
    label: "Contacted",
    icon: Mail,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  retrying: {
    label: "Retrying",
    icon: Loader2,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  recovered: {
    label: "Recovered",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  failed: {
    label: "Failed",
    icon: XCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "border-zinc-700 bg-zinc-900 text-zinc-500",
  },
};

export function RecoveryStatus({
  status,
}: RecoveryStatusProps) {
  const config = STATUS_CONFIG[status];

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 ${config.className}`}
    >
      <Icon
        className={`h-3 w-3 ${
          status === "retrying"
            ? "animate-spin"
            : ""
        }`}
      />

      {config.label}
    </Badge>
  );
}
