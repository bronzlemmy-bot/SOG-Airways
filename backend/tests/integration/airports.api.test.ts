import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { airportService } from "../../src/modules/airports/services/airport.service.js";

const airportId = "68a222222222222222222222";
const userId = "68a111111111111111111111";
const jwtSecret = "test-only-jwt-signing-secret";

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

test("public airport list validates filters and returns paginated results", async (t) => {
  const list = t.mock.method(
    airportService,
    "listAirports",
    async (_filters, pagination) => ({
      items: [],
      pagination: { ...pagination, totalItems: 0, totalPages: 0 },
    }),
  );
  const invalid = await fetch(`${baseUrl}/api/v1/airports?page=0`);
  assert.equal(invalid.status, 400);
  assert.equal(list.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/airports?airportCode=jfk&limit=5`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(list.mock.calls[0]?.arguments, [
    { airportCode: "JFK" },
    { page: 1, limit: 5 },
  ]);
  assert.equal(body.pagination.limit, 5);
});

test("airport reads are public and normalize airport codes", async (t) => {
  const byCode = t.mock.method(airportService, "getAirportByCode", async (code) => ({ airportCode: code }));
  const byId = t.mock.method(airportService, "getAirportById", async (id) => ({ id }));

  const lookup = await fetch(`${baseUrl}/api/v1/airports/code/jfk`);
  const lookupBody = await lookup.json();
  assert.equal(lookup.status, 200);
  assert.equal(lookupBody.data.airportCode, "JFK");
  assert.equal(byCode.mock.calls[0]?.arguments[0], "JFK");

  const idResponse = await fetch(`${baseUrl}/api/v1/airports/${airportId}`);
  assert.equal(idResponse.status, 200);
  assert.equal(byId.mock.calls[0]?.arguments[0], airportId);
});

test("airport create and update require admin and pass validated input", async (t) => {
  const create = t.mock.method(airportService, "createAirport", async (input) => ({ ...input, id: airportId }));
  const update = t.mock.method(airportService, "updateAirport", async (id, input) => ({ id, ...input }));

  const denied = await fetch(`${baseUrl}/api/v1/airports`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("customer")}`,
      "content-type": "application/json",
    },
    body: "{}",
  });
  assert.equal(denied.status, 403);
  assert.equal(create.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/airports`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      airportCode: " jfk ",
      icaoCode: " kjfk ",
      name: " JFK International ",
      city: " New York ",
      country: " United States ",
      countryCode: " us ",
      timezone: "America/New_York",
      coordinates: { latitude: 40.6, longitude: -73.7 },
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.deepEqual(create.mock.calls[0]?.arguments[0], {
    airportCode: "JFK",
    icaoCode: "KJFK",
    name: "JFK International",
    city: "New York",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    coordinates: { latitude: 40.6, longitude: -73.7 },
  });
  assert.equal(body.data.id, airportId);

  const invalid = await fetch(`${baseUrl}/api/v1/airports/${airportId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ coordinates: { latitude: 91, longitude: 0 } }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(update.mock.callCount(), 0);

  const patched = await fetch(`${baseUrl}/api/v1/airports/${airportId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "inactive" }),
  });
  assert.equal(patched.status, 200);
  assert.deepEqual(update.mock.calls[0]?.arguments, [
    airportId,
    { status: "inactive" },
  ]);
});

test("airport administration routes require authorization and validate delete IDs", async (t) => {
  const count = t.mock.method(airportService, "countAirports", async () => 9);
  const remove = t.mock.method(airportService, "deleteAirport", async () => undefined);

  const unauthorized = await fetch(`${baseUrl}/api/v1/airports/count`);
  assert.equal(unauthorized.status, 401);
  const countResponse = await fetch(`${baseUrl}/api/v1/airports/count`, {
    headers: { authorization: `Bearer ${token("super_admin")}` },
  });
  const countBody = await countResponse.json();
  assert.equal(countResponse.status, 200);
  assert.equal(countBody.data.total, 9);
  assert.equal(count.mock.callCount(), 1);

  const invalid = await fetch(`${baseUrl}/api/v1/airports/not-an-id`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(invalid.status, 400);
  assert.equal(remove.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/airports/${airportId}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(response.status, 200);
  assert.equal(remove.mock.calls[0]?.arguments[0], airportId);
});
