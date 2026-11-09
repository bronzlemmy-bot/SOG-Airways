import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";

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

test("passenger directory requires administrator authorization", async () => {
  const response = await fetch(`${baseUrl}/api/v1/passengers`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await response.json();
  assert.equal(response.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
});

test("passenger creation rejects invalid IDs, dates, and document relationships", async () => {
  const response = await fetch(`${baseUrl}/api/v1/passengers`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      customer: "bad-id",
      firstName: "Avery",
      lastName: "Example",
      dateOfBirth: "2999-01-01",
      nationality: "US",
      documentNumber: "P123",
      specialAssistanceRequired: false,
      specialAssistanceNotes: "Wheelchair",
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("passenger lookups require authentication and validate customer IDs", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/passengers/not-an-id`);
  assert.equal(unauthenticated.status, 401);
  const invalid = await fetch(`${baseUrl}/api/v1/passengers/customer/not-an-id`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const body = await invalid.json();
  assert.equal(invalid.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});
