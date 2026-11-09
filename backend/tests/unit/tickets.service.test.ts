import assert from "node:assert/strict";
import { test } from "node:test";

import { ApiError } from "../../src/utils/api-error.js";
import { Booking } from "../../src/modules/bookings/models/booking.model.js";
import { Passenger } from "../../src/modules/passengers/models/passenger.model.js";
import { Payment } from "../../src/modules/payments/models/payment.model.js";
import { ticketRepository } from "../../src/modules/tickets/repositories/ticket.repository.js";
import { TicketService } from "../../src/modules/tickets/services/ticket.service.js";
import { makeBooking } from "../fixtures/booking.fixture.js";
import { makePassenger } from "../fixtures/passenger.fixture.js";
import {
  makeTicket,
  ticketBookingId,
  ticketCustomerId,
  ticketFlightId,
  ticketId,
  ticketPassengerId,
  ticketPaymentId,
} from "../fixtures/ticket.fixture.js";

const service = new TicketService();
function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}

const input = {
  ticketNumber: "SOG-TKT-1001",
  booking: ticketBookingId,
  payment: ticketPaymentId,
  customer: ticketCustomerId,
  passenger: ticketPassengerId,
  flight: ticketFlightId,
  ticketClass: "economy" as const,
  fareAmount: 115,
};

