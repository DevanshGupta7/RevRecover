import {
  AlertTriangle,
  BrainCircuit,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import type {
  CustomerInsight,
} from "@/types/customer";

interface CustomerInsightsProps {
  insights: CustomerInsight[];
}

const ICONS = {
  positive: Sparkles,
  warning: AlertTriangle,
  recommendation: Lightbulb,
};

const COLORS = {
  positive: "text-emerald-400",
  warning: "text-amber-400",
  recommendation: "text-blue-400",
};

export function CustomerInsights({
  insights,
}: CustomerInsightsProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <BrainCircuit className="h-4 w-4 text-zinc-300" />
        </div>

        <div>
          <h2 className="text-sm font-medium text-zinc-100">
            AI Recovery Insights
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Recovery recommendations based on customer
            behavior and payment history.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((insight) => {
          const Icon = ICONS[insight.type];

          return (
            <div
              key={insight.id}
              className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${COLORS[insight.type]}`}
              />

              <div>
                <h3 className="text-xs font-medium text-zinc-200">
                  {insight.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
