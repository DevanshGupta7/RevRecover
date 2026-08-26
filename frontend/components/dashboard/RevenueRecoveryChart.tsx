"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueRecoveryPoint } from "@/types/dashboard";

interface RevenueRecoveryChartProps {
  data: RevenueRecoveryPoint[];
}

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
}

export function RevenueRecoveryChart({
  data,
}: RevenueRecoveryChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 12,
            right: 12,
            left: 0,
            bottom: 4,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#71717a",
              fontSize: 11,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            width={52}
            tick={{
              fill: "#71717a",
              fontSize: 11,
            }}
            tickFormatter={formatCurrency}
          />

          <RechartsTooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            labelStyle={{
              color: "#a1a1aa",
            }}
            formatter={(value) => [
              formatCurrency(Number(value)),
            ]}
          />

          <Line
            type="stepAfter"
            dataKey="atRisk"
            name="At Risk"
            stroke="#a1a1aa"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
            }}
          />

          <Line
            type="stepAfter"
            dataKey="recovered"
            name="Recovered"
            stroke="#fafafa"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
