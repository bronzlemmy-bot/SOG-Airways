import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { conversationRepository } from "../../src/modules/messages/repositories/conversation.repository.js";

const userId = "68a111111111111111111111";
const otherId = "68a222222222222222222222";
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

test("authenticated user can create conversation and creator is included by service", async (t) => {
  const create = t.mock.method(conversationRepository, "create", async (input) => input);
  const response = await fetch(`${baseUrl}/api/v1/conversations`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ subject: "Booking support", participants: [otherId] }),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(create.mock.calls[0]?.arguments[0].participants, [otherId, userId]);
});

test("message operations require authentication and validate payloads", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/messages`);
  assert.equal(unauthenticated.status, 401);
  const invalid = await fetch(`${baseUrl}/api/v1/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ conversationId: "bad", body: "" }),
  });
  assert.equal(invalid.status, 400);
});

test("message delivery state changes are restricted to staff", async () => {
  const response = await fetch(`${baseUrl}/api/v1/messages/68a444444444444444444444/delivered`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  assert.equal(response.status, 403);
});
