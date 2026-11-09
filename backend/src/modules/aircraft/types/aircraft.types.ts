
import type {
  AircraftStatus,
  AircraftType,
} from "../models/aircraft.model.js";

export interface AircraftCapacity {
  economy: number;
  premiumEconomy: number;
  business: number;
  first: number;
  total: number;
}

export interface CreateAircraftInput {
  registrationNumber: string;
  manufacturer: string;
  model: string;
  aircraftType: AircraftType;
  serialNumber?: string;
  manufactureYear: number;
  capacity: AircraftCapacity;
  rangeKilometers: number;
  status?: AircraftStatus;
  notes?: string;
}

export interface UpdateAircraftInput {
  registrationNumber?: string;
  manufacturer?: string;
  model?: string;
  aircraftType?: AircraftType;
  serialNumber?: string | null;
  manufactureYear?: number;
  capacity?: AircraftCapacity;
  rangeKilometers?: number;
  status?: AircraftStatus;
  notes?: string | null;
}

export interface AircraftProfileResponse {
  id: string;
  registrationNumber: string;
  manufacturer: string;
  model: string;
  aircraftType: AircraftType;
  serialNumber?: string;
  manufactureYear: number;
  capacity: AircraftCapacity;
  rangeKilometers: number;
  status: AircraftStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AircraftFilters {
  search?: string;
  manufacturer?: string;
  aircraftType?: AircraftType;
  status?: AircraftStatus;
  manufactureYear?: number;
  minRangeKilometers?: number;
  maxRangeKilometers?: number;
}

export interface AircraftPaginationOptions {
  page: number;
  limit: number;
  sortBy?: "registrationNumber" | "manufacturer" | "model" | "manufactureYear" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedAircraft {
  items: AircraftProfileResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AircraftCountResult {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
  retired: number;
}
