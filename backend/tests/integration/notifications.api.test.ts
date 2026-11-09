import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { notificationService } from "../../src/modules/notifications/services/notification.service.js";

const userId = "68a111111111111111111111";
const otherUserId = "68a222222222222222222222";
const jwtSecret = "test-only-jwt-signing-secret";
const token = jwt.sign({ role: "customer" }, jwtSecret, { subject: userId, expiresIn: "5m" });
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

test("mine notifications always use the authenticated recipient, ignoring recipient query input", async (t) => {
  const list = t.mock.method(notificationService, "listForRecipient", async () => ({ items: [], pagination: {} }));
  const response = await fetch(`${baseUrl}/api/v1/notifications/mine?recipient=${otherUserId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 200);
  assert.equal(list.mock.calls[0]?.arguments[0], userId);
  assert.equal(list.mock.calls[0]?.arguments[1].recipient, undefined);
});

test("administrative notifications require admin role and safe action URLs", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/notifications`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(forbidden.status, 403);
  const invalid = await fetch(`${baseUrl}/api/v1/notifications`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${jwt.sign({ role: "admin" }, jwtSecret, { subject: userId })}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ recipient: userId, title: "Notice", message: "Hello", actionUrl: "https://example.com" }),
  });
  assert.equal(invalid.status, 400);
});
