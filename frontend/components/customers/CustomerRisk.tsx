import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { CustomerRisk as CustomerRiskType } from "@/types/customer";

interface CustomerRiskProps {
  risk: CustomerRiskType;
}

const RISK_CONFIG: Record<
  CustomerRiskType,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  low: {
    label: "Low",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  medium: {
    label: "Medium",
    icon: CircleAlert,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  high: {
    label: "High",
    icon: AlertTriangle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

export function CustomerRisk({
  risk,
}: CustomerRiskProps) {
  const config = RISK_CONFIG[risk];

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
