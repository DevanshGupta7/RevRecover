import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CircleDollarSign,
  CreditCard,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { CustomerRisk } from "@/components/customers/CustomerRisk";
import { CustomerInsights } from "@/components/customers/CustomerInsights";
import { PaymentHistory } from "@/components/customers/PaymentHistory";
import { RecoveryHistory } from "@/components/customers/RecoveryHistory";

import { getCustomerById } from "@/services/customer.service";

interface CustomerDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default async function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  const { id } = await params;

  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="min-h-full min-w-0 max-w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1500px] min-w-0 overflow-x-hidden p-5 md:p-8">
        {/* Back */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />

              Back to Customers
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <UserRound className="h-5 w-5 text-zinc-400" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    {customer.name}
                  </h1>

                  <CustomerRisk risk={customer.risk} />
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  {customer.email}
                </p>

                <p className="mt-1 text-xs text-zinc-700">
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 lg:min-w-[220px]">
              <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                Preferred strategy
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {customer.preferredStrategy}
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-zinc-600">
                <CircleDollarSign className="h-4 w-4" />

                <span className="text-xs">
                  Lifetime Value
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {formatCurrency(
                  customer.lifetimeValue
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-zinc-600">
                <CreditCard className="h-4 w-4" />

                <span className="text-xs">
                  Successful Payments
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {customer.successfulPayments}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-zinc-600">
                <RotateCcw className="h-4 w-4" />

                <span className="text-xs">
                  Recovered Revenue
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-emerald-400">
                {formatCurrency(
                  customer.recoveredRevenue
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-zinc-600">
                <BrainCircuit className="h-4 w-4" />

                <span className="text-xs">
                  Recovery Success
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {customer.recoverySuccessRate}%
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Intelligence */}
        <section className="mb-8">
          <CustomerInsights
            insights={customer.insights}
          />
        </section>

        {/* History */}
        <div className="grid min-w-0 max-w-full gap-8">
          {/* Payment History */}
          <section className="min-w-0">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-zinc-200">
                Payment History
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Successful and failed payment activity for this customer.
              </p>
            </div>

            <PaymentHistory
              payments={customer.paymentHistory}
            />
          </section>

          {/* Recovery History */}
          <section className="min-w-0">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-zinc-200">
                Recovery History
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Previous recovery decisions and their outcomes.
              </p>
            </div>

            <RecoveryHistory
              recoveries={customer.recoveryHistory}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
