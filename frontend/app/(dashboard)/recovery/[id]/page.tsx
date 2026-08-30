import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { RecoveryStatus } from "@/components/recovery/RecoveryStatus";
import { RecoveryTimeline } from "@/components/recovery/RecoveryTimeline";
import { RecoveryStrategy } from "@/components/recovery/RecoveryStrategy";

import { getRecoveryCaseById } from "@/services/recovery.service";

interface RecoveryDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default async function RecoveryDetailsPage({
  params,
}: RecoveryDetailsPageProps) {
  const { id } = await params;

  const recoveryCase = await getRecoveryCaseById(id);

  if (!recoveryCase) {
    notFound();
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
            <Link href="/recovery">
              <ArrowLeft className="h-4 w-4" />

              Back to Recovery Cases
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs text-zinc-600">
                {recoveryCase.id}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Recovery Case
                </h1>

                <RecoveryStatus
                  status={recoveryCase.status}
                />
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                RevRecover recovery workflow for{" "}
                <span className="text-zinc-300">
                  {recoveryCase.customerName}
                </span>
                .
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xs text-zinc-500">
                Recovery amount
              </p>

              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {formatCurrency(recoveryCase.amount)}
              </p>

              <p className="mt-1 font-mono text-xs text-zinc-600">
                {recoveryCase.paymentId}
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Customer
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {recoveryCase.customerName}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Strategy
              </p>

              <div className="mt-2">
                <RecoveryStrategy
                  strategy={recoveryCase.strategy}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Expected Recovery
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-200">
                {formatCurrency(
                  recoveryCase.expectedRecovery
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500">
                Recovery Probability
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-400">
                {recoveryCase.recoveryProbability}%
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Timeline */}
          <Card className="border-zinc-800 bg-zinc-950 shadow-none">
            <CardContent className="p-5 md:p-6">
              <div className="mb-7 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <BrainCircuit className="h-4 w-4 text-zinc-300" />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-zinc-100">
                    Recovery Timeline
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Every step taken by the recovery workflow.
                  </p>
                </div>
              </div>

              <RecoveryTimeline
                events={recoveryCase.timeline}
              />
            </CardContent>
          </Card>

          {/* Context */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardContent className="p-5">
                <h2 className="text-sm font-medium text-zinc-100">
                  Recovery Context
                </h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Customer
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {recoveryCase.customerName}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {recoveryCase.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Failure reason
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {recoveryCase.failureReason}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Attempt number
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {recoveryCase.attemptNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Expected recovery
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {formatCurrency(
                        recoveryCase.expectedRecovery
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 shadow-none">
              <CardContent className="p-5">
                <h2 className="text-sm font-medium text-zinc-100">
                  Recovery Strategy
                </h2>

                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                  <RecoveryStrategy
                    strategy={recoveryCase.strategy}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-600">
                  The strategy was selected based on the payment
                  failure reason, customer history, and estimated
                  recovery potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
