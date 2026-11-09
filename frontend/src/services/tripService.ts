import { apiService } from "./api";

import type {
  Trip,
  TripStatus,
  TripType,
} from "@/types";

export interface TripFilters {
  status?: TripStatus;
  customer?: string;
  booking?: string;
  tripReference?: string;
  tripType?: TripType;
  originAirport?: string;
  destinationAirport?: string;
  departureFrom?: string;
  departureTo?: string;
  returnFrom?: string;
  returnTo?: string;
  search?: string;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  limit?: number;
  sortBy?:
    | "tripReference"
    | "departureDate"
    | "returnDate"
    | "status"
    | "tripType"
    | "passengerCount"
    | "estimatedBudget"
    | "actualCost"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export type CreateTripData = Omit<
  Trip,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateTripData = Partial<
  CreateTripData
>;

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    return apiService.get<Trip[]>("/trips");
  },

  async getTripById(
    id: string,
  ): Promise<Trip> {
    return apiService.get<Trip>(
      `/trips/${id}`,
    );
  },

  async getTripsByUser(): Promise<Trip[]> {
    return apiService.get<Trip[]>(
      "/trips/my-trips",
    );
  },

  async getTripByBooking(
    bookingId: string,
  ): Promise<Trip | null> {
    return apiService.get<Trip | null>(
      `/trips/my-trips/booking/${encodeURIComponent(bookingId)}`,
    );
  },

  async getTripsByFilters(
    filters: TripFilters,
  ): Promise<Trip[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.customer) {
      params.set("customer", filters.customer);
    }

    if (filters.booking) {
      params.set("booking", filters.booking);
    }

    if (filters.tripReference) {
      params.set("tripReference", filters.tripReference);
    }

    if (filters.tripType) {
      params.set("tripType", filters.tripType);
    }

    if (filters.originAirport) {
      params.set("originAirport", filters.originAirport);
    }

    if (filters.destinationAirport) {
      params.set("destinationAirport", filters.destinationAirport);
    }

    if (filters.departureFrom) {
      params.set("departureFrom", filters.departureFrom);
    }

    if (filters.departureTo) {
      params.set("departureTo", filters.departureTo);
    }

    if (filters.returnFrom) {
      params.set("returnFrom", filters.returnFrom);
    }

    if (filters.returnTo) {
      params.set("returnTo", filters.returnTo);
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.minBudget !== undefined) {
      params.set("minBudget", String(filters.minBudget));
    }

    if (filters.maxBudget !== undefined) {
      params.set("maxBudget", String(filters.maxBudget));
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
    }

    if (filters.sortOrder) {
      params.set("sortOrder", filters.sortOrder);
    }

    const query = params.toString();

    return apiService.get<Trip[]>(
      `/trips${query ? `?${query}` : ""}`,
    );
  },

  async createTrip(
    data: CreateTripData,
  ): Promise<Trip> {
    return apiService.post<Trip>(
      "/trips",
      data,
    );
  },

  async updateTrip(
    id: string,
    data: UpdateTripData,
  ): Promise<Trip> {
    return apiService.patch<Trip>(
      `/trips/${id}`,
      data,
    );
  },

  async updateTripStatus(
    id: string,
    status: TripStatus,
  ): Promise<Trip> {
    return apiService.patch<Trip>(
      `/trips/${id}`,
      { status },
    );
  },

  async cancelTrip(
    id: string,
    reason = "Cancelled through the SOG Airways application.",
  ): Promise<Trip> {
    return apiService.patch<Trip>(
      `/trips/${id}/cancel`,
      { reason },
    );
  },

  async deleteTrip(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/trips/${id}`,
    );
  },
};