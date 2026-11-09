import assert from "node:assert/strict";
import mongoose from "mongoose";
import { test, type TestContext } from "node:test";

import { Aircraft } from "../../src/modules/aircraft/models/aircraft.model.js";
import { Booking } from "../../src/modules/bookings/models/booking.model.js";
import { bookingRepository } from "../../src/modules/bookings/repositories/booking.repository.js";
import { bookingService } from "../../src/modules/bookings/services/booking.service.js";
import { BookingWorkflowService } from "../../src/modules/bookings/services/booking-workflow.service.js";
import { customerService } from "../../src/modules/customers/services/customer.service.js";
import { Flight } from "../../src/modules/flights/models/flight.model.js";
import { passengerService } from "../../src/modules/passengers/services/passenger.service.js";
import { Payment } from "../../src/modules/payments/models/payment.model.js";
import { paymentService } from "../../src/modules/payments/services/payment.service.js";
import { ticketService } from "../../src/modules/tickets/services/ticket.service.js";
import type { BookingProfileResponse } from "../../src/modules/bookings/types/booking.types.js";
import type { PaymentProfileResponse } from "../../src/modules/payments/types/payment.types.js";
import type { TicketProfileResponse } from "../../src/modules/tickets/types/ticket.types.js";
import { ApiError } from "../../src/utils/api-error.js";
import { makeBooking } from "../fixtures/booking.fixture.js";

const userId = "68a111111111111111111111";
const customerId = "68a222222222222222222222";
const bookingId = "68a333333333333333333333";
const flightId = "68a444444444444444444444";
const paymentId = "68a555555555555555555555";
const passengerIds = [
  "68a666666666666666666666",
  "68a777777777777777777777",
];
const reference = "SOG-TRK-WORKFLOW-1001";
const workflow = new BookingWorkflowService();

function sessionQuery<T>(value: T) {
  return {
    exec: async () => value,
    session: () => ({
      exec: async () => value,
    }),
  };
}

function transactionSession() {
  return {
    withTransaction: async (operation: () => Promise<unknown>) =>
      operation(),
    endSession: async () => undefined,
  } as never;
}

function makeBookingResponse(
  status: "confirmed" | "cancelled",
  paymentStatus: "paid" | "failed",
  passengers: string[],
): BookingProfileResponse {
  const now = new Date();
  return {
    id: bookingId,
    bookingReference: "SOG-BOOKING-WORKFLOW-1001",
    customer: customerId,
    flight: flightId,
    passengers,
    passengerCount: passengers.length,
    bookingClass: "economy",
    status,
    paymentStatus,
    currency: "USD",
    baseFare: 100 * passengers.length,
    taxes: 10 * passengers.length,
    fees: 5 * passengers.length,
    discount: 0,
    totalAmount: 115 * passengers.length,
    bookedAt: now,
    expiresAt: null,
    trackingReference: reference,
    createdAt: now,
    updatedAt: now,
  };
}

function makePaymentResponse(
  status: "completed" | "failed",
  outcome: "approved" | "declined",
): PaymentProfileResponse {
  const now = new Date();
  return {
    id: paymentId,
    paymentReference: "SOG-DEMO-PAY-WORKFLOW-1001",
    booking: bookingId,
    customer: customerId,
    amount: 230,
    currency: "USD",
    method: "other",
    provider: "manual",
    status,
    refundedAmount: 0,
    refundStatus: "not_requested",
    metadata: {
      mode: "DEMO",
      demo: true,
      outcome,
      method: "demo-wallet",
    },
    createdAt: now,
    updatedAt: now,
  };
}

function makeTicketResponse(
  id: string,
  passenger: string,
): TicketProfileResponse {
  const now = new Date();
  return {
    id,
    ticketNumber: `SOG-TKT-${id.slice(-6)}`,
    booking: bookingId,
    payment: paymentId,
    customer: customerId,
    passenger,
    flight: flightId,
    trackingReference: reference,
    ticketClass: "economy",
    status: "issued",
    issuedAt: now,
    fareAmount: 115,
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  };
}

