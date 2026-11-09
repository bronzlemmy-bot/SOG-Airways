import { apiService } from "./api";

import type {
  BoardingPassStatus,
  CheckInRecord,
  PersistedCheckInStatus,
} from "@/types";

export interface CheckInFilters {
  bookingId?: string;
  passengerId?: string;
  flightId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCheckInData {
  booking: string;
  ticket: string;
  passenger: string;
  flight: string;
  customer: string;
  seatNumber?: string;
  baggageCount?: number;
}

export interface UpdateCheckInData {
  status?: PersistedCheckInStatus;
  boardingPassStatus?: BoardingPassStatus;
  seatNumber?: string;
  baggageCount?: number;
  baggageWeightKg?: number;
  specialAssistanceRequired?: boolean;
  notes?: string | null;
}

export const checkInService = {
  async getCheckIns(): Promise<CheckInRecord[]> {
    return apiService.get<CheckInRecord[]>("/check-in");
  },

  async getMyCheckIns(): Promise<CheckInRecord[]> {
    return apiService.get<CheckInRecord[]>("/check-in/my-check-ins");
  },

  async getCheckInById(
    id: string,
  ): Promise<CheckInRecord> {
    return apiService.get<CheckInRecord>(
      `/check-in/${id}`,
    );
  },

  async getCheckInByBooking(
    bookingId: string,
  ): Promise<CheckInRecord[]> {
    return apiService.get<CheckInRecord[]>(
      `/check-in/booking/${bookingId}`,
    );
  },

  async getCheckInsByFilters(
    filters: CheckInFilters,
  ): Promise<CheckInRecord[]> {
    const params = new URLSearchParams();

    if (filters.bookingId) {
      params.set("booking", filters.bookingId);
    }

    if (filters.passengerId) {
      params.set(
        "passenger",
        filters.passengerId,
      );
    }

    if (filters.flightId) {
      params.set("flight", filters.flightId);
    }

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<CheckInRecord[]>(
      `/check-in${query ? `?${query}` : ""}`,
    );
  },

  async createCheckIn(
    data: CreateCheckInData,
  ): Promise<CheckInRecord> {
    return apiService.post<CheckInRecord>(
      "/check-in",
      data,
    );
  },

  async updateCheckIn(
    id: string,
    data: UpdateCheckInData,
  ): Promise<CheckInRecord> {
    return apiService.patch<CheckInRecord>(
      `/check-in/${id}`,
      data,
    );
  },

  async completeCheckIn(
    id: string,
  ): Promise<CheckInRecord> {
    return apiService.patch<CheckInRecord>(
      `/check-in/${id}`,
      { status: "checked_in" },
    );
  },

  async cancelCheckIn(
    id: string,
    reason: string,
  ): Promise<CheckInRecord> {
    return apiService.patch<CheckInRecord>(
      `/check-in/${id}/cancel`,
      { reason },
    );
  },

  async deleteCheckIn(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/check-in/${id}`,
    );
  },
};