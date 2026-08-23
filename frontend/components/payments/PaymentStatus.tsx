import { CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/payment";

interface PaymentStatusProps {
  status: PaymentStatus;
}

export function PaymentStatus({
  status,
}: PaymentStatusProps) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-red-500/20 bg-red-500/10 text-red-400"
    >
      <CircleX className="h-3 w-3" />

      {status === "failed" ? "Failed" : status}
    </Badge>
  );
}
