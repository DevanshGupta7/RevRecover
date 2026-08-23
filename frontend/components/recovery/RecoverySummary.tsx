import {
  Activity,
  CircleDollarSign,
  RotateCcw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { RecoverySummary as RecoverySummaryData } from "@/types/recovery";

interface RecoverySummaryProps {
  data: RecoverySummaryData;
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function RecoverySummary({
  data,
}: RecoverySummaryProps) {
  const metrics = [
    {
      label: "Active Cases",
      value: data.activeCases.toLocaleString("en-IN"),
      icon: Activity,
    },

    {
      label: "Recovered Today",
      value: data.recoveredToday.toLocaleString("en-IN"),
      icon: RotateCcw,
    },

    {
      label: "Revenue Recovered",
      value: formatCurrency(data.revenueRecovered),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card
            key={metric.label}
            className="border-zinc-800 bg-zinc-950 shadow-none"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500">
                    {metric.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
                    {metric.value}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
                  <Icon className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