test("issueTicket rejects duplicate passenger-flight booking and ticket number", async (t) => {
  const combo = t.mock.method(ticketRepository, "findByBookingPassengerAndFlight", async () => makeTicket());
  const numberExists = t.mock.method(ticketRepository, "existsByTicketNumber", async () => false);
  const create = t.mock.method(ticketRepository, "create", async () => makeTicket());
  await assert.rejects(service.issueTicket(input),
    (e: unknown) => hasApiError(e, 409, "TICKET_ALREADY_EXISTS"));
  assert.equal(numberExists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
  combo.mock.restore();
  t.mock.method(ticketRepository, "findByBookingPassengerAndFlight", async () => null);
  numberExists.mock.restore();
  t.mock.method(ticketRepository, "existsByTicketNumber", async () => true);
  await assert.rejects(service.issueTicket(input),
    (e: unknown) => hasApiError(e, 409, "TICKET_NUMBER_ALREADY_EXISTS"));
  assert.equal(create.mock.callCount(), 0);
});

test("issueTicket creates and returns a mapped ticket", async (t) => {
  const booking = makeBooking({
    _id: ticketBookingId,
    customer: ticketCustomerId,
    flight: ticketFlightId,
    passengers: [ticketPassengerId],
    bookingClass: "economy",
    status: "confirmed",
    paymentStatus: "paid",
  });
  const payment = Payment.hydrate({
    _id: ticketPaymentId,
    paymentReference: "SOG-DEMO-PAY-1001",
    booking: ticketBookingId,
    customer: ticketCustomerId,
    amount: 115,
    currency: "USD",
    method: "other",
    provider: "manual",
    status: "completed",
    metadata: { mode: "DEMO", demo: true },
    createdAt: new Date("2025-06-01T10:00:00.000Z"),
    updatedAt: new Date("2025-06-01T10:00:00.000Z"),
  });
  const passenger = makePassenger({
    _id: ticketPassengerId,
    customer: ticketCustomerId,
  });
  const asQuery = <T>(record: T) => ({
    session: () => ({
      exec: async () => record,
    }),
  });
  t.mock.method(Booking, "findById", () => asQuery(booking) as never);
  t.mock.method(Payment, "findById", () => asQuery(payment) as never);
  t.mock.method(Passenger, "findById", () => asQuery(passenger) as never);
  const combo = t.mock.method(ticketRepository, "findByBookingPassengerAndFlight", async () => null);
  const numberExists = t.mock.method(ticketRepository, "existsByTicketNumber", async () => false);
  const create = t.mock.method(ticketRepository, "create", async () => makeTicket());
  const result = await service.issueTicket(input);
  assert.equal(result.id, ticketId);
  assert.equal(result.booking, ticketBookingId);
  assert.equal(result.passenger, ticketPassengerId);
  assert.equal(result.ticketNumber, "SOG-TKT-1001");
  assert.equal(create.mock.callCount(), 1);
  assert.equal(combo.mock.callCount(), 1);
  assert.equal(numberExists.mock.callCount(), 1);
});

test("ticket lookups return 404 for absent records", async (t) => {
  const byId = t.mock.method(ticketRepository, "findById", async () => null);
  const byNumber = t.mock.method(ticketRepository, "findByTicketNumber", async () => null);
  await assert.rejects(service.getTicketById(ticketId),
    (e: unknown) => hasApiError(e, 404, "TICKET_NOT_FOUND"));
  await assert.rejects(service.getTicketByNumber("SOG-TKT-1001"),
    (e: unknown) => hasApiError(e, 404, "TICKET_NOT_FOUND"));
  assert.equal(byId.mock.callCount(), 1);
  assert.equal(byNumber.mock.callCount(), 1);
});

test("PDF data access hides tickets belonging to another customer", async (t) => {
  const find = t.mock.method(
    ticketRepository,
    "findById",
    async () => makeTicket(),
  );
  await assert.rejects(
    service.getTicketPdfData(ticketId, "68a999999999999999999999", false),
    (error: unknown) =>
      hasApiError(error, 404, "TICKET_NOT_FOUND"),
  );
  assert.equal(find.mock.callCount(), 1);
});

test("updateTicket enforces status transitions and requires cancellation reason", async (t) => {
  const find = t.mock.method(ticketRepository, "findById", async () => makeTicket());
  const update = t.mock.method(ticketRepository, "update", async (_id, data) => makeTicket(data));
  const checkedIn = await service.updateTicket(ticketId, { status: "checked_in" });
  assert.equal(checkedIn.status, "checked_in");
  await assert.rejects(service.updateTicket(ticketId, { status: "cancelled" }),
    (e: unknown) => hasApiError(e, 400, "CANCELLATION_REASON_REQUIRED"));
  await assert.rejects(service.updateTicket(ticketId, { status: "used" }),
    (e: unknown) => hasApiError(e, 409, "INVALID_TICKET_STATUS_TRANSITION"));
  assert.equal(update.mock.callCount(), 1);

  find.mock.restore();
  t.mock.method(ticketRepository, "findById", async () => makeTicket({ status: "used" }));
  await assert.rejects(service.updateTicket(ticketId, { status: "issued" }),
    (e: unknown) => hasApiError(e, 409, "INVALID_TICKET_STATUS_TRANSITION"));
});

test("cancelTicket trims reasons and deleteTicket protects used tickets", async (t) => {
  const find = t.mock.method(ticketRepository, "findById", async () => makeTicket());
  const update = t.mock.method(ticketRepository, "update", async (_id, data) => makeTicket(data));
  const cancelled = await service.cancelTicket(ticketId, "  Customer request  ");
  assert.equal(cancelled.status, "cancelled");
  assert.equal(update.mock.calls[0]?.arguments[1].cancellationReason, "Customer request");
  await assert.rejects(service.cancelTicket(ticketId, "   "),
    (e: unknown) => hasApiError(e, 400, "CANCELLATION_REASON_REQUIRED"));

  find.mock.restore();
  t.mock.method(ticketRepository, "findById", async () => makeTicket({ status: "used" }));
  const remove = t.mock.method(ticketRepository, "delete", async () => makeTicket());
  await assert.rejects(service.deleteTicket(ticketId),
    (e: unknown) => hasApiError(e, 409, "USED_TICKET_CANNOT_BE_DELETED"));
  assert.equal(remove.mock.callCount(), 0);
});

test("ticket listing and status counts delegate with pagination", async (t) => {
  const many = t.mock.method(ticketRepository, "findMany", async () => [makeTicket()]);
  const count = t.mock.method(ticketRepository, "count", async () => 12);
  const grouped = t.mock.method(ticketRepository, "countByStatus", async () => ({
    issued: 5, checked_in: 2, used: 3, cancelled: 1, voided: 1,
  }));
  const page = await service.getCustomerTickets(ticketCustomerId, { page: 2, limit: 5 });
  assert.equal(page.items[0]?.id, ticketId);
  assert.equal(page.pagination.totalPages, 3);
  assert.deepEqual(many.mock.calls[0]?.arguments[0], { customer: ticketCustomerId });
  assert.deepEqual(await service.countTickets(), {
    total: 12, issued: 5, checked_in: 2, used: 3, cancelled: 1, voided: 1,
  });
  assert.equal(count.mock.callCount(), 2);
  assert.equal(grouped.mock.callCount(), 1);
});
