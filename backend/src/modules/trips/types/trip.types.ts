
import type { TripStatus, TripType } from "../models/trip.model.js";

export interface CreateTripInput {
  customer: string;
  booking?: string | null;
  tripReference?: string;
  title?: string | null;
  tripType: TripType;
  status?: TripStatus;
  originAirport: string;
  destinationAirport: string;
  departureDate: Date;
  returnDate?: Date | null;
  passengerCount?: number;
  currency?: string;
  estimatedBudget?: number | null;
  actualCost?: number | null;
  notes?: string | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
}

export interface UpdateTripInput {
  booking?: string | null;
  title?: string | null;
  tripType?: TripType;
  status?: TripStatus;
  originAirport?: string;
  destinationAirport?: string;
  departureDate?: Date;
  returnDate?: Date | null;
  passengerCount?: number;
  currency?: string;
  estimatedBudget?: number | null;
  actualCost?: number | null;
  notes?: string | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
}

export interface TripFilters {
  customer?: string;
  booking?: string;
  tripReference?: string;
  tripType?: TripType;
  status?: TripStatus;
  originAirport?: string;
  destinationAirport?: string;
  departureFrom?: Date;
  departureTo?: Date;
  returnFrom?: Date;
  returnTo?: Date;
  search?: string;
  minBudget?: number;
  maxBudget?: number;
}

export type TripSortField =
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

export interface TripPaginationOptions {
  page: number;
  limit: number;
  sortBy?: TripSortField;
  sortOrder?: "asc" | "desc";
}

export interface TripPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTrips<T> {
  items: T[];
  pagination: TripPaginationMetadata;
}

export interface TripCountResult {
  total: number;
  byStatus: Partial<Record<TripStatus, number>>;
  byType: Partial<Record<TripType, number>>;
}

export type TripRepositoryUpdateData = Partial<UpdateTripInput>;
