import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { customerService } from "../../src/modules/customers/services/customer.service.js";
import { ticketRepository } from "../../src/modules/tickets/repositories/ticket.repository.js";
import { ticketService } from "../../src/modules/tickets/services/ticket.service.js";
import { makeTicket } from "../fixtures/ticket.fixture.js";
import type { TicketPdfData } from "../../src/modules/tickets/types/ticket.types.js";

const customerId = "68a111111111111111111111";
const jwtSecret = "test-only-jwt-signing-secret";
const token = (role = "customer") => jwt.sign({ role }, jwtSecret, { subject: customerId, expiresIn: "5m" });
let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});
after(async () => {
  if (!server.listening) return;
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("my-tickets returns only the authenticated customer's ticket listing", async (t) => {
  const getProfileId = t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => customerId,
  );
  const getCustomerTickets = t.mock.method(ticketService, "getCustomerTickets", async () => ({
    items: [],
    pagination: { page: 1, limit: 20, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
  }));
  const response = await fetch(`${baseUrl}/api/v1/tickets/my-tickets`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(getCustomerTickets.mock.calls[0]?.arguments, [
    customerId,
    { page: 1, limit: 20 },
  ]);
  assert.equal(getProfileId.mock.callCount(), 1);
  assert.deepEqual(body.data, []);
});

test("ticket list and issuance require administrator authorization", async () => {
  const list = await fetch(`${baseUrl}/api/v1/tickets`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await list.json();
  assert.equal(list.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");

  const issue = await fetch(`${baseUrl}/api/v1/tickets`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("staff")}`,
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(issue.status, 403);
});

test("ticket issuance rejects invalid identifiers and fares before persistence", async () => {
  const response = await fetch(`${baseUrl}/api/v1/tickets`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("admin")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      booking: "bad-id",
      payment: "bad-id",
      customer: "bad-id",
      passenger: "bad-id",
      flight: "bad-id",
      ticketClass: "economy",
      fareAmount: -1,
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("ticket PDF download enforces ownership and streams a PDF", async (t) => {
  const ticket = makeTicket({
    customer: customerId,
    ticketNumber: "SOG-TKT-1001",
  });
  const findTicket = t.mock.method(
    ticketRepository,
    "findById",
    async () => ticket,
  );
  const otherCustomer = "68a999999999999999999999";
  t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => otherCustomer,
  );

  const unauthorized = await fetch(
    `${baseUrl}/api/v1/tickets/${ticket._id.toString()}/pdf`,
  );
  assert.equal(unauthorized.status, 401);

  const forbidden = await fetch(
    `${baseUrl}/api/v1/tickets/${ticket._id.toString()}/pdf`,
    { headers: { authorization: `Bearer ${token()}` } },
  );
  assert.equal(forbidden.status, 404);
  assert.equal(findTicket.mock.callCount(), 1);
});

test("authorized ticket PDF downloads contain a generated PDF document", async (t) => {
  const now = new Date("2030-01-01T10:00:00.000Z");
  const ticketData: TicketPdfData = {
    ticket: {
      id: "68a222222222222222222222",
      ticketNumber: "SOG-TKT-1001",
      booking: "68a333333333333333333333",
      payment: "68a444444444444444444444",
      customer: customerId,
      passenger: "68a555555555555555555555",
      flight: "68a666666666666666666666",
      trackingReference: "SOG-TRK-TEST-1001",
      ticketClass: "economy",
      status: "issued",
      issuedAt: now,
      fareAmount: 115,
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    },
    bookingReference: "SOG-BOOKING-TEST-1001",
    passengerName: "Avery Example",
    flightNumber: "SOG101",
    departureAirportCode: "JFK",
    departureAirportName: "John F. Kennedy International Airport",
    departureAirportCity: "New York",
    arrivalAirportCode: "LHR",
    arrivalAirportName: "Heathrow Airport",
    arrivalAirportCity: "London",
    scheduledDeparture: now,
    scheduledArrival: new Date("2030-01-01T12:00:00.000Z"),
    paymentStatus: "completed",
    demoPayment: true,
  };
  const getPdfData = t.mock.method(
    ticketService,
    "getTicketPdfData",
    async () => ticketData,
  );
  const response = await fetch(
    `${baseUrl}/api/v1/tickets/${ticketData.ticket.id}/pdf`,
    { headers: { authorization: `Bearer ${token("admin")}` } },
  );
  const pdf = Buffer.from(await response.arrayBuffer());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.match(
    response.headers.get("content-disposition") ?? "",
    /SOG-Airways-Ticket-SOG-TKT-1001\.pdf/,
  );
  assert.equal(pdf.subarray(0, 4).toString("ascii"), "%PDF");
  assert.equal(getPdfData.mock.callCount(), 1);
});
