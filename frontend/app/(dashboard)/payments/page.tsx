import { PaymentTable } from "@/components/payments/PaymentTable";
import { getFailedPayments } from "@/services/payment.service";

export default async function PaymentsPage() {
  const payments = await getFailedPayments();

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">
          Revenue Recovery
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
          Failed Payments
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Understand why payments failed and identify which ones are worth
          recovering.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Failed Payments
          </p>

          <p className="mt-2 text-2xl font-semibold text-zinc-100">
            {payments.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recoverable
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {
              payments.filter(
                (payment) => payment.recoveryEligibility === "high",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Needs Review
          </p>

          <p className="mt-2 text-2xl font-semibold text-amber-400">
            {
              payments.filter(
                (payment) => payment.recoveryEligibility === "medium",
              ).length
            }
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">
            Payment failures
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Failed transactions prioritized by recovery potential.
          </p>
        </div>

        <PaymentTable payments={payments} />
      </section>
    </div>
  );
}
