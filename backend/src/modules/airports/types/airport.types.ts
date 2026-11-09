
import type {
  AirportCoordinates,
  AirportStatus,
} from "../models/airport.model.js";

export interface CreateAirportInput {
  airportCode: string;
  icaoCode: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates: AirportCoordinates;
  status?: AirportStatus;
}

export interface UpdateAirportInput {
  airportCode?: string;
  icaoCode?: string;
  name?: string;
  city?: string;
  state?: string | null;
  country?: string;
  countryCode?: string;
  timezone?: string;
  coordinates?: AirportCoordinates;
  status?: AirportStatus;
}

export interface AirportProfileResponse {
  id: string;
  airportCode: string;
  icaoCode: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates: AirportCoordinates;
  status: AirportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AirportFilters {
  airportCode?: string;
  icaoCode?: string;
  name?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  status?: AirportStatus;
}

export interface AirportPaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedAirports {
  items: AirportProfileResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
