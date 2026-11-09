export type TripStatus =
  | "upcoming"
  | "in-progress"
  | "completed"
  | "cancelled";

export type TripType =
  | "one-way"
  | "round-trip"
  | "multi-city";

export interface TripSegment {
  id: string;
  flightId: string;
  flightNumber: string;
  departureAirportId: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportId: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  status: TripStatus;
}

export interface Trip {
  id: string;
  userId: string;
  bookingId: string;
  bookingReference: string;
  title?: string;
  type: TripType;
  status: TripStatus;
  destination?: string;
  segments: TripSegment[];
  passengerCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}