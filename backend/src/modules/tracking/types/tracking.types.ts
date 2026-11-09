
import type {
  FlightPosition,
  FlightPositionSource,
  FlightTrackingEvent,
  FlightTrackingStatus,
} from "../models/flight-position.model.js";
import type { Types } from "mongoose";

export interface TrackingFlightLookup {
  flightId?: string;
  flightNumber?: string;
}

export interface TrackingListQuery {
  status?: FlightTrackingStatus;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureFrom?: Date;
  departureTo?: Date;
  page?: number;
  limit?: number;
}

export interface CreateFlightTrackingInput {
  flightId: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
}

export interface UpdateFlightPositionInput {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  source?: FlightPositionSource;
  recordedAt?: Date;
}

export interface UpdateFlightTrackingStatusInput {
  status: FlightTrackingStatus;
  description: string;
  location?: string | null;
  timestamp?: Date;
  estimatedDeparture?: Date | null;
  estimatedArrival?: Date | null;
  actualDeparture?: Date | null;
  actualArrival?: Date | null;
}

export interface TrackingHistoryEntry extends FlightTrackingEvent {}

export interface FlightTrackingResponse
  extends Omit<FlightPosition, "flightId"> {
  _id: string;
  flightId: string;
}

export interface TrackingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TrackingListResponse {
  items: FlightTrackingResponse[];
  pagination: TrackingPagination;
}

export interface TrackingFlightReference {
  flightId: Types.ObjectId;
  flightNumber: string;
}
