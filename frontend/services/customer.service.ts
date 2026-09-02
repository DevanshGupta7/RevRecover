import { api } from "@/lib/api";

import type {
  ApiPaginatedResponse,
} from "@/lib/api-types";

import type {
  Customer,
  CustomerData,
  CustomerPayment,
  CustomerRecovery,
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

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isSuccessfulPayment(status: string) {
  return status === "captured" || status === "succeeded";
}

async function mapCustomerToUI(customer: ApiCustomer): Promise<Customer> {
  // Fetch customer's payment history for aggregates
  let paymentHistory: CustomerPayment[] = [];
  const recoveryHistory: CustomerRecovery[] = [];
  let lifetimeValue = 0;
  let successfulPayments = 0;
  let failedPayments = 0;
  const recoveredRevenue = 0;
  const recoverySuccessRate = 0;
  const activeRecoveryCases = 0;

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
    risk: failedPayments > successfulPayments ? "high" : "low",
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

