import { Booking } from "../../src/modules/bookings/models/booking.model.js";

export const bookingId = "68a222222222222222222222";
export const bookingCustomerId = "68a111111111111111111111";
export const bookingFlightId = "68a333333333333333333333";
export const bookingPassengerId = "68a444444444444444444444";

export function makeBooking(overrides: Record<string, unknown> = {}) {
  return Booking.hydrate({
    _id: bookingId,
    bookingReference: "SOG-TEST-1001",
    customer: bookingCustomerId,
    flight: bookingFlightId,
    passengers: [bookingPassengerId],
    passengerCount: 1,
    bookingClass: "economy",
    status: "pending",
    paymentStatus: "unpaid",
    currency: "USD",
    baseFare: 100,
    taxes: 10,
    fees: 5,
    discount: 0,
    totalAmount: 115,
    bookedAt: new Date("2025-06-01T10:00:00.000Z"),
    expiresAt: null,
    cancelledAt: null,
    createdAt: new Date("2025-06-01T10:00:00.000Z"),
    updatedAt: new Date("2025-06-01T10:00:00.000Z"),
    ...overrides,
  });
}