"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  RevenueRecoveryPoint,
} from "@/types/analytics";

interface RevenueRecoveryChartProps {
  data: RevenueRecoveryPoint[];
}

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${(value / 1000).toFixed(0)}K`;
}

function formatTooltipCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function RevenueRecoveryChart({
  data,
}: RevenueRecoveryChartProps) {
  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 8,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="atRiskGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopOpacity={0.18}
              />

              <stop
                offset="100%"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient
              id="recoveredGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopOpacity={0.18}
              />

              <stop
                offset="100%"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.06)"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#71717a",
            }}
            tickMargin={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#71717a",
            }}
            tickFormatter={formatCurrency}
            width={48}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{
              color: "#a1a1aa",
              marginBottom: "4px",
            }}
            formatter={(value, name) => [
              formatTooltipCurrency(Number(value)),
              name === "atRisk"
                ? "At Risk"
                : "Recovered",
            ]}
          />

          <Area
            type="monotone"
            dataKey="atRisk"
            stroke="#71717a"
            strokeWidth={2}
            fill="url(#atRiskGradient)"
          />

          <Area
            type="monotone"
            dataKey="recovered"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#recoveredGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
