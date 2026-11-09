import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { Aircraft } from "../../src/modules/aircraft/models/aircraft.model.js";

const aircraftId = "68a222222222222222222222";
const userId = "68a111111111111111111111";
const jwtSecret = "test-only-jwt-signing-secret";
const fakeAircraft = Aircraft.hydrate({
  _id: aircraftId,
  registrationNumber: "N123SG",
  manufacturer: "Example Aircraft",
  model: "A100",
  aircraftType: "narrow_body",
  manufactureYear: 2020,
  capacity: { economy: 100, premiumEconomy: 20, business: 10, first: 0, total: 130 },
  rangeKilometers: 6000,
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-02T00:00:00.000Z"),
});

function token(role = "admin"): string {
  return jwt.sign({ role }, jwtSecret, { subject: userId, expiresIn: "5m" });
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

test("aircraft list rejects invalid filters before database access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/aircraft?minRangeKilometers=100&maxRangeKilometers=50`);
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("public aircraft lookup validates IDs and returns a found record", async (t) => {
  const find = t.mock.method(Aircraft, "findById", () => ({
    exec: async () => fakeAircraft,
  }) as never);

  const invalid = await fetch(`${baseUrl}/api/v1/aircraft/not-an-id`);
  assert.equal(invalid.status, 400);
  assert.equal(find.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/aircraft/${aircraftId}`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.registrationNumber, "N123SG");
  assert.equal(find.mock.callCount(), 1);
});

test("aircraft management endpoints reject non-admins before service access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/aircraft/admin/statistics`, {
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
});

test("aircraft create validation rejects inconsistent seating capacities", async () => {
  const response = await fetch(`${baseUrl}/api/v1/aircraft`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      registrationNumber: "N123SG",
      manufacturer: "Example Aircraft",
      model: "A100",
      aircraftType: "narrow_body",
      manufactureYear: 2020,
      capacity: {
        economy: 100,
        premiumEconomy: 20,
        business: 10,
        first: 0,
        total: 140,
      },
      rangeKilometers: 6000,
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});
