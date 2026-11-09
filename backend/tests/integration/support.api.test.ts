import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { supportService } from "../../src/modules/support/services/support.service.js";

const jwtSecret = "test-only-jwt-signing-secret";
const token = jwt.sign({ role: "customer" }, jwtSecret, { subject: "68a111111111111111111111", expiresIn: "5m" });
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

test("support endpoints reject unauthenticated access and malformed case data", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/support`);
  assert.equal(unauthenticated.status, 401);
  const invalid = await fetch(`${baseUrl}/api/v1/support`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ subject: "", description: "" }),
  });
  assert.equal(invalid.status, 400);
});

test("authenticated support listing uses the middleware user context", async (t) => {
  const list = t.mock.method(
    supportService,
    "listCases",
    async (_filters, requesterId, isStaff) => {
      assert.equal(requesterId, "68a111111111111111111111");
      assert.equal(isStaff, false);
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },
  );
  const response = await fetch(`${baseUrl}/api/v1/support`, {
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(response.status, 200);
  assert.equal(list.mock.callCount(), 1);
});
