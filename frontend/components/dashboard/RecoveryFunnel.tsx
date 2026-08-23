import { ArrowDown } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { RecoveryPipeline } from "@/types/dashboard";

interface RecoveryFunnelProps {
  data: RecoveryPipeline;
}

const stages = [
  {
    key: "failed",
    label: "Failed",
  },
  {
    key: "eligible",
    label: "Eligible",
  },
  {
    key: "contacted",
    label: "Contacted",
  },
  {
    key: "retried",
    label: "Retried",
  },
  {
    key: "recovered",
    label: "Recovered",
  },
] as const;

export function RecoveryFunnel({
  data,
}: RecoveryFunnelProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-none">
      <CardHeader className="p-5 pb-3">
        <h3 className="text-sm font-medium text-zinc-100">
          Recovery Pipeline
        </h3>

        <p className="mt-0.5 text-xs text-zinc-500">
          Payment recovery progression
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="flex flex-col">
          {stages.map((stage, index) => (
            <div key={stage.key}>
              <div className="flex items-center justify-between rounded-md border border-zinc-900 bg-zinc-950 px-3 py-2.5">
                <span className="text-sm text-zinc-400">
                  {stage.label}
                </span>

                <span className="font-mono text-sm font-medium text-zinc-100">
                  {data[stage.key].toLocaleString("en-IN")}
                </span>
              </div>

              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-3.5 w-3.5 text-zinc-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
