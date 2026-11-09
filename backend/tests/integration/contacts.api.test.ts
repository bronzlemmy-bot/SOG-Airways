import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { contactService } from "../../src/modules/contacts/services/contact.service.js";

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

test("public contact submissions validate and normalize input before service invocation", async (t) => {
  const create = t.mock.method(contactService, "createContact", async (input) => ({
    ...input,
    reference: "SOG-CON-20250101-ABC123",
  }));
  const invalid = await fetch(`${baseUrl}/api/v1/contacts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "A", email: "bad", subject: "x", message: "short" }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(create.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/contacts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Alex Example",
      email: "ALEX@EXAMPLE.COM",
      subject: "Booking question",
      message: "I need help with my reservation.",
    }),
  });
  assert.equal(response.status, 201);
  assert.equal(create.mock.calls[0]?.arguments[0].email, "alex@example.com");
});

test("contact administration requires an admin role", async () => {
  const response = await fetch(`${baseUrl}/api/v1/contacts`, {
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, "INSUFFICIENT_PERMISSIONS");
});
