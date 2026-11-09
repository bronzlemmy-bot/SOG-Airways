import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { staffService } from "../../src/modules/staff/services/staff.service.js";

const staffId = "68a222222222222222222222";
const userId = "68a111111111111111111111";
const jwtSecret = "test-only-jwt-signing-secret";

function token(role = "admin"): string {
  return jwt.sign(
    { role, email: "admin@example.test" },
    jwtSecret,
    { subject: userId, expiresIn: "5m" },
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

test("staff management requires admin authorization", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/staff`);
  assert.equal(unauthenticated.status, 401);

  const forbidden = await fetch(`${baseUrl}/api/v1/staff`, {
    headers: { authorization: `Bearer ${token("customer")}` },
  });
  const body = await forbidden.json();
  assert.equal(forbidden.status, 403);
  assert.equal(body.error.code, "INSUFFICIENT_PERMISSIONS");
});

test("GET /api/v1/staff validates queries and returns paginated results", async (t) => {
  const list = t.mock.method(
    staffService,
    "listStaffProfiles",
    async (_filters, pagination) => ({
      items: [],
      pagination: { ...pagination, totalItems: 0, totalPages: 0 },
    }),
  );

  const invalid = await fetch(`${baseUrl}/api/v1/staff?page=0`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(invalid.status, 400);
  assert.equal(list.mock.callCount(), 0);

  const response = await fetch(
    `${baseUrl}/api/v1/staff?page=2&limit=5&department=flight_operations`,
    { headers: { authorization: `Bearer ${token("super_admin")}` } },
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(list.mock.calls[0]?.arguments, [
    { department: "flight_operations" },
    { page: 2, limit: 5 },
  ]);
  assert.equal(body.pagination.page, 2);
});

test("POST /api/v1/staff normalizes validated fields and rejects invalid dates", async (t) => {
  const create = t.mock.method(
    staffService,
    "createStaffProfile",
    async (input) => ({ ...input, id: staffId }),
  );

  const invalid = await fetch(`${baseUrl}/api/v1/staff`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      userId,
      employeeNumber: "A",
      department: "unknown",
      jobTitle: "X",
      hireDate: "2024-02-30",
    }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(create.mock.callCount(), 0);

  const response = await fetch(`${baseUrl}/api/v1/staff`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      userId,
      employeeNumber: " sg-123 ",
      department: "flight_operations",
      jobTitle: " Dispatcher ",
      hireDate: "2020-05-01",
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.deepEqual(create.mock.calls[0]?.arguments[0], {
    userId,
    employeeNumber: "SG-123",
    department: "flight_operations",
    jobTitle: "Dispatcher",
    hireDate: "2020-05-01",
  });
  assert.equal(body.data.id, staffId);
});

test("PATCH validates allowed fields while GET and DELETE validate staff IDs", async (t) => {
  const get = t.mock.method(staffService, "getStaffProfileById", async (id) => ({ id }));
  const update = t.mock.method(staffService, "updateStaffProfile", async (id, input) => ({ id, ...input }));
  const remove = t.mock.method(staffService, "deleteStaffProfile", async () => undefined);

  const invalidGet = await fetch(`${baseUrl}/api/v1/staff/bad-id`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(invalidGet.status, 400);
  assert.equal(get.mock.callCount(), 0);

  const invalidPatch = await fetch(`${baseUrl}/api/v1/staff/${staffId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });
  assert.equal(invalidPatch.status, 400);
  assert.equal(update.mock.callCount(), 0);

  const patch = await fetch(`${baseUrl}/api/v1/staff/${staffId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      employmentStatus: "terminated",
      terminationDate: "2024-01-01",
    }),
  });
  assert.equal(patch.status, 200);
  assert.equal(update.mock.calls[0]?.arguments[0], staffId);

  const deletion = await fetch(`${baseUrl}/api/v1/staff/${staffId}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(deletion.status, 200);
  assert.equal(remove.mock.calls[0]?.arguments[0], staffId);
});
