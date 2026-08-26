import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { RecoveryInsight } from "@/types/dashboard";

interface RecoveryInsightsProps {
  insights: RecoveryInsight[];
}

const iconMap = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export function RecoveryInsights({
  insights,
}: RecoveryInsightsProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
            <Sparkles className="h-4 w-4 text-zinc-300" />
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-100">
              Recovery Intelligence
            </h3>

            <p className="mt-0.5 text-xs text-zinc-500">
              Signals identified from current recovery activity
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid gap-3 md:grid-cols-3">
          {insights.map((insight) => {
            const Icon = iconMap[insight.type];

            return (
              <div
                key={insight.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />

                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">
                      {insight.title}
                    </h4>

                    <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
