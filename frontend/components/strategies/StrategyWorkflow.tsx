import { ArrowDown, Check } from "lucide-react";

import type {
  StrategyWorkflowStep,
} from "@/types/strategy";

interface StrategyWorkflowProps {
  steps: StrategyWorkflowStep[];
}

export function StrategyWorkflow({
  steps,
}: StrategyWorkflowProps) {
  return (
    <div>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id}>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              </div>

              <div className="pb-5">
                <h3 className="text-sm font-medium text-zinc-200">
                  {step.title}
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
                  {step.description}
                </p>
              </div>
            </div>

            {!isLast && (
              <div className="ml-[15px] flex h-5 items-center border-l border-zinc-800">
                <ArrowDown className="ml-[-6px] h-3 w-3 text-zinc-700" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
