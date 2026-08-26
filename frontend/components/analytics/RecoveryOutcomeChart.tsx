"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  RecoveryOutcomeData,
} from "@/types/analytics";

interface RecoveryOutcomeChartProps {
  data: RecoveryOutcomeData[];
}

const OUTCOME_COLORS = [
  "#34d399",
  "#71717a",
  "#f59e0b",
  "#3f3f46",
];

export function RecoveryOutcomeChart({
  data,
}: RecoveryOutcomeChartProps) {
  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="outcome"
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="78%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.outcome}
                fill={
                  OUTCOME_COLORS[
                    index %
                      OUTCOME_COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value, name) => [
              Number(value).toLocaleString(
                "en-IN"
              ),
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
