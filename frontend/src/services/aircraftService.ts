import { apiService } from "./api";

import type {
  Aircraft,
  AircraftStatus,
} from "@/types";

export interface AircraftFilters {
  status?: AircraftStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAircraftData {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  capacity: number;
  status: AircraftStatus;
}

export type UpdateAircraftData =
  Partial<CreateAircraftData>;

export const aircraftService = {
  async getAircraft(): Promise<Aircraft[]> {
    return apiService.get<Aircraft[]>("/aircraft");
  },

  async getAircraftById(
    id: string,
  ): Promise<Aircraft> {
    return apiService.get<Aircraft>(
      `/aircraft/${id}`,
    );
  },

  async getAircraftByFilters(
    filters: AircraftFilters,
  ): Promise<Aircraft[]> {
    const params = new URLSearchParams();

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

    return apiService.get<Aircraft[]>(
      `/aircraft${query ? `?${query}` : ""}`,
    );
  },

  async createAircraft(
    data: CreateAircraftData,
  ): Promise<Aircraft> {
    return apiService.post<Aircraft>(
      "/aircraft",
      data,
    );
  },

  async updateAircraft(
    id: string,
    data: UpdateAircraftData,
  ): Promise<Aircraft> {
    return apiService.patch<Aircraft>(
      `/aircraft/${id}`,
      data,
    );
  },

  async deleteAircraft(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/aircraft/${id}`,
    );
  },
};