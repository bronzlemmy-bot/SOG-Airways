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

test("payment creation requires authentication and rejects invalid payment input", async () => {
  const unauthorized = await fetch(`${baseUrl}/api/v1/payments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(unauthorized.status, 401);

  const invalid = await fetch(`${baseUrl}/api/v1/payments`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("admin")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      booking: "68a222222222222222222222",
      customer: "68a111111111111111111111",
      amount: 0,
      method: "credit_card",
    }),
  });
  const body = await invalid.json();
  assert.equal(invalid.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("payment lists and reporting endpoints require administrator roles", async () => {
  const list = await fetch(`${baseUrl}/api/v1/payments`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  const listBody = await list.json();
  assert.equal(list.status, 403);
  assert.equal(listBody.error.code, "INSUFFICIENT_PERMISSIONS");

  const reports = await fetch(`${baseUrl}/api/v1/payments/statistics`, {
    headers: { authorization: `Bearer ${token("staff")}` },
  });
  assert.equal(reports.status, 403);
});

test("refund request validates identifiers and input without invoking a gateway", async () => {
  const response = await fetch(`${baseUrl}/api/v1/payments/not-an-id/refund`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token("admin")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ amount: -1 }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});
