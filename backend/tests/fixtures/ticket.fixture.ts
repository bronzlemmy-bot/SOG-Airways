import { Ticket } from "../../src/modules/tickets/models/ticket.model.js";

export const ticketId = "68a222222222222222222222";
export const ticketBookingId = "68a333333333333333333333";
export const ticketPaymentId = "68a444444444444444444444";
export const ticketCustomerId = "68a111111111111111111111";
export const ticketPassengerId = "68a555555555555555555555";
export const ticketFlightId = "68a666666666666666666666";

export function makeTicket(overrides: Record<string, unknown> = {}) {
  return Ticket.hydrate({
    _id: ticketId,
    ticketNumber: "SOG-TKT-1001",
    booking: ticketBookingId,
    payment: ticketPaymentId,
    customer: ticketCustomerId,
    passenger: ticketPassengerId,
    flight: ticketFlightId,
    ticketClass: "economy",
    status: "issued",
    issuedAt: new Date("2025-06-01T10:00:00.000Z"),
    fareAmount: 115,
    currency: "USD",
    createdAt: new Date("2025-06-01T10:00:00.000Z"),
    updatedAt: new Date("2025-06-01T10:00:00.000Z"),
    ...overrides,
  });
}
