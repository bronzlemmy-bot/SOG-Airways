import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { authService } from "../../src/modules/auth/services/auth.service.js";
import { newsletterService } from "../../src/modules/newsletters/services/newsletter.service.js";

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

test("public subscription endpoint validates consent and normalizes email", async (t) => {
  const subscribe = t.mock.method(newsletterService, "subscribe", async (input) => input);
  const invalid = await fetch(`${baseUrl}/api/v1/newsletters/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "alex@example.com" }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(subscribe.mock.callCount(), 0);
  const response = await fetch(`${baseUrl}/api/v1/newsletters/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "ALEX@EXAMPLE.COM", consentGiven: true }),
  });
  assert.equal(response.status, 201);
  assert.equal(subscribe.mock.calls[0]?.arguments[0].email, "alex@example.com");
});

test("subscription management requires staff authorization", async () => {
  const response = await fetch(`${baseUrl}/api/v1/newsletters`, {
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  assert.equal(response.status, 403);
});

test("newsletter unsubscribe requires an authenticated verified owner", async (t) => {
  const unauthenticated = await fetch(
    `${baseUrl}/api/v1/newsletters/unsubscribe`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "alex@example.com" }),
    },
  );
  assert.equal(unauthenticated.status, 401);

  const getCurrentUser = t.mock.method(
    authService,
    "getCurrentUser",
    async (id) => ({
      id,
      firstName: "Alex",
      lastName: "Example",
      email: "verified@example.com",
      role: "customer" as const,
      status: "active" as const,
      emailVerifiedAt: "2025-01-01T00:00:00.000Z",
    }),
  );
  const unsubscribe = t.mock.method(
    newsletterService,
    "unsubscribeByEmail",
    async () => {
      throw new Error("Unsubscribe must not run for a different email.");
    },
  );
  const forbidden = await fetch(
    `${baseUrl}/api/v1/newsletters/unsubscribe`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token()}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: "victim@example.com" }),
    },
  );

  assert.equal(forbidden.status, 403);
  assert.equal(
    (await forbidden.json()).error.code,
    "NEWSLETTER_EMAIL_OWNERSHIP_REQUIRED",
  );
  assert.equal(getCurrentUser.mock.callCount(), 1);
  assert.equal(unsubscribe.mock.callCount(), 0);
});
