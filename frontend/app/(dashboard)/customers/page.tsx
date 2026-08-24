import {
  BrainCircuit,
  Users,
} from "lucide-react";

import { CustomerSummary } from "@/components/customers/CustomerSummary";
import { CustomerTable } from "@/components/customers/CustomerTable";

import { getCustomerData } from "@/services/customer.service";

export default function CustomersPage() {
  const customerData = getCustomerData();

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1600px] p-5 md:p-8">
        {/* Header */}
        <section className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <Users className="h-4 w-4 text-zinc-300" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Customers
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Understand customer value, payment behavior,
                and recovery potential.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-8">
          <CustomerSummary data={customerData.summary} />
        </section>

        {/* Intelligence banner */}
        <section className="mb-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
                <BrainCircuit className="h-4 w-4 text-zinc-400" />
              </div>

              <div>
                <h2 className="text-sm font-medium text-zinc-100">
                  Customer recovery intelligence
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-500">
                  RevRecover uses customer payment history,
                  lifetime value, previous recovery outcomes,
                  and failure patterns to determine how future
                  failed payments should be handled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-medium text-zinc-200">
              Customer Recovery Profiles
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Customers ranked by recovery intelligence and
              payment history.
            </p>
          </div>

          <CustomerTable
            customers={customerData.customers}
          />
        </section>
      </div>
    </div>
  );
}
