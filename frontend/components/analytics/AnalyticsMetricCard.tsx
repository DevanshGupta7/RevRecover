import type { LucideIcon } from "lucide-react";

interface AnalyticsMetricCardProps {
  label: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  valueClassName?: string;
}

export function AnalyticsMetricCard({
  label,
  value,
  description,
  icon: Icon,
  valueClassName = "text-zinc-100",
}: AnalyticsMetricCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">
            {label}
          </p>

          <p
            className={`mt-2 truncate text-2xl font-semibold tracking-tight ${valueClassName}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-1 text-[11px] text-zinc-700">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
          <Icon className="h-4 w-4 text-zinc-500" />
        </div>
      </div>
    </div>
  );
}
