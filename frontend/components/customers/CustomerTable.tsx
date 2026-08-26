import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CustomerRisk } from "@/components/customers/CustomerRisk";

import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
}

function formatCurrency(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Customer
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                LTV
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Successful
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Failed
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Recovered
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Recovery
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Risk
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs text-zinc-500">
                Preferred Strategy
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="border-zinc-800 transition-colors hover:bg-zinc-900/60"
              >
                <TableCell>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="group block"
                  >
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                      {customer.name}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-600">
                      {customer.email}
                    </p>
                  </Link>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-zinc-100">
                    {formatCurrency(
                      customer.lifetimeValue
                    )}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-zinc-400">
                    {customer.successfulPayments}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-zinc-400">
                    {customer.failedPayments}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-emerald-400">
                    {formatCurrency(
                      customer.recoveredRevenue
                    )}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-medium text-zinc-200">
                    {customer.recoverySuccessRate}%
                  </span>
                </TableCell>

                <TableCell>
                  <CustomerRisk risk={customer.risk} />
                </TableCell>

                <TableCell>
                  <span className="text-xs text-zinc-500">
                    {customer.preferredStrategy}
                  </span>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/customers/${customer.id}`}
                    aria-label={`View ${customer.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {customers.length === 0 && (
        <div className="flex min-h-40 items-center justify-center border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            No customers found.
          </p>
        </div>
      )}
    </div>
  );
}
