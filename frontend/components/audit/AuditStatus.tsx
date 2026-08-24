import {
  CheckCircle2,
  Clock3,
  CircleX,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { AuditResult } from "@/types/audit";

interface AuditStatusProps {
  result: AuditResult;
}

const STATUS_CONFIG: Record<
  AuditResult,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  eligible: {
    label: "Eligible",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  ineligible: {
    label: "Ineligible",
    icon: CircleX,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  retry: {
    label: "Retry",
    icon: Sparkles,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  sent: {
    label: "Sent",
    icon: CheckCircle2,
    className:
      "border-zinc-700 bg-zinc-900 text-zinc-400",
  },

  scheduled: {
    label: "Scheduled",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  success: {
    label: "Success",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  failed: {
    label: "Failed",
    icon: CircleX,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

export function AuditStatus({
  result,
}: AuditStatusProps) {
  const config = STATUS_CONFIG[result];

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
