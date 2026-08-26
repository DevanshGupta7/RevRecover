import type {
  RecoveryFunnelData,
} from "@/types/analytics";

interface RecoveryFunnelProps {
  data: RecoveryFunnelData[];
}

export function RecoveryFunnel({
  data,
}: RecoveryFunnelProps) {
  return (
    <div className="space-y-4">
      {data.map((stage, index) => {
        const previous =
          index > 0
            ? data[index - 1].count
            : stage.count;

        const conversionRate =
          previous > 0
            ? Math.round(
                (stage.count / previous) * 100
              )
            : 100;

        return (
          <div key={stage.stage}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">
                {stage.stage}
              </span>

              <div className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-[10px] text-zinc-700">
                    {conversionRate}% from previous
                  </span>
                )}

                <span className="text-xs font-medium text-zinc-200">
                  {stage.count.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-zinc-500"
                style={{
                  width: `${stage.percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
