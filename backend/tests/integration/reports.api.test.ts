import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { reportService } from "../../src/modules/reports/services/report.service.js";

const userId = "68a111111111111111111111";
const spoofedId = "68a222222222222222222222";
const jwtSecret = "test-only-jwt-signing-secret";
const token = (role = "customer") => jwt.sign({ role }, jwtSecret, { subject: userId, expiresIn: "5m" });
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

test("report creation uses authenticated user rather than client-supplied requester", async (t) => {
  const create = t.mock.method(reportService, "create", async (input) => input);
  const response = await fetch(`${baseUrl}/api/v1/reports`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ title: "Revenue", type: "revenue", requestedBy: spoofedId }),
  });
  assert.equal(response.status, 201);
  assert.equal(create.mock.calls[0]?.arguments[0].requestedBy, userId);
});

test("report administration is admin-only and invalid report data is rejected", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/reports`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(forbidden.status, 403);
  const invalid = await fetch(`${baseUrl}/api/v1/reports`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ title: "Revenue", type: "unknown" }),
  });
  assert.equal(invalid.status, 400);
});
