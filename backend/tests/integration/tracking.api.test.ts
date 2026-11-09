import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { trackingService } from "../../src/modules/tracking/services/tracking.service.js";
import type { FlightTrackingResponse } from "../../src/integrations/tracking/flight-tracking.provider.js";

const jwtSecret = "test-only-jwt-signing-secret";
const token = (role = "customer") => jwt.sign({ role }, jwtSecret, { subject: "68a111111111111111111111", expiresIn: "5m" });
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
  if (server.listening) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("public tracking list returns validated pagination", async (t) => {
  const list = t.mock.method(trackingService, "listTracking", async (query) => ({
    items: [],
    pagination: { page: query.page ?? 1, limit: query.limit ?? 20, total: 0, totalPages: 0 },
  }));
  const response = await fetch(`${baseUrl}/api/v1/tracking?page=2&limit=5`);
  assert.equal(response.status, 200);
  assert.equal(list.mock.calls[0]?.arguments[0].page, 2);
  assert.equal(list.mock.calls[0]?.arguments[0].limit, 5);
});

test("flight-number lookup accepts a flight number and returns disabled-provider status", async (t) => {
  const unavailable: FlightTrackingResponse = {
    success: false,
    provider: "disabled",
    status: "unavailable",
    message: "No external flight tracking provider is configured.",
    flight: {
      flightNumber: "SOG101",
      departureAirport: "JFK",
      arrivalAirport: "LHR",
      status: "unavailable",
      lastUpdated: new Date("2030-01-01T10:00:00.000Z"),
      source: "disabled",
    },
  };
  const lookup = t.mock.method(
    trackingService,
    "getTracking",
    async () => unavailable as never,
  );
  const response = await fetch(
    `${baseUrl}/api/v1/tracking/flight/SOG101`,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.status, "unavailable");
  assert.equal(body.data.provider, "disabled");
  assert.equal(
    lookup.mock.calls[0]?.arguments[0].flightNumber,
    "SOG101",
  );
});

test("tracking mutations require trusted staff and validate flight identifiers", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/tracking`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(forbidden.status, 403);
  const invalid = await fetch(`${baseUrl}/api/v1/tracking/bad/position`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token("staff")}`, "content-type": "application/json" },
    body: JSON.stringify({ latitude: 0, longitude: 0 }),
  });
  assert.equal(invalid.status, 400);
});
