import { Beaker, CirclePause, CircleCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { StrategyStatus } from "@/types/strategy";

interface StrategyStatusProps {
  status: StrategyStatus;
}

const STATUS_CONFIG: Record<
  StrategyStatus,
  {
    label: string;
    icon: typeof CircleCheck;
    className: string;
  }
> = {
  active: {
    label: "Active",
    icon: CircleCheck,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  paused: {
    label: "Paused",
    icon: CirclePause,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  experimental: {
    label: "Experimental",
    icon: Beaker,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },
};

export function StrategyStatus({
  status,
}: StrategyStatusProps) {
  const config = STATUS_CONFIG[status];

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
