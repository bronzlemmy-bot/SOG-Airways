export type CheckoutCabinClass =
  | "economy"
  | "premium_economy"
  | "business"
  | "first";

export type DemoPaymentOutcome = "approved" | "declined" | "error";
export type DemoPaymentMethod = "demo-wallet" | "demo-bank-transfer";

export interface CheckoutFare {
  baseFare: number;
  taxes: number;
  fees: number;
  currency: string;
}

export type CheckoutFareSchedule = Partial<
  Record<CheckoutCabinClass, CheckoutFare>
>;

export interface CheckoutFlight {
  id: string;
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  departureAirportCode?: string;
  departureAirportName?: string;
  departureAirportCity?: string;
  arrivalAirport: string;
  arrivalAirportCode?: string;
  arrivalAirportName?: string;
  arrivalAirportCity?: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
  departureTerminal?: string;
  departureGate?: string;
  arrivalTerminal?: string;
  arrivalGate?: string;
  durationMinutes: number;
  fareSchedule?: CheckoutFareSchedule;
}

export interface CheckoutAirport {
  id: string;
  airportCode: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface CheckoutPassengerInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  nationality: string;
  email?: string;
  phoneNumber?: string;
}

export interface CheckoutPassenger extends CheckoutPassengerInput {
  id: string;
  customer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutBooking {
  id: string;
  bookingReference: string;
  customer: string;
  flight: string;
  passengers: string[];
  passengerCount: number;
  bookingClass: CheckoutCabinClass;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "expired";
  paymentStatus:
    | "unpaid"
    | "pending"
    | "paid"
    | "partially_refunded"
    | "refunded"
    | "failed";
  currency: string;
  baseFare: number;
  taxes: number;
  fees: number;
  discount: number;
  totalAmount: number;
  bookedAt: string;
  expiresAt?: string | null;
  trackingReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutTicket {
  id: string;
  ticketNumber: string;
  booking: string;
  payment: string;
  customer: string;
  passenger: string;
  flight: string;
  trackingReference?: string;
  ticketClass: CheckoutCabinClass;
  status: "issued" | "checked_in" | "used" | "cancelled" | "voided";
  issuedAt: string;
  seatNumber?: string;
  fareAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayment {
  id: string;
  paymentReference: string;
  booking: string;
  customer: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded"
    | "partially_refunded";
  method: string;
  provider: string;
  paidAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerBookingDetails {
  booking: CheckoutBooking;
  flight: CheckoutFlight;
  passengers: CheckoutPassenger[];
  tickets: CheckoutTicket[];
  payment?: CheckoutPayment;
  trackingReference?: string;
}

export interface DemoPaymentWorkflowResult {
  booking: CheckoutBooking;
  payment: CheckoutPayment;
  tickets: CheckoutTicket[];
  trackingReference: string;
}

export interface CreateCustomerBookingInput {
  flightId: string;
  bookingClass: CheckoutCabinClass;
  passengers: CheckoutPassengerInput[];
  idempotencyKey: string;
}

export interface ProcessDemoPaymentInput {
  idempotencyKey: string;
  outcome: DemoPaymentOutcome;
  method: DemoPaymentMethod;
}