async function stubPaymentWorkflow(
  t: TestContext,
  outcome: "approved" | "declined",
  passengers = [passengerIds[0] as string],
  existingAttempt?: ReturnType<typeof Payment.hydrate>,
) {
  const count = passengers.length;
  const pendingBooking = makeBooking({
    _id: bookingId,
    customer: customerId,
    flight: flightId,
    passengers,
    passengerCount: count,
    bookingClass: "economy",
    status: "pending",
    paymentStatus: "unpaid",
    totalAmount: 115 * count,
    expiresAt: new Date(Date.now() + 60_000),
    trackingReference: reference,
  });
  const finalBooking = makeBooking({
    _id: bookingId,
    customer: customerId,
    flight: flightId,
    passengers,
    passengerCount: count,
    bookingClass: "economy",
    status: outcome === "approved" ? "confirmed" : "cancelled",
    paymentStatus: outcome === "approved" ? "paid" : "failed",
    totalAmount: 115 * count,
    expiresAt: null,
    trackingReference: reference,
  });
  const payment = makePaymentResponse(
    outcome === "approved" ? "completed" : "failed",
    outcome,
  );
  const bookingResponse = makeBookingResponse(
    outcome === "approved" ? "confirmed" : "cancelled",
    outcome === "approved" ? "paid" : "failed",
    passengers,
  );
  const tickets: TicketProfileResponse[] =
    outcome === "approved"
      ? passengers.map((id, index) =>
          makeTicketResponse(
            `68a8888888888888888888${index + 1}`,
            id,
          ),
        )
      : [];
  const session = transactionSession();

  t.mock.method(mongoose, "startSession", async () => session);
  t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => customerId,
  );
  t.mock.method(
    Booking,
    "findOne",
    () => sessionQuery(pendingBooking) as never,
  );
  t.mock.method(
    Payment,
    "findOne",
    () => sessionQuery(existingAttempt ?? null) as never,
  );
  const bookingUpdate = t.mock.method(
    Booking,
    "findOneAndUpdate",
    () => sessionQuery(finalBooking) as never,
  );
  const createDemoPayment = t.mock.method(
    paymentService,
    "createDemoPayment",
    async () => payment,
  );
  const issueTicket = t.mock.method(
    ticketService,
    "issueTicket",
    async () => tickets[0] as TicketProfileResponse,
  );
  t.mock.method(bookingService, "getBookingById", async () => bookingResponse);
  t.mock.method(paymentService, "getPaymentById", async () => payment);
  t.mock.method(ticketService, "getBookingTickets", async () => tickets);

  const result = await workflow.processDemoPayment(userId, bookingId, {
    idempotencyKey: "workflow-payment-key-0001",
    outcome,
    method: "demo-wallet",
  });

  return {
    result,
    bookingUpdate,
    createDemoPayment,
    issueTicket,
  };
}

test("customer booking creation uses backend fares and persists passenger associations", async (t) => {
  const session = transactionSession();
  const departure = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const arrival = new Date(departure.getTime() + 2 * 60 * 60 * 1000);
  const flight = {
    _id: new mongoose.Types.ObjectId(flightId),
    status: "scheduled",
    scheduledDeparture: departure,
    scheduledArrival: arrival,
    aircraft: new mongoose.Types.ObjectId("68a999999999999999999999"),
    fareSchedule: {
      economy: {
        baseFare: 100,
        taxes: 10,
        fees: 5,
        currency: "USD",
      },
    },
  };
  const aircraft = {
    status: "active",
    capacity: {
      economy: 10,
      premiumEconomy: 5,
      business: 4,
      first: 2,
    },
  };
  const passengerId = passengerIds[0] as string;
  const createdPassenger = {
    id: passengerId,
  };

  t.mock.method(mongoose, "startSession", async () => session);
  t.mock.method(customerService, "getOrCreateProfileId", async () => customerId);
  t.mock.method(bookingRepository, "findByIdempotencyKey", async () => null);
  t.mock.method(Flight, "findById", () => sessionQuery(flight) as never);
  t.mock.method(Aircraft, "findById", () => sessionQuery(aircraft) as never);
  t.mock.method(Flight, "updateOne", () =>
    sessionQuery({ matchedCount: 1 }) as never,
  );
  t.mock.method(Booking, "aggregate", () =>
    sessionQuery([{ total: 0 }]) as never,
  );
  const createPassenger = t.mock.method(
    passengerService,
    "createPassenger",
    async () => createdPassenger as never,
  );
  const createBooking = t.mock.method(
    bookingRepository,
    "create",
    async () => ({
      _id: new mongoose.Types.ObjectId(bookingId),
    }) as never,
  );
  t.mock.method(
    workflow,
    "getBookingDetailsForAccess",
    async () => ({ booking: makeBookingResponse("confirmed", "paid", [passengerId]) }) as never,
  );

  await workflow.createCustomerBooking(userId, {
    flightId,
    bookingClass: "economy",
    idempotencyKey: "workflow-booking-key-0001",
    passengers: [
      {
        firstName: "Avery",
        lastName: "Example",
        dateOfBirth: new Date("1990-01-01T00:00:00.000Z"),
        nationality: "US",
      },
    ],
  });

  const savedBooking = createBooking.mock.calls[0]?.arguments[0];
  assert.equal(createPassenger.mock.callCount(), 1);
  assert.equal(savedBooking?.baseFare, 100);
  assert.equal(savedBooking?.taxes, 10);
  assert.equal(savedBooking?.fees, 5);
  assert.equal(savedBooking?.totalAmount, 115);
  assert.deepEqual(savedBooking?.passengers, [passengerId]);
});

