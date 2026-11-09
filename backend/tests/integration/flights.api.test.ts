import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { Flight } from "../../src/modules/flights/models/flight.model.js";

const flightId = "68a222222222222222222222";
const jwtSecret = "test-only-jwt-signing-secret";
const validFlight = Flight.hydrate({
  _id: flightId,
  flightNumber: "SG101",
  aircraft: "68a333333333333333333333",
  departureAirport: "68a444444444444444444444",
  arrivalAirport: "68a555555555555555555555",
  scheduledDeparture: new Date("2025-06-01T10:00:00.000Z"),
  scheduledArrival: new Date("2025-06-01T12:00:00.000Z"),
  status: "scheduled",
  durationMinutes: 120,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-02T00:00:00.000Z"),
});

function token(role = "admin"): string {
  return jwt.sign({ role }, jwtSecret, {
    subject: "68a111111111111111111111",
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

test("public flight list rejects invalid date ranges before database access", async () => {
  const response = await fetch(
    `${baseUrl}/api/v1/flights?departureFrom=2025-06-02&departureTo=2025-06-01`,
  );
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("public flight ID lookup rejects malformed IDs and serves a valid record", async (t) => {
  const find = t.mock.method(Flight, "findById", () => ({
    exec: async () => validFlight,
  }) as never);

  const invalid = await fetch(`${baseUrl}/api/v1/flights/invalid-id`);
  assert.equal(invalid.status, 400);
  assert.equal(find.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/flights/${flightId}`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.flightNumber, "SG101");
  assert.equal(body.data.departureAirport, "68a444444444444444444444");
  assert.equal(find.mock.callCount(), 1);
});

test("flight mutations and statistics require admin authorization", async () => {
  const response = await fetch(`${baseUrl}/api/v1/flights/admin/statistics`, {
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
});

test("flight creation rejects identical airports and arrival before departure", async () => {
  const response = await fetch(`${baseUrl}/api/v1/flights`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      flightNumber: "sg101",
      aircraft: "68a333333333333333333333",
      departureAirport: "68a444444444444444444444",
      arrivalAirport: "68a444444444444444444444",
      scheduledDeparture: "2025-06-01T10:00:00.000Z",
      scheduledArrival: "2025-06-01T09:00:00.000Z",
      durationMinutes: 120,
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});