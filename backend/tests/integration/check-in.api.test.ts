import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { customerService } from "../../src/modules/customers/services/customer.service.js";
import { checkInService } from "../../src/modules/check-in/services/check-in.service.js";
import { ApiError } from "../../src/utils/api-error.js";
import { checkInCustomerId, checkInTicketId } from "../fixtures/check-in.fixture.js";

const jwtSecret = "test-only-jwt-signing-secret";
const token = (role = "customer") => jwt.sign({ role, customerId: checkInCustomerId }, jwtSecret, { subject: checkInCustomerId, expiresIn: "5m" });
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

test("my-check-ins rejects authenticated accounts without a linked customer profile", async (t) => {
  const getProfileId = t.mock.method(
    customerService,
    "getProfileIdForUser",
    async () => {
      throw new ApiError("Customer profile not found.", 404, {
        code: "CUSTOMER_PROFILE_NOT_FOUND",
      });
    },
  );
  const getCustomerCheckIns = t.mock.method(checkInService, "getCustomerCheckIns", async () => []);
  const response = await fetch(`${baseUrl}/api/v1/check-in/my-check-ins`, {
    headers: { authorization: `Bearer ${token()}` },
  });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error.code, "CUSTOMER_PROFILE_NOT_FOUND");
  assert.equal(getProfileId.mock.calls[0]?.arguments[0], checkInCustomerId);
  assert.equal(getCustomerCheckIns.mock.callCount(), 0);
});

test("administrative check-in creation is restricted and validates identifiers", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/check-in`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ ticket: checkInTicketId }),
  });
  assert.equal(forbidden.status, 403);
  const invalid = await fetch(`${baseUrl}/api/v1/check-in`, {
    method: "POST",
    headers: { authorization: `Bearer ${token("admin")}`, "content-type": "application/json" },
    body: JSON.stringify({ booking: "bad", ticket: "bad", passenger: "bad", flight: "bad", customer: "bad" }),
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, "VALIDATION_ERROR");
});
