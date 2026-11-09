
import type {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  RefundStatus,
} from "../models/payment.model.js";

export interface CreatePaymentInput {
  paymentReference?: string;
  booking: string;
  customer: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  provider?: PaymentProvider;
  status?: PaymentStatus;
  providerTransactionId?: string | null;
  idempotencyKey?: string | null;
  description?: string | null;
  failureCode?: string | null;
  failureReason?: string | null;
  paidAt?: Date | null;
  refundedAmount?: number;
  refundStatus?: RefundStatus;
  refundedAt?: Date | null;
  refundReference?: string | null;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

export type DemoPaymentOutcome = "approved" | "declined" | "error";
export type DemoPaymentMethod = "demo-wallet" | "demo-bank-transfer";

export interface CreateDemoPaymentInput {
  booking: string;
  customer: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  outcome: DemoPaymentOutcome;
  method: DemoPaymentMethod;
}

export interface UpdatePaymentInput {
  status?: PaymentStatus;
  providerTransactionId?: string | null;
  description?: string | null;
  failureCode?: string | null;
  failureReason?: string | null;
  paidAt?: Date | null;
  refundedAmount?: number;
  refundStatus?: RefundStatus;
  refundedAt?: Date | null;
  refundReference?: string | null;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

export interface RefundPaymentInput {
  amount?: number;
  reason?: string;
  refundReference?: string;
}

export interface PaymentProfileResponse {
  id: string;
  paymentReference: string;
  booking: string;
  customer: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  status: PaymentStatus;
  providerTransactionId?: string;
  idempotencyKey?: string;
  description?: string;
  failureCode?: string;
  failureReason?: string;
  paidAt?: Date;
  refundedAmount: number;
  refundStatus: RefundStatus;
  refundedAt?: Date;
  refundReference?: string;
  metadata: Record<string, unknown>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentFilters {
  search?: string;
  paymentReference?: string;
  booking?: string;
  customer?: string;
  method?: PaymentMethod;
  provider?: PaymentProvider;
  status?: PaymentStatus;
  refundStatus?: RefundStatus;
  currency?: string;
  createdFrom?: Date;
  createdTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export type PaymentSortField =
  | "paymentReference"
  | "amount"
  | "status"
  | "createdAt"
  | "updatedAt";

export interface PaymentPaginationOptions {
  page: number;
  limit: number;
  sortBy?: PaymentSortField;
  sortOrder?: "asc" | "desc";
}

export interface PaymentPaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPayments {
  items: PaymentProfileResponse[];
  pagination: PaymentPaginationMetadata;
}

export interface PaymentCountResult {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  refunded: number;
  partially_refunded: number;
}

export interface PaymentRevenueResult {
  currency: string;
  totalPayments: number;
  totalAmount: number;
  totalRefunded: number;
  netAmount: number;
}

export interface PaymentRepositoryUpdateData extends UpdatePaymentInput {}
