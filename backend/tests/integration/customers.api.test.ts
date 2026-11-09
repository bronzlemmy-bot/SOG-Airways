import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { customerService } from "../../src/modules/customers/services/customer.service.js";

const userId = "68a111111111111111111111";
const jwtSecret = "test-only-jwt-signing-secret";

function token(role = "customer"): string {
  return jwt.sign(
    { role, email: "user@example.test" },
    jwtSecret,
    { subject: userId, expiresIn: "5m" },
  );
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

test("GET /api/v1/customers/me requires authentication and returns the caller's profile", async (t) => {
  const getProfile = t.mock.method(
    customerService,
    "getMyProfile",
    async (id) => ({ id }),
  );

  const unauthorized = await fetch(`${baseUrl}/api/v1/customers/me`);
  assert.equal(unauthorized.status, 401);
  assert.equal(getProfile.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/customers/me`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.id, userId);
  assert.equal(getProfile.mock.calls[0]?.arguments[0], userId);
});

test("POST /api/v1/customers/me validates input and passes only supported profile fields", async (t) => {
  const create = t.mock.method(
    customerService,
    "createProfile",
    async (id, input) => ({ id, ...input }),
  );

  const invalid = await fetch(`${baseUrl}/api/v1/customers/me`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ userId, milesBalance: 100000 }),
  });
  const invalidBody = await invalid.json();
  assert.equal(invalid.status, 400);
  assert.equal(invalidBody.error.code, "VALIDATION_ERROR");
  assert.equal(create.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/customers/me`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      loyaltyNumber: " sog-123 ",
      preferredCurrency: "usd",
      preferredCabinClass: "business",
      marketingConsent: true,
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.data.id, userId);
  assert.deepEqual(create.mock.calls[0]?.arguments, [
    userId,
    {
      loyaltyNumber: "SOG-123",
      preferredCurrency: "USD",
      preferredCabinClass: "business",
      marketingConsent: true,
    },
  ]);
});

test("PATCH /api/v1/customers/me rejects empty updates and normalizes currency", async (t) => {
  const update = t.mock.method(
    customerService,
    "updateMyProfile",
    async (id, input) => ({ id, ...input }),
  );

  const invalid = await fetch(`${baseUrl}/api/v1/customers/me`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ loyaltyTier: "platinum", milesBalance: 9000 }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(update.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/customers/me`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ preferredCurrency: " eur " }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.preferredCurrency, "EUR");
  assert.deepEqual(update.mock.calls[0]?.arguments, [
    userId,
    { preferredCurrency: "EUR" },
  ]);
});

test("administrator-only customer routes deny customers and accept administrators", async (t) => {
  const list = t.mock.method(
    customerService,
    "listProfiles",
    async (_filters, pagination) => ({
      items: [],
      pagination: {
        ...pagination,
        totalItems: 0,
        totalPages: 0,
      },
    }),
  );
  const count = t.mock.method(customerService, "countProfiles", async () => 0);

  const customerResponse = await fetch(`${baseUrl}/api/v1/customers/`);
  const customerBody = await customerResponse.json();
  assert.equal(customerResponse.status, 401);
  assert.equal(list.mock.callCount(), 0);

  const forbiddenResponse = await fetch(`${baseUrl}/api/v1/customers/`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const forbiddenBody = await forbiddenResponse.json();
  assert.equal(forbiddenResponse.status, 403);
  assert.equal(forbiddenBody.error.code, "INSUFFICIENT_PERMISSIONS");
  assert.equal(list.mock.callCount(), 0);
  assert.equal(customerBody.error.code, "AUTHENTICATION_REQUIRED");

  const adminResponse = await fetch(`${baseUrl}/api/v1/customers/?page=2&limit=5&loyaltyTier=gold`, {
    headers: { authorization: `Bearer ${token("admin")}` },
  });
  const adminBody = await adminResponse.json();
  assert.equal(adminResponse.status, 200);
  assert.equal(list.mock.callCount(), 1);
  assert.deepEqual(list.mock.calls[0]?.arguments, [
    { loyaltyTier: "gold" },
    { page: 2, limit: 5 },
  ]);

  const countResponse = await fetch(`${baseUrl}/api/v1/customers/count`, {
    headers: { authorization: `Bearer ${token("admin")}` },
  });
  const countBody = await countResponse.json();
  assert.equal(countResponse.status, 200);
  assert.equal(countBody.data.total, 0);
  assert.equal(count.mock.callCount(), 1);
  assert.equal(adminBody.pagination.page, 2);
});

test("loyalty availability normalizes values and no profile deletion route is exposed", async (t) => {
  const available = t.mock.method(
    customerService,
    "isLoyaltyNumberAvailable",
    async () => true,
  );

  const invalid = await fetch(`${baseUrl}/api/v1/customers/loyalty-number/availability`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(invalid.status, 400);
  assert.equal(available.mock.callCount(), 0);

  const response = await fetch(
    `${baseUrl}/api/v1/customers/loyalty-number/availability?loyaltyNumber=%20sog-123%20`,
    { headers: { authorization: `Bearer ${token()}` } },
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body.data, { loyaltyNumber: "SOG-123", available: true });
  assert.equal(available.mock.calls[0]?.arguments[0], "SOG-123");

  const deleteResponse = await fetch(`${baseUrl}/api/v1/customers/me`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token()}` },
  });
  const deleteBody = await deleteResponse.json();
  assert.equal(deleteResponse.status, 404);
  assert.equal(deleteBody.error.code, "ROUTE_NOT_FOUND");
});

test("customer profile endpoints reject malformed pagination query parameters", async () => {
  const response = await fetch(`${baseUrl}/api/v1/customers/?page=0`, {
    headers: { authorization: `Bearer ${token("admin")}` },
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});
