import { apiService } from "./api";

import type {
  Passenger,
  PassengerStatus,
} from "@/types";

export interface PassengerFilters {
  status?: PassengerStatus;
  bookingId?: string;
  flightId?: string;
  search?: string;
  nationality?: string;
  page?: number;
  limit?: number;
}

export type CreatePassengerData = Omit<
  Passenger,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdatePassengerData = Partial<
  CreatePassengerData
>;

export const passengerService = {
  async getPassengers(): Promise<Passenger[]> {
    return apiService.get<Passenger[]>(
      "/passengers",
    );
  },

  async getPassengerById(
    id: string,
  ): Promise<Passenger> {
    return apiService.get<Passenger>(
      `/passengers/${id}`,
    );
  },

  async getPassengersByBooking(
    bookingId: string,
  ): Promise<Passenger[]> {
    return apiService.get<Passenger[]>(
      `/bookings/${bookingId}/passengers`,
    );
  },

  async getPassengersByFlight(
    flightId: string,
  ): Promise<Passenger[]> {
    return apiService.get<Passenger[]>(
      `/flights/${flightId}/passengers`,
    );
  },

  async getPassengersByFilters(
    filters: PassengerFilters,
  ): Promise<Passenger[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.bookingId) {
      params.set(
        "bookingId",
        filters.bookingId,
      );
    }

    if (filters.flightId) {
      params.set(
        "flightId",
        filters.flightId,
      );
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.nationality) {
      params.set(
        "nationality",
        filters.nationality,
      );
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<Passenger[]>(
      `/passengers${query ? `?${query}` : ""}`,
    );
  },

  async createPassenger(
    data: CreatePassengerData,
  ): Promise<Passenger> {
    return apiService.post<Passenger>(
      "/passengers",
      data,
    );
  },

  async updatePassenger(
    id: string,
    data: UpdatePassengerData,
  ): Promise<Passenger> {
    return apiService.patch<Passenger>(
      `/passengers/${id}`,
      data,
    );
  },

  async updatePassengerStatus(
    id: string,
    status: PassengerStatus,
  ): Promise<Passenger> {
    return apiService.patch<Passenger>(
      `/passengers/${id}/status`,
      { status },
    );
  },

  async deletePassenger(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/passengers/${id}`,
    );
  },
};