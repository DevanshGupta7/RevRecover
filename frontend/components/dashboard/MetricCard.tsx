import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  description,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "border-zinc-800 bg-zinc-950 shadow-none",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
              {value}
            </p>

            {description && (
              <p className="mt-1 text-xs text-zinc-600">
                {description}
              </p>
            )}
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
