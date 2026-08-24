import type { RecoveryCaseStatus } from "@/types/recovery";

export type CustomerRisk =
  | "low"
  | "medium"
  | "high";

export type CustomerPaymentStatus =
  | "succeeded"
  | "failed"
  | "pending";

export type CustomerRecoveryStatus = RecoveryCaseStatus;

export interface CustomerPayment {
  id: string;
  amount: number;
  status: CustomerPaymentStatus;
  failureReason?: string;
  createdAt: string;
}

export interface CustomerRecovery {
  id: string;
  paymentId: string;
  amount: number;
  strategy: string;
  status: CustomerRecoveryStatus;
  probability: number;
  recoveredAmount: number;
  createdAt: string;
}

export interface CustomerInsight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "warning" | "recommendation";
}

export interface Customer {
  id: string;

  name: string;
  email: string;
  phone: string;

  lifetimeValue: number;

  successfulPayments: number;
  failedPayments: number;

  recoveredRevenue: number;

  recoverySuccessRate: number;

  risk: CustomerRisk;

  preferredStrategy: string;

  averagePaymentAmount: number;

  activeRecoveryCases: number;

  paymentHistory: CustomerPayment[];

  recoveryHistory: CustomerRecovery[];

  insights: CustomerInsight[];

  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  totalCustomers: number;
  highValueCustomers: number;
  customersWithRecoveryCases: number;
  totalCustomerLtv: number;
}

export interface CustomerData {
  summary: CustomerSummary;
  customers: Customer[];
}
