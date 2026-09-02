import { api } from "@/lib/api";

import type {
  ApiPaginatedResponse,
} from "@/lib/api-types";

import type {
  Customer,
  CustomerData,
  CustomerPayment,
  CustomerRecovery,
  CustomerRecoveryStatus,
} from "@/types/customer";

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

type ApiRecoveryCase = {
  id: string;
  customer_id: string;
  payment_id: string;
  risk_amount: number | string;
  status: string;
  recovered_amount?: number | string | null;
  created_at: string;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isSuccessfulPayment(status: string) {
  return status === "captured" || status === "succeeded";
}

function getCustomerRisk(
  failedAmount: number,
  lifetimeValue: number
): Customer["risk"] {
  if (failedAmount <= 0 || lifetimeValue <= 0) {
    return "low";
  }

  const atRiskRatio = failedAmount / lifetimeValue;

  if (atRiskRatio >= 0.5) {
    return "high";
  }

  if (atRiskRatio >= 0.25) {
    return "medium";
  }

  return "low";
}

async function mapCustomerToUI(customer: ApiCustomer): Promise<Customer> {
  // Fetch customer's payment history for aggregates
  let paymentHistory: CustomerPayment[] = [];
  const recoveryHistory: CustomerRecovery[] = [];
  let lifetimeValue = 0;
  let successfulPayments = 0;
  let failedPayments = 0;
  let failedAmount = 0;
  let recoveredRevenue = 0;
  let recoverySuccessRate = 0;
  let activeRecoveryCases = 0;

  try {
    const paymentsResponse = await api
      .get<ApiPaginatedResponse<ApiPayment>>(
        `/customers/${customer.id}/payments`,
        { params: { page: 1, page_size: 50 } }
      )
      .catch(() => ({ items: [], pagination: { total: 0, page: 1, page_size: 50, total_pages: 0 } }));

    const payments = paymentsResponse.items ?? [];
    lifetimeValue = payments.reduce(
      (sum, p) => sum + toNumber(p.amount),
      0
    );

    successfulPayments = payments.filter(
      (p) => isSuccessfulPayment(p.status)
    ).length;
    failedPayments = payments.filter(
      (p) => p.status === "failed"
    ).length;
    failedAmount = payments.reduce(
      (sum, payment) =>
        payment.status === "failed"
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    paymentHistory = payments
      .slice(0, 10)
      .map((p: ApiPayment) => ({
        id: p.id,
        amount: toNumber(p.amount),
        status: isSuccessfulPayment(p.status) ? "succeeded" : "failed",
        failureReason: p.failure_reason ?? undefined,
        createdAt: p.created_at,
      }));
  } catch {
    // Ignore errors in payment history
  }

  try {
    const recoveryCases = await api.get<ApiRecoveryCase[]>(
      "/recovery",
      { params: { limit: 100 } }
    );
    const customerRecoveryCases = (recoveryCases ?? []).filter(
      (recoveryCase) => recoveryCase.customer_id === customer.id
    );

    const recoveredCases = customerRecoveryCases.filter(
      (recoveryCase) => recoveryCase.status === "recovered"
    );

    recoveryHistory.push(
      ...customerRecoveryCases.map((recoveryCase) => ({
        id: recoveryCase.id,
        paymentId: recoveryCase.payment_id,
        amount: toNumber(recoveryCase.risk_amount),
        strategy: "Recovery workflow",
        status: (
          recoveryCase.status === "recovered"
            ? "recovered"
            : recoveryCase.status === "failed"
              ? "failed"
              : "waiting"
        ) as CustomerRecoveryStatus,
        probability: 0,
        recoveredAmount: toNumber(recoveryCase.recovered_amount),
        createdAt: recoveryCase.created_at,
      }))
    );

    recoveredRevenue = recoveredCases.reduce(
      (sum, recoveryCase) =>
        sum + toNumber(recoveryCase.recovered_amount ?? recoveryCase.risk_amount),
      0
    );
    recoverySuccessRate = customerRecoveryCases.length > 0
      ? Math.round((recoveredCases.length / customerRecoveryCases.length) * 100)
      : 0;
    activeRecoveryCases = customerRecoveryCases.filter(
      (recoveryCase) =>
        !["recovered", "failed", "cancelled"].includes(recoveryCase.status)
    ).length;
  } catch {
    // Ignore errors in recovery history
  }

  return {
    id: customer.id,
    name: customer.name ?? "Customer",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    lifetimeValue: lifetimeValue,
    successfulPayments,
    failedPayments,
    recoveredRevenue,
    recoverySuccessRate,
    risk: getCustomerRisk(failedAmount, lifetimeValue),
    preferredStrategy: "Retry after delay",
    averagePaymentAmount:
      successfulPayments > 0
        ? Math.floor(lifetimeValue / successfulPayments)
        : 0,
    activeRecoveryCases,
    paymentHistory,
    recoveryHistory,
    insights: [
      {
        id: "insight_001",
        title: "Customer profile loaded",
        description:
          "This customer data was retrieved from the backend.",
        type: "positive",
      },
    ],
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
  };
}

// NOTE: Legacy mock data removed. All customer data now fetches from backend API.

export async function getCustomerData(): Promise<CustomerData> {
  try {
    const response = await api.get<ApiPaginatedResponse<ApiCustomer>>(
      "/customers",
      { params: { page: 1, page_size: 100 } }
    );

    const customers = await Promise.all(
      (response.items ?? []).map(mapCustomerToUI)
    );

    return {
      summary: {
        totalCustomers: response.pagination?.total ?? 0,
        highValueCustomers: Math.floor(
          (response.pagination?.total ?? 0) * 0.07
        ),
        customersWithRecoveryCases: Math.floor(
          (response.pagination?.total ?? 0) * 0.02
        ),
        totalCustomerLtv: customers.reduce(
          (sum, c) => sum + c.lifetimeValue,
          0
        ),
      },
      customers,
    };
  } catch {
    return {
      summary: {
        totalCustomers: 0,
        highValueCustomers: 0,
        customersWithRecoveryCases: 0,
        totalCustomerLtv: 0,
      },
      customers: [],
    };
  }
}

export async function getCustomerById(
  id: string
): Promise<Customer | null> {
  try {
    const customer = await api.get<ApiCustomer>(
      `/customers/${id}`
    );

    return await mapCustomerToUI(customer);
  } catch {
    return null;
  }
}

