import { apiService } from "./api";

import type {
  Airport,
  AirportStatus,
} from "@/types";
import type { CheckoutAirport } from "@/types";

export interface AirportFilters {
  status?: AirportStatus;
  country?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAirportData {
  code: string;
  name: string;
  city: string;
  country: string;
  terminal?: string;
  status: AirportStatus;
}

export type UpdateAirportData =
  Partial<CreateAirportData>;

export const airportService = {
  async getCheckoutAirports(): Promise<CheckoutAirport[]> {
    return apiService.get<CheckoutAirport[]>("/airports?limit=100");
  },

  async getAirports(): Promise<Airport[]> {
    return apiService.get<Airport[]>("/airports");
  },

  async getAirportById(
    id: string,
  ): Promise<Airport> {
    return apiService.get<Airport>(
      `/airports/${id}`,
    );
  },

  async getAirportByCode(
    code: string,
  ): Promise<Airport> {
    return apiService.get<Airport>(
      `/airports/code/${encodeURIComponent(code)}`,
    );
  },

  async getAirportByFilters(
    filters: AirportFilters,
  ): Promise<Airport[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.country) {
      params.set("country", filters.country);
    }

    if (filters.city) {
      params.set("city", filters.city);
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

    return apiService.get<Airport[]>(
      `/airports${query ? `?${query}` : ""}`,
    );
  },

  async createAirport(
    data: CreateAirportData,
  ): Promise<Airport> {
    return apiService.post<Airport>(
      "/airports",
      data,
    );
  },

  async updateAirport(
    id: string,
    data: UpdateAirportData,
  ): Promise<Airport> {
    return apiService.patch<Airport>(
      `/airports/${id}`,
      data,
    );
  },

  async deleteAirport(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/airports/${id}`,
    );
  },
};