"use client";

import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { FailureReasonBadge } from "@/components/payments/FailureReasonBadge";
import { PaymentStatus } from "@/components/payments/PaymentStatus";
import { RecoveryEligibility } from "@/components/payments/RecoveryEligibility";
import { RecoveryDecision } from "@/components/payments/RecoveryDecision";

import { getPaymentById } from "@/services/payment.service";

function formatCurrency(amount: number | string) {
  const numericAmount = Number(amount);

  return `₹${numericAmount.toLocaleString("en-IN")}`;
}

export default function PaymentDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [payment, setPayment] = useState<
    Awaited<ReturnType<typeof getPaymentById>> | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadPayment() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPaymentById(id);

        if (!data) {
          setError("Payment not found.");
          return;
        }

        setPayment(data);
      } catch (err) {
        console.error("Failed to load payment:", err);
        setError("Unable to load payment.");
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Link href="/payments">
                <ArrowLeft className="h-4 w-4" />
                Back to Failed Payments
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Loading payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Link href="/payments">
                <ArrowLeft className="h-4 w-4" />
                Back to Failed Payments
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h1 className="text-lg font-medium text-zinc-100">
              Payment not found
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error ?? "The requested payment could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-[1400px] p-5 md:p-8">
        {/* Back */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 gap-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <Link href="/payments">
              <ArrowLeft className="h-4 w-4" />
              Back to Failed Payments
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs text-zinc-600">
                {payment.id}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Payment Details
                </h1>

                <PaymentStatus status={payment.status} />
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                {payment.status === "succeeded"
                  ? "Review the completed payment and recovery outcome."
                  : "Review the failure context and RevRecover&apos;s recovery decision."}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-zinc-500">
                Payment amount
              </p>

              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>
        </section>

        {/* Main */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* Payment context */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardHeader className="p-5 pb-3">
                <h2 className="text-sm font-medium text-zinc-100">
                  Payment
                </h2>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Status
                    </p>

                    <div className="mt-2">
                      <PaymentStatus status={payment.status} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      {payment.status === "succeeded"
                        ? "Payment outcome"
                        : "Failure reason"}
                    </p>

                    <div className="mt-2">
                      <FailureReasonBadge
                        reason={payment.failureReason}
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      {payment.failureMessage}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Previous attempts
                    </p>

                    <p className="mt-1 text-sm text-zinc-200">
                      {payment.previousAttempts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
                    <UserRound className="h-4 w-4 text-zinc-400" />
                  </div>

                  <h2 className="text-sm font-medium text-zinc-100">
                    Customer
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {payment.customerName}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {payment.customerEmail}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Lifetime Value
                      </p>

                      <p className="mt-1 text-sm font-medium text-zinc-200">
                        {formatCurrency(
                          payment.customerLifetimeValue
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">
                        Successful Payments
                      </p>

                      <p className="mt-1 text-sm font-medium text-zinc-200">
                        {payment.successfulPayments}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Subscription
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {payment.subscriptionActive
                          ? "Active"
                          : "Inactive"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">
                        Previous Retry
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {payment.previousRetrySucceeded
                          ? "Succeeded"
                          : "No success"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardHeader className="p-5 pb-3">
                <h2 className="text-sm font-medium text-zinc-100">
                  Recovery Eligibility
                </h2>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <RecoveryEligibility
                  eligibility={payment.recoveryEligibility}
                />
              </CardContent>
            </Card>
          </div>

          {/* Decision */}
          <div>
            <RecoveryDecision payment={payment} />
          </div>
        </div>
      </div>
    </div>
  );
}
