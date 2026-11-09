import type { Booking } from "@/types/booking";

/**
 * Fictional booking records for the public Manage Booking page.
 *
 * Development only:
 * - No localStorage.
 * - No backend requests.
 * - Replace the mock lookup implementation when the backend is ready.
 */
export const MOCK_MANAGE_BOOKINGS: Booking[] = [
  {
    id: "mock-booking-001",
    bookingReference: "SOG7K2",
    userId: "mock-user-001",
    type: "round-trip",
    status: "confirmed",
    flights: [
      {
        flightId: "mock-flight-001",
        flightNumber: "SOG101",
        departureAirport: "LOS",
        arrivalAirport: "ABV",
        departureDate: "2026-11-14",
        departureTime: "08:30",
        arrivalDate: "2026-11-14",
        arrivalTime: "09:45",
        cabinClass: "economy",
      },
      {
        flightId: "mock-flight-002",
        flightNumber: "SOG102",
        departureAirport: "ABV",
        arrivalAirport: "LOS",
        departureDate: "2026-11-21",
        departureTime: "16:00",
        arrivalDate: "2026-11-21",
        arrivalTime: "17:15",
        cabinClass: "economy",
      },
    ],
    passengers: [
      {
        passengerId: "mock-passenger-001",
        firstName: "Amina",
        lastName: "Adeyemi",
        passengerType: "adult",
        seatNumber: "12A",
        ticketNumber: "SOG-TKT-100001",
      },
    ],
    totalPassengers: 1,
    currency: "NGN",
    subtotal: 180000,
    taxes: 18000,
    fees: 5000,
    discount: 0,
    totalAmount: 203000,
    paymentId: "mock-payment-001",
    bookedAt: "2026-10-01T10:30:00.000Z",
    updatedAt: "2026-10-01T10:30:00.000Z",
    notes: "Fictional development booking.",
  },
  {
    id: "mock-booking-002",
    bookingReference: "SOG4P9",
    userId: "mock-user-002",
    type: "one-way",
    status: "pending",
    flights: [
      {
        flightId: "mock-flight-003",
        flightNumber: "SOG205",
        departureAirport: "LOS",
        arrivalAirport: "PHC",
        departureDate: "2026-11-18",
        departureTime: "11:15",
        arrivalDate: "2026-11-18",
        arrivalTime: "12:30",
        cabinClass: "business",
      },
    ],
    passengers: [
      {
        passengerId: "mock-passenger-002",
        firstName: "Daniel",
        lastName: "Balogun",
        passengerType: "adult",
      },
      {
        passengerId: "mock-passenger-003",
        firstName: "Tomi",
        lastName: "Balogun",
        passengerType: "child",
      },
    ],
    totalPassengers: 2,
    currency: "NGN",
    subtotal: 320000,
    taxes: 32000,
    fees: 8000,
    totalAmount: 360000,
    bookedAt: "2026-10-03T14:20:00.000Z",
    updatedAt: "2026-10-03T14:20:00.000Z",
    notes: "Fictional development booking.",
  },
  {
    id: "mock-booking-003",
    bookingReference: "SOG8M3",
    userId: "mock-user-003",
    type: "one-way",
    status: "cancelled",
    flights: [
      {
        flightId: "mock-flight-004",
        flightNumber: "SOG310",
        departureAirport: "ABV",
        arrivalAirport: "LOS",
        departureDate: "2026-10-20",
        departureTime: "14:00",
        arrivalDate: "2026-10-20",
        arrivalTime: "15:15",
        cabinClass: "premium-economy",
      },
    ],
    passengers: [
      {
        passengerId: "mock-passenger-004",
        firstName: "Chika",
        lastName: "Okafor",
        passengerType: "adult",
      },
    ],
    totalPassengers: 1,
    currency: "NGN",
    subtotal: 150000,
    taxes: 15000,
    fees: 5000,
    totalAmount: 170000,
    bookedAt: "2026-09-20T09:00:00.000Z",
    updatedAt: "2026-10-02T12:00:00.000Z",
    cancelledAt: "2026-10-02T12:00:00.000Z",
    notes: "Fictional development booking.",
  },
];