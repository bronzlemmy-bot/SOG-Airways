import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { contentService } from "../../src/modules/content/services/content.service.js";

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

test("public content listing delegates with validated defaults", async (t) => {
  const listPublic = t.mock.method(contentService, "listPublic", async (query) => ({
    items: [],
    pagination: { page: query.page ?? 1, limit: query.limit ?? 20, total: 0, totalPages: 0 },
  }));
  const response = await fetch(`${baseUrl}/api/v1/content/public`);
  assert.equal(response.status, 200);
  assert.deepEqual(listPublic.mock.calls[0]?.arguments[0], { page: 1, limit: 20 });
  assert.deepEqual((await response.json()).data, []);
});

test("content management rejects non-admin access and malformed public query", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/content`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(forbidden.status, 403);
  const invalidQuery = await fetch(`${baseUrl}/api/v1/content/public?limit=101`);
  assert.equal(invalidQuery.status, 400);
});
