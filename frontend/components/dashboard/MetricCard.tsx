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
        "border-[rgba(148,163,184,0.16)] bg-[var(--card)] shadow-none transition-colors hover:border-[rgba(112,200,240,0.4)]",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="metric-label text-xs font-medium uppercase tracking-[0.12em] text-[#8ca098]">
              {label}
            </p>

            <p className="mt-2 text-[1.75rem] font-bold tracking-tight text-zinc-100">
              {value}
            </p>

            {description && (
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {description}
              </p>
            )}
          </div>

          <div className="metric-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#3b6478] bg-[#173044]">
            <Icon className="h-4 w-4 text-[var(--primary)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
