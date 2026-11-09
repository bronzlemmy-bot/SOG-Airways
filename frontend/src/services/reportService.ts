import { apiService } from "./api";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface ReportSummary {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  revenue?: number;
}

export interface ReportData<T = unknown> {
  summary?: ReportSummary;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export const reportService = {
  async getReports<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    if (filters?.status) {
      params.set("status", filters.status);
    }

    if (filters?.type) {
      params.set("type", filters.type);
    }

    if (filters?.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters?.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports${query ? `?${query}` : ""}`,
    );
  },

  async getBookingReport<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    if (filters?.status) {
      params.set("status", filters.status);
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports/bookings${query ? `?${query}` : ""}`,
    );
  },

  async getFlightReport<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    if (filters?.status) {
      params.set("status", filters.status);
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports/flights${query ? `?${query}` : ""}`,
    );
  },

  async getPassengerReport<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports/passengers${query ? `?${query}` : ""}`,
    );
  },

  async getPaymentReport<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    if (filters?.status) {
      params.set("status", filters.status);
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports/payments${query ? `?${query}` : ""}`,
    );
  },

  async getRevenueReport<T = unknown>(
    filters?: ReportFilters,
  ): Promise<ReportData<T>> {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      params.set("endDate", filters.endDate);
    }

    const query = params.toString();

    return apiService.get<ReportData<T>>(
      `/reports/revenue${query ? `?${query}` : ""}`,
    );
  },
};