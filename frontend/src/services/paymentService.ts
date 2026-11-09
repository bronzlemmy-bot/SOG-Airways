import { apiService } from "./api";

import type {
  Payment,
  PaymentStatus,
} from "@/types";
import type {
  DemoPaymentWorkflowResult,
  ProcessDemoPaymentInput,
} from "@/types";

export interface PaymentFilters {
  status?: PaymentStatus;
  bookingId?: string;
  userId?: string;
  method?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type CreatePaymentData = Omit<
  Payment,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdatePaymentData = Partial<
  CreatePaymentData
>;

function ensureLivePaymentApiEnabled(): never {
  throw new Error(
    "Live payment API access is disabled. Use the frontend demo payment flow.",
  );
}

export const paymentService = {
  async processDemoBookingPayment(
    bookingId: string,
    data: ProcessDemoPaymentInput,
  ): Promise<DemoPaymentWorkflowResult> {
    return apiService.post<DemoPaymentWorkflowResult>(
      `/payments/bookings/${encodeURIComponent(bookingId)}/demo`,
      data,
    );
  },

  async getPayments(): Promise<Payment[]> {
    ensureLivePaymentApiEnabled();
    return apiService.get<Payment[]>("/payments");
  },

  async getPaymentById(
    id: string,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.get<Payment>(
      `/payments/${id}`,
    );
  },

  async getPaymentsByBooking(
    bookingId: string,
  ): Promise<Payment[]> {
    ensureLivePaymentApiEnabled();
    return apiService.get<Payment[]>(
      `/bookings/${bookingId}/payments`,
    );
  },

  async getPaymentsByUser(
    userId: string,
  ): Promise<Payment[]> {
    ensureLivePaymentApiEnabled();
    return apiService.get<Payment[]>(
      `/users/${userId}/payments`,
    );
  },

  async getPaymentsByFilters(
    filters: PaymentFilters,
  ): Promise<Payment[]> {
    ensureLivePaymentApiEnabled();
    const params = new URLSearchParams();
    const {
      status,
      bookingId,
      userId,
      method,
      search,
      page,
      limit,
    } = filters;

    if (status) {
      params.set("status", String(status));
    }

    if (bookingId) {
      params.set("bookingId", String(bookingId));
    }

    if (userId) {
      params.set("userId", String(userId));
    }

    if (method) {
      params.set("method", String(method));
    }

    if (search) {
      params.set("search", String(search));
    }

    if (page !== undefined) {
      params.set("page", String(page));
    }

    if (limit !== undefined) {
      params.set("limit", String(limit));
    }

    const query = params.toString();

    return apiService.get<Payment[]>(
      `/payments${query ? `?${query}` : ""}`,
    );
  },

  async createPayment(
    data: CreatePaymentData,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.post<Payment>(
      "/payments",
      data,
    );
  },

  async updatePayment(
    id: string,
    data: UpdatePaymentData,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.patch<Payment>(
      `/payments/${id}`,
      data,
    );
  },

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.patch<Payment>(
      `/payments/${id}/status`,
      { status },
    );
  },

  async processPayment(
    id: string,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.post<Payment>(
      `/payments/${id}/process`,
    );
  },

  async refundPayment(
    id: string,
  ): Promise<Payment> {
    ensureLivePaymentApiEnabled();
    return apiService.post<Payment>(
      `/payments/${id}/refund`,
    );
  },

  async deletePayment(
    id: string,
  ): Promise<void> {
    ensureLivePaymentApiEnabled();
    await apiService.delete(
      `/payments/${id}`,
    );
  },
};