
import type {
  FlightFareSchedule,
  FlightStatus,
} from "../models/flight.model.js";

export interface CreateFlightInput {
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  estimatedDeparture?: Date | null;
  estimatedArrival?: Date | null;
  actualDeparture?: Date | null;
  actualArrival?: Date | null;
  status?: FlightStatus;
  departureTerminal?: string;
  departureGate?: string;
  arrivalTerminal?: string;
  arrivalGate?: string;
  durationMinutes: number;
  distanceKilometers?: number;
  fareSchedule?: FlightFareSchedule;
  notes?: string;
}

export interface UpdateFlightInput {
  flightNumber?: string;
  aircraft?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: Date;
  scheduledArrival?: Date;
  estimatedDeparture?: Date | null;
  estimatedArrival?: Date | null;
  actualDeparture?: Date | null;
  actualArrival?: Date | null;
  status?: FlightStatus;
  departureTerminal?: string | null;
  departureGate?: string | null;
  arrivalTerminal?: string | null;
  arrivalGate?: string | null;
  durationMinutes?: number;
  distanceKilometers?: number | null;
  fareSchedule?: FlightFareSchedule | null;
  notes?: string | null;
}

export interface FlightProfileResponse {
  id: string;
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  estimatedDeparture?: Date | null;
  estimatedArrival?: Date | null;
  actualDeparture?: Date | null;
  actualArrival?: Date | null;
  status: FlightStatus;
  departureTerminal?: string;
  departureGate?: string;
  arrivalTerminal?: string;
  arrivalGate?: string;
  durationMinutes: number;
  distanceKilometers?: number;
  fareSchedule?: FlightFareSchedule;
  departureAirportCode?: string;
  departureAirportName?: string;
  departureAirportCity?: string;
  arrivalAirportCode?: string;
  arrivalAirportName?: string;
  arrivalAirportCity?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightFilters {
  search?: string;
  flightNumber?: string;
  aircraft?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  status?: FlightStatus;
  departureFrom?: Date;
  departureTo?: Date;
  arrivalFrom?: Date;
  arrivalTo?: Date;
}

export type FlightSortField =
  | "flightNumber"
  | "scheduledDeparture"
  | "scheduledArrival"
  | "status"
  | "createdAt";

export interface FlightPaginationOptions {
  page: number;
  limit: number;
  sortBy?: FlightSortField;
  sortOrder?: "asc" | "desc";
}

export interface FlightPaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedFlights {
  items: FlightProfileResponse[];
  pagination: FlightPaginationMetadata;
}

export interface FlightCountResult {
  total: number;
  scheduled: number;
  boarding: number;
  departed: number;
  inFlight: number;
  landed: number;
  delayed: number;
  cancelled: number;
}
