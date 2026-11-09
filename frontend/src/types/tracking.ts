export type FlightTrackingStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "in_flight"
  | "landed"
  | "delayed"
  | "cancelled"
  | "diverted";

export type FlightTrackingSource = "manual" | "automatic" | "provider";

export interface FlightTrackingEvent {
  status: FlightTrackingStatus;
  description: string;
  location?: string | null;
  timestamp: string;
}

export interface FlightTrackingRecord {
  _id: string;
  flightId: string;
  flightNumber: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  source: FlightTrackingSource;
  recordedAt: string;
  status: FlightTrackingStatus;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  estimatedDeparture: string | null;
  estimatedArrival: string | null;
  actualDeparture: string | null;
  actualArrival: string | null;
  events: FlightTrackingEvent[];
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlightTrackingUnavailableResponse {
  success: false;
  provider: "disabled";
  status: "unavailable";
  message: string;
  flight?: {
    airlineCode?: string;
    flightNumber?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    scheduledDeparture?: string;
    scheduledArrival?: string;
    status: "unavailable";
    lastUpdated: string;
    source: "disabled";
    message?: string;
  };
}

export type FlightTrackingLookupResponse =
  | FlightTrackingRecord
  | FlightTrackingUnavailableResponse;
