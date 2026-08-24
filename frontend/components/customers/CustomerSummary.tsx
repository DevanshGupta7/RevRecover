import {
  CircleDollarSign,
  Users,
  UserRoundCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { CustomerSummary as CustomerSummaryData } from "@/types/customer";

interface CustomerSummaryProps {
  data: CustomerSummaryData;
}

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function CustomerSummary({
  data,
}: CustomerSummaryProps) {
  const metrics = [
    {
      label: "Customers",
      value: data.totalCustomers.toLocaleString("en-IN"),
      icon: Users,
    },
    {
      label: "High Value",
      value: data.highValueCustomers.toLocaleString("en-IN"),
      icon: UserRoundCheck,
    },
    {
      label: "Active Recovery",
      value: data.customersWithRecoveryCases.toLocaleString(
        "en-IN"
      ),
      icon: Workflow,
    },
    {
      label: "Total Customer LTV",
      value: formatCurrency(data.totalCustomerLtv),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
