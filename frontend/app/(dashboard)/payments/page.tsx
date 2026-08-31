"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PaymentTable } from "@/components/payments/PaymentTable";

import { getFailedPayments } from "@/services/payment.service";

import type {
  FailureReason,
  RecoveryEligibility,
} from "@/types/payment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Awaited<ReturnType<typeof getFailedPayments>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);

      try {
        const data = await getFailedPayments();

        if (active) {
          setPayments(data);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [failureReason, setFailureReason] =
    useState<FailureReason | "all">("all");

  const [eligibility, setEligibility] =
    useState<RecoveryEligibility | "all">("all");

  const filteredPayments = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        payment.id.toLowerCase().includes(normalizedSearch) ||
        payment.customerName
          .toLowerCase()
          .includes(normalizedSearch) ||
        payment.customerEmail
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFailureReason =
        failureReason === "all" ||
        payment.failureReason === failureReason;

      const matchesEligibility =
        eligibility === "all" ||
        payment.recoveryEligibility === eligibility;

      return (
        matchesSearch &&
        matchesFailureReason &&
        matchesEligibility
      );
    });
  }, [payments, search, failureReason, eligibility]);

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1600px] p-5 md:p-8">
        {/* Header */}
        <section className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <AlertTriangle className="h-4 w-4 text-zinc-400" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Failed Payments
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Understand why payments failed and determine
                whether they can be recovered.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Failed Payments
              </p>

              <p className="mt-1 text-xl font-semibold text-zinc-100">
                {payments.length.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Revenue at Risk
              </p>

              <p className="mt-1 text-xl font-semibold text-zinc-100">
                ₹
                {payments
                  .reduce(
                    (total, payment) =>
                      total + payment.amount,
                    0
                  )
                  .toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                High Recovery Potential
              </p>

              <p className="mt-1 text-xl font-semibold text-emerald-400">
                {
                  payments.filter(
                    (payment) =>
                      payment.recoveryEligibility ===
                      "high"
                  ).length
                }
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <section className="mb-4">
          <PaymentFilters
            search={search}
            onSearchChange={setSearch}
            failureReason={failureReason}
            onFailureReasonChange={setFailureReason}
            eligibility={eligibility}
            onEligibilityChange={setEligibility}
          />
        </section>

        {/* Result count */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Showing{" "}
            <span className="text-zinc-300">
              {filteredPayments.length}
            </span>{" "}
            of{" "}
            <span className="text-zinc-300">
              {payments.length}
            </span>{" "}
            failed payments
          </p>

          {isLoading && (
            <span className="text-xs text-zinc-500">
              Loading…
            </span>
          )}
        </div>

        {/* Table */}
        <PaymentTable payments={filteredPayments} />
      </div>
    </div>
  );
}