test("invalid flight selection aborts booking creation before passenger or booking writes", async (t) => {
  const session = transactionSession();
  t.mock.method(mongoose, "startSession", async () => session);
  t.mock.method(customerService, "getOrCreateProfileId", async () => customerId);
  t.mock.method(bookingRepository, "findByIdempotencyKey", async () => null);
  t.mock.method(Flight, "findById", () => sessionQuery(null) as never);
  const createPassenger = t.mock.method(
    passengerService,
    "createPassenger",
    async () => ({ id: passengerIds[0] }) as never,
  );
  const createBooking = t.mock.method(
    bookingRepository,
    "create",
    async () => ({ _id: new mongoose.Types.ObjectId(bookingId) }) as never,
  );

  await assert.rejects(
    workflow.createCustomerBooking(userId, {
      flightId,
      bookingClass: "economy",
      idempotencyKey: "workflow-booking-key-0002",
      passengers: [
        {
          firstName: "Avery",
          lastName: "Example",
          dateOfBirth: new Date("1990-01-01T00:00:00.000Z"),
          nationality: "US",
        },
      ],
    }),
    (error: unknown) =>
      error instanceof ApiError &&
      error.statusCode === 404 &&
      error.code === "FLIGHT_NOT_FOUND",
  );
  assert.equal(createPassenger.mock.callCount(), 0);
  assert.equal(createBooking.mock.callCount(), 0);
});

test("approved demo payment issues one distinct ticket per passenger", async (t) => {
  const { result, issueTicket, createDemoPayment } =
    await stubPaymentWorkflow(t, "approved", passengerIds);

  assert.equal(result.payment.status, "completed");
  assert.equal(result.payment.metadata.mode, "DEMO");
  assert.equal(result.tickets.length, 2);
  assert.equal(issueTicket.mock.callCount(), 2);
  assert.equal(createDemoPayment.mock.callCount(), 1);
  assert.equal(result.trackingReference, reference);
});

test("declined demo payment creates a failed payment without issuing tickets", async (t) => {
  const { result, issueTicket } = await stubPaymentWorkflow(t, "declined");

  assert.equal(result.payment.status, "failed");
  assert.equal(result.booking.paymentStatus, "failed");
  assert.equal(result.tickets.length, 0);
  assert.equal(issueTicket.mock.callCount(), 0);
});

test("replaying an approved demo payment idempotency key does not issue duplicate tickets", async (t) => {
  const existingAttempt = Payment.hydrate({
    _id: paymentId,
    paymentReference: "SOG-DEMO-PAY-WORKFLOW-1001",
    booking: bookingId,
    customer: customerId,
    amount: 230,
    currency: "USD",
    method: "other",
    provider: "manual",
    status: "completed",
    idempotencyKey: "workflow-payment-key-0001",
    metadata: {
      mode: "DEMO",
      demo: true,
      outcome: "approved",
      method: "demo-wallet",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const { result, issueTicket, createDemoPayment, bookingUpdate } =
    await stubPaymentWorkflow(
      t,
      "approved",
      passengerIds,
      existingAttempt,
    );

  assert.equal(result.payment.status, "completed");
  assert.equal(result.tickets.length, 2);
  assert.equal(issueTicket.mock.callCount(), 0);
  assert.equal(createDemoPayment.mock.callCount(), 0);
  assert.equal(bookingUpdate.mock.callCount(), 0);
});

test("reusing a demo payment idempotency key with a different outcome is rejected", async (t) => {
  const session = transactionSession();
  const pendingBooking = makeBooking({
    _id: bookingId,
    customer: customerId,
    status: "pending",
    paymentStatus: "unpaid",
    expiresAt: new Date(Date.now() + 60_000),
  });
  const existingAttempt = Payment.hydrate({
    _id: paymentId,
    paymentReference: "SOG-DEMO-PAY-WORKFLOW-1001",
    booking: bookingId,
    customer: customerId,
    amount: 115,
    currency: "USD",
    method: "other",
    provider: "manual",
    status: "completed",
    idempotencyKey: "workflow-payment-key-0001",
    metadata: {
      mode: "DEMO",
      demo: true,
      outcome: "approved",
      method: "demo-wallet",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  t.mock.method(mongoose, "startSession", async () => session);
  t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => customerId,
  );
  t.mock.method(
    Booking,
    "findOne",
    () => sessionQuery(pendingBooking) as never,
  );
  t.mock.method(
    Payment,
    "findOne",
    () => sessionQuery(existingAttempt) as never,
  );
  const createDemoPayment = t.mock.method(
    paymentService,
    "createDemoPayment",
    async () => makePaymentResponse("failed", "declined"),
  );
  const issueTicket = t.mock.method(
    ticketService,
    "issueTicket",
    async () => makeTicketResponse("68a888888888888888888881", passengerIds[0] as string),
  );

  await assert.rejects(
    workflow.processDemoPayment(userId, bookingId, {
      idempotencyKey: "workflow-payment-key-0001",
      outcome: "declined",
      method: "demo-wallet",
    }),
    (error: unknown) =>
      error instanceof ApiError &&
      error.statusCode === 409 &&
      error.code === "PAYMENT_IDEMPOTENCY_CONFLICT",
  );
  assert.equal(createDemoPayment.mock.callCount(), 0);
  assert.equal(issueTicket.mock.callCount(), 0);
});
