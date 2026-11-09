import { apiService } from "./api";

import type {
  Flight,
  FlightStatus,
} from "@/types";
import type { CheckoutFlight } from "@/types";

export interface FlightFilters {
  status?: FlightStatus;
  aircraft?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureFrom?: string;
  departureTo?: string;
  arrivalFrom?: string;
  arrivalTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateFlightData = Omit<
  Flight,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateFlightData = Partial<
  CreateFlightData
>;

export const flightService = {
  async getCheckoutFlights(): Promise<CheckoutFlight[]> {
    return apiService.get<CheckoutFlight[]>("/flights?limit=100");
  },

  async getCheckoutFlightById(id: string): Promise<CheckoutFlight> {
    return apiService.get<CheckoutFlight>(
      `/flights/${encodeURIComponent(id)}`,
    );
  },

  async getFlights(): Promise<Flight[]> {
    return apiService.get<Flight[]>("/flights");
  },

  async getFlightById(
    id: string,
  ): Promise<Flight> {
    return apiService.get<Flight>(
      `/flights/${id}`,
    );
  },

  async getFlightByNumber(
    flightNumber: string,
  ): Promise<Flight> {
    return apiService.get<Flight>(
      `/flights/number/${encodeURIComponent(
        flightNumber,
      )}`,
    );
  },

  async getFlightsByFilters(
    filters: FlightFilters,
  ): Promise<Flight[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.aircraft) {
      params.set("aircraft", filters.aircraft);
    }

    if (filters.departureAirport) {
      params.set(
        "departureAirport",
        filters.departureAirport,
      );
    }

    if (filters.arrivalAirport) {
      params.set(
        "arrivalAirport",
        filters.arrivalAirport,
      );
    }

    if (filters.departureFrom) {
      params.set("departureFrom", filters.departureFrom);
    }

    if (filters.departureTo) {
      params.set("departureTo", filters.departureTo);
    }

    if (filters.arrivalFrom) {
      params.set("arrivalFrom", filters.arrivalFrom);
    }

    if (filters.arrivalTo) {
      params.set("arrivalTo", filters.arrivalTo);
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

    return apiService.get<Flight[]>(
      `/flights${query ? `?${query}` : ""}`,
    );
  },

  async createFlight(
    data: CreateFlightData,
  ): Promise<Flight> {
    return apiService.post<Flight>(
      "/flights",
      data,
    );
  },

  async updateFlight(
    id: string,
    data: UpdateFlightData,
  ): Promise<Flight> {
    return apiService.patch<Flight>(
      `/flights/${id}`,
      data,
    );
  },

  async updateFlightStatus(
    id: string,
    status: FlightStatus,
  ): Promise<Flight> {
    return apiService.patch<Flight>(
      `/flights/${id}`,
      { status },
    );
  },

  async deleteFlight(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/flights/${id}`,
    );
  },
};