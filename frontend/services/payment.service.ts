import { api } from "@/lib/api";

import type {
  ApiPaginatedResponse,
} from "@/lib/api-types";

import type {
  FailedPayment,
  FailureReason,
  RecoveryEligibility,
  RecoveryStrategy,
} from "@/types/payment";

type ApiCustomer = {
  id: string;
  organisation_id: string;
  external_customer_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type ApiPayment = {
  id: string;
  organisation_id: string;
  customer_id: string;
  amount: number | string;
  currency: string;
  status: string;
  provider: string;
  provider_payment_id?: string | null;
  failure_reason?: string | null;
  failure_code?: string | null;
  created_at: string;
  updated_at: string;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapFailureReason(
  value?: string | null
): FailureReason {
  const normalized = (value ?? "")
    .toLowerCase()
    .replace(/[-_\s]+/g, "_");

  switch (normalized) {
    case "insufficient_funds":
      return "insufficient_funds";
    case "expired_card":
    case "card_expired":
      return "expired_card";
    case "bank_decline":
    case "bank_declined":
      return "bank_decline";
    case "technical_error":
    case "processing_error":
      return "technical_error";
    default:
      return "other";
  }
}

function mapRecoveryEligibility(
  status: string
): RecoveryEligibility {
  if (status === "failed") return "high";
  if (status === "pending") return "medium";
  return "not_eligible";
}

function mapRecoveryStrategy(
  failureReason: FailureReason
): RecoveryStrategy {
  switch (failureReason) {
    case "insufficient_funds":
      return "retry_after_delay";
    case "expired_card":
      return "update_payment_method";
    case "bank_decline":
      return "alternate_payment_method";
    case "technical_error":
      return "retry_after_delay";
    default:
      return "manual_review";
  }
}

function mapPaymentToFailedPayment(
  payment: ApiPayment,
  customer?: ApiCustomer | null,
  previousAttempts = 1
): FailedPayment {
  const amount = toNumber(payment.amount);
  const failureReason = mapFailureReason(
    payment.failure_code ?? payment.failure_reason
  );

  return {
    id: payment.id,
    customerId: payment.customer_id,
    customerName: customer?.name ?? "Unknown Customer",
    customerEmail: customer?.email ?? "",
    amount,
    currency: "INR",
    status: "failed",
    failureReason,
    failureMessage:
      payment.failure_reason ??
      "The payment failed during processing.",
    failedAt:
      payment.updated_at ?? payment.created_at,
    previousAttempts,
    recoveryEligibility: mapRecoveryEligibility(
      payment.status
    ),
    recommendedStrategy: mapRecoveryStrategy(
      failureReason
    ),
    expectedRecovery: amount,
    confidence: 84,
    customerLifetimeValue: 0,
    successfulPayments: 0,
    previousRetrySucceeded: false,
    subscriptionActive: true,
  };
}

export async function getFailedPayments(): Promise<FailedPayment[]> {
  try {
    const response = await api.get<
      ApiPaginatedResponse<ApiPayment>
    >("/payments", {
      params: {
        status: "failed",
        page: 1,
        page_size: 100,
      },
    });

    const customers = await Promise.all(
      (response.items ?? []).map(async (payment) => {
        try {
          return await api.get<ApiCustomer>(
            `/customers/${payment.customer_id}`
          );
        } catch {
          return null;
        }
      })
    );

    const customerMap = new Map<string, ApiCustomer>();

    customers.forEach((customer) => {
      if (customer) {
        customerMap.set(customer.id, customer);
      }
    });

    return (response.items ?? []).map((payment) =>
      mapPaymentToFailedPayment(
        payment,
        customerMap.get(payment.customer_id),
        1
      )
    );
  } catch {
    return [];
  }
}

export async function getPaymentById(
  id: string
): Promise<FailedPayment | null> {
  try {
    const payment = await api.get<ApiPayment>(`/payments/${id}`);

    const [customer, attempts] = await Promise.all([
      api
        .get<ApiCustomer>(`/customers/${payment.customer_id}`)
        .catch(() => null),
      api
        .get<Array<{ id: string; attempt_number: number }>>(
          `/payments/${id}/attempts`
        )
        .catch(() => []),
    ]);

    return mapPaymentToFailedPayment(
      payment,
      customer,
      Array.isArray(attempts) ? attempts.length : 1
    );
  } catch {
    return null;
  }
}
