export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "in-air"
  | "landed"
  | "delayed"
  | "cancelled"
  | "diverted";

export type FlightType =
  | "domestic"
  | "international";

export type CabinClass =
  | "economy"
  | "premium-economy"
  | "business"
  | "first";

export interface FlightRoute {
  departureAirportId: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportId: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
}

export interface FlightSchedule {
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  aircraftId: string;
  aircraftRegistration?: string;
  type: FlightType;
  status: FlightStatus;
  route: FlightRoute;
  schedule: FlightSchedule;
  terminal?: string;
  departureGate?: string;
  arrivalGate?: string;
  baggageClaim?: string;
  availableSeats: number;
  totalSeats: number;
  cabinClasses: CabinClass[];
  price: number;
  currency: string;
  delayMinutes?: number;
  delayReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}