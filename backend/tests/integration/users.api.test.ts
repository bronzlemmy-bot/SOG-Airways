import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { userService } from "../../src/modules/users/services/user.service.js";

const ownerId = "68a111111111111111111111";
const otherId = "68a222222222222222222222";
const jwtSecret = "test-only-jwt-signing-secret";

function token(subject: string, role = "customer"): string {
  return jwt.sign(
    { role, email: "user@example.test" },
    jwtSecret,
    { subject, expiresIn: "5m" },
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

test("POST /api/v1/users creates a customer and normalizes validated input", async (t) => {
  let receivedEmail: string | undefined;
  t.mock.method(userService, "createCustomerUser", async (input) => {
    receivedEmail = input.email;
    return {
      id: ownerId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: "customer",
    };
  });

  const response = await fetch(`${baseUrl}/api/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: " Avery ",
      lastName: " Example ",
      email: " AVERY@EXAMPLE.TEST ",
      password: "correct-horse-battery",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.equal(receivedEmail, "avery@example.test");
  assert.equal(body.data.role, "customer");
});

test("POST /api/v1/users rejects invalid or privileged registration input without service calls", async (t) => {
  const createUser = t.mock.method(
    userService,
    "createCustomerUser",
    async () => ({ id: ownerId }),
  );

  const invalidResponse = await fetch(`${baseUrl}/api/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: " ",
      lastName: "Example",
      email: "bad-email",
      password: "short",
      unrecognized: true,
    }),
  });
  const invalidBody = await invalidResponse.json();

  assert.equal(invalidResponse.status, 400);
  assert.equal(invalidBody.error.code, "VALIDATION_ERROR");

  const privilegedResponse = await fetch(`${baseUrl}/api/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Avery",
      lastName: "Example",
      email: "avery@example.test",
      password: "correct-horse-battery",
      role: "admin",
    }),
  });
  const privilegedBody = await privilegedResponse.json();

  assert.equal(privilegedResponse.status, 400);
  assert.equal(privilegedBody.error.code, "VALIDATION_ERROR");
  assert.equal(createUser.mock.callCount(), 0);
});

test("GET /api/v1/users/:id requires a valid authenticated owner", async (t) => {
  const getUser = t.mock.method(userService, "getUserById", async (id) => ({
    id,
    firstName: "Avery",
  }));

  const unauthenticated = await fetch(`${baseUrl}/api/v1/users/${ownerId}`);
  assert.equal(unauthenticated.status, 401);

  const invalidId = await fetch(`${baseUrl}/api/v1/users/not-an-id`, {
    headers: { authorization: `Bearer ${token(ownerId)}` },
  });
  assert.equal(invalidId.status, 400);

  const response = await fetch(`${baseUrl}/api/v1/users/${ownerId}`, {
    headers: { authorization: `Bearer ${token(ownerId)}` },
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.id, ownerId);
  assert.equal(getUser.mock.callCount(), 1);
});

test("GET /api/v1/users/:id forbids another customer but permits administrators", async (t) => {
  const getUser = t.mock.method(userService, "getUserById", async (id) => ({
    id,
    firstName: "Avery",
  }));

  const forbidden = await fetch(`${baseUrl}/api/v1/users/${otherId}`, {
    headers: { authorization: `Bearer ${token(ownerId)}` },
  });
  const forbiddenBody = await forbidden.json();
  assert.equal(forbidden.status, 403);
  assert.equal(forbiddenBody.error.code, "INSUFFICIENT_PERMISSIONS");
  assert.equal(getUser.mock.callCount(), 0);

  const admin = await fetch(`${baseUrl}/api/v1/users/${otherId}`, {
    headers: { authorization: `Bearer ${token(ownerId, "admin")}` },
  });
  assert.equal(admin.status, 200);
  assert.equal(getUser.mock.callCount(), 1);
});

test("PATCH /api/v1/users/:id updates only validated, permitted profile fields", async (t) => {
  const updateUser = t.mock.method(
    userService,
    "updateUserProfile",
    async (id, input) => ({ id, ...input }),
  );

  const response = await fetch(`${baseUrl}/api/v1/users/${ownerId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token(ownerId)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ firstName: " Avery ", role: "admin" }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(updateUser.mock.callCount(), 0);

  const successful = await fetch(`${baseUrl}/api/v1/users/${ownerId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token(ownerId)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ firstName: " Avery " }),
  });
  const successfulBody = await successful.json();

  assert.equal(successful.status, 200);
  assert.equal(successfulBody.data.firstName, "Avery");
  assert.equal(updateUser.mock.callCount(), 1);
  assert.equal(updateUser.mock.calls[0]?.arguments[0], ownerId);
  assert.deepEqual(updateUser.mock.calls[0]?.arguments[1], {
    firstName: "Avery",
  });
});

test("PATCH /api/v1/users/:id rejects updates to another customer's profile", async (t) => {
  const updateUser = t.mock.method(
    userService,
    "updateUserProfile",
    async (id) => ({ id }),
  );

  const response = await fetch(`${baseUrl}/api/v1/users/${otherId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token(ownerId)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ firstName: "Changed" }),
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
  assert.equal(updateUser.mock.callCount(), 0);
});
