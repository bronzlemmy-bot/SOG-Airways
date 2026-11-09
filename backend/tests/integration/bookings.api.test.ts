import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { Booking } from "../../src/modules/bookings/models/booking.model.js";
import {
  bookingCustomerId,
  bookingFlightId,
  bookingId,
  bookingPassengerId,
  makeBooking,
} from "../fixtures/booking.fixture.js";

const jwtSecret = "test-only-jwt-signing-secret";

function token(role = "customer"): string {
  return jwt.sign({ role }, jwtSecret, {
    subject: bookingCustomerId,
    expiresIn: "5m",
  });
}

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
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

test("booking create validates price, passenger count, and strict input before database access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/bookings`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("admin")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      customer: bookingCustomerId,
      flight: bookingFlightId,
      passengers: [bookingPassengerId, bookingPassengerId],
      passengerCount: 1,
      baseFare: 100,
      taxes: 10,
      totalAmount: 111,
      unexpected: true,
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("customer checkout rejects invalid passenger information before database access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/bookings/checkout`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      flightId: bookingFlightId,
      bookingClass: "economy",
      idempotencyKey: "invalid-passenger-key-001",
      passengers: [
        {
          firstName: "",
          lastName: "Example",
          dateOfBirth: "1990-01-01",
          nationality: "US",
        },
      ],
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("booking management listing requires admin authorization", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/bookings`);
  assert.equal(unauthenticated.status, 401);

  const forbidden = await fetch(`${baseUrl}/api/v1/bookings`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await forbidden.json();
  assert.equal(forbidden.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
});

test("administrator booking reference lookup normalizes references", async (t) => {
  const find = t.mock.method(Booking, "findOne", () => ({
    exec: async () => makeBooking(),
  }) as never);

  const response = await fetch(`${baseUrl}/api/v1/bookings/reference/sog-test-1001`, {
    headers: { authorization: `Bearer ${token("admin")}` },
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.bookingReference, "SOG-TEST-1001");
  assert.equal(find.mock.calls[0]?.arguments[0]?.bookingReference, "SOG-TEST-1001");
});

test("booking ID lookup requires authentication and validates ID", async (t) => {
  const find = t.mock.method(Booking, "findById", () => ({
    exec: async () => makeBooking(),
  }) as never);

  const unauthenticated = await fetch(`${baseUrl}/api/v1/bookings/${bookingId}`);
  assert.equal(unauthenticated.status, 401);

  const invalid = await fetch(`${baseUrl}/api/v1/bookings/not-an-id`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(invalid.status, 400);
  assert.equal(find.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/bookings/${bookingId}`, {
    headers: { authorization: `Bearer ${token("admin")}` },
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.id, bookingId);
  assert.equal(find.mock.callCount(), 1);
});