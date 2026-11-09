import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";

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

test("trip administration requires staff and rejects invalid trip payloads", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/trips`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(forbidden.status, 403);
  const invalid = await fetch(`${baseUrl}/api/v1/trips`, {
    method: "POST",
    headers: { authorization: `Bearer ${token("staff")}`, "content-type": "application/json" },
    body: JSON.stringify({ customer: "bad" }),
  });
  assert.equal(invalid.status, 400);
});
