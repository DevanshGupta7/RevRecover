import { CheckCircle2, CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/payment";

interface PaymentStatusProps {
  status: PaymentStatus;
}

export function PaymentStatus({
  status,
}: PaymentStatusProps) {
  const succeeded = status === "succeeded";

  return (
    <Badge
      variant="outline"
      className={
        succeeded
          ? "gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "gap-1.5 border-red-500/20 bg-red-500/10 text-red-400"
      }
    >
      {succeeded ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <CircleX className="h-3 w-3" />
      )}

      {succeeded ? "Succeeded" : "Failed"}
    </Badge>
  );
}
