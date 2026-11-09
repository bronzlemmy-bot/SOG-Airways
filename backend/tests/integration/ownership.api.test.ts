import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { customerService } from "../../src/modules/customers/services/customer.service.js";
import { passengerService } from "../../src/modules/passengers/services/passenger.service.js";
import { checkInService } from "../../src/modules/check-in/services/check-in.service.js";
import { ApiError } from "../../src/utils/api-error.js";
import {
  checkInCustomerId,
  checkInId,
} from "../fixtures/check-in.fixture.js";

const userId = "68a111111111111111111111";
const otherCustomerId = "68a888888888888888888888";
const token = jwt.sign(
  { role: "customer" },
  "test-only-jwt-signing-secret",
  { subject: userId, expiresIn: "5m" },
);
const authorization = `Bearer ${token}`;
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
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("customer passenger listing rejects a caller-supplied foreign profile", async (t) => {
  const getProfileId = t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => checkInCustomerId,
  );
  const list = t.mock.method(
    passengerService,
    "getPassengersByCustomer",
    async () => [],
  );

  const response = await fetch(
    `${baseUrl}/api/v1/passengers/customer/${otherCustomerId}`,
    { headers: { authorization } },
  );

  assert.equal(response.status, 404);
  assert.equal(getProfileId.mock.calls[0]?.arguments[0], userId);
  assert.equal(list.mock.callCount(), 0);
});

test("customer passenger creation rejects a foreign customer ID", async (t) => {
  t.mock.method(customerService, "getProfileIdForUser", async () => checkInCustomerId);
  const create = t.mock.method(
    passengerService,
    "createPassenger",
    async () => {
      throw new Error("Passenger creation must not run for a foreign profile.");
    },
  );

  const response = await fetch(`${baseUrl}/api/v1/passengers`, {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      customer: otherCustomerId,
      firstName: "Avery",
      lastName: "Example",
      dateOfBirth: "1990-01-01",
      nationality: "US",
      specialAssistanceRequired: false,
    }),
  });

  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, "CUSTOMER_OWNERSHIP_REQUIRED");
  assert.equal(create.mock.callCount(), 0);
});

test("check-in reads are passed the authenticated user's resolved customer profile", async (t) => {
  const getProfileId = t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => checkInCustomerId,
  );
  const getById = t.mock.method(
    checkInService,
    "getCheckInById",
    async (_id: string, ownerId?: string) => {
      assert.equal(ownerId, checkInCustomerId);
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    },
  );

  const response = await fetch(
    `${baseUrl}/api/v1/check-in/${checkInId}`,
    { headers: { authorization } },
  );

  assert.equal(response.status, 404);
  assert.equal(getProfileId.mock.calls[0]?.arguments[0], userId);
  assert.equal(getById.mock.calls[0]?.arguments[1], checkInCustomerId);
});
