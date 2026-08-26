"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  FailureReasonData,
} from "@/types/analytics";

interface FailureReasonChartProps {
  data: FailureReasonData[];
}

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${(value / 1000).toFixed(0)}K`;
}

export function FailureReasonChart({
  data,
}: FailureReasonChartProps) {
  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 8,
            left: 8,
            bottom: 5,
          }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="rgba(255,255,255,0.06)"
          />

          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#71717a",
            }}
            tickFormatter={formatCurrency}
          />

          <YAxis
            type="category"
            dataKey="reason"
            axisLine={false}
            tickLine={false}
            width={105}
            tick={{
              fontSize: 10,
              fill: "#a1a1aa",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [
              `₹${Number(value).toLocaleString(
                "en-IN"
              )}`,
              "Revenue at Risk",
            ]}
          />

          <Bar
            dataKey="amount"
            radius={[0, 4, 4, 0]}
            fill="#71717a"
            barSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
