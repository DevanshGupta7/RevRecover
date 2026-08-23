import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FailureReason } from "@/types/dashboard";

interface FailureReasonsProps {
  data: FailureReason[];
}

export function FailureReasons({
  data,
}: FailureReasonsProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-none">
      <CardHeader className="flex flex-row items-center gap-3 p-5 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
          <AlertCircle className="h-4 w-4 text-zinc-400" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-100">
            Why payments are failing
          </h3>

          <p className="mt-0.5 text-xs text-zinc-500">
            Distribution of failed payment reasons
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.reason}
              className="space-y-2"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-300">
                  {item.reason}
                </span>

                <span className="text-sm font-medium text-zinc-100">
                  {item.percentage}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-zinc-400 transition-all"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
