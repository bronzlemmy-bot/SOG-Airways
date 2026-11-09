export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";

export type BookingClass =
  | "economy"
  | "premium-economy"
  | "business"
  | "first";

export type BookingType =
  | "one-way"
  | "round-trip"
  | "multi-city";

export interface BookingPassenger {
  passengerId: string;
  firstName: string;
  lastName: string;
  passengerType: "adult" | "child" | "infant";
  seatNumber?: string;
  ticketNumber?: string;
}

export interface BookingFlight {
  flightId: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  cabinClass: BookingClass;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  type: BookingType;
  status: BookingStatus;
  flights: BookingFlight[];
  passengers: BookingPassenger[];
  totalPassengers: number;
  currency: string;
  subtotal: number;
  taxes: number;
  fees: number;
  discount?: number;
  totalAmount: number;
  paymentId?: string;
  bookedAt: string;
  updatedAt: string;
  cancelledAt?: string;
  notes?: string;
}