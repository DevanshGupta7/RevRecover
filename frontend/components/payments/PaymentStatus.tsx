import { CircleX } from "lucide-react";
import { FailedPayment } from "@/types/payment";

interface PaymentStatusProps {
  status: FailedPayment["status"];
}

export function PaymentStatus({ status }: PaymentStatusProps) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-red-400">
      <CircleX className="h-4 w-4" />
      <span className="capitalize">{status}</span>
    </div>
  );
}
