import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

import { app } from "../../src/app.js";
import { authService } from "../../src/modules/auth/services/auth.service.js";
import type { AuthResult } from "../../src/modules/auth/types/auth.types.js";

const authResult: AuthResult = {
  user: {
    id: "68a111111111111111111111",
    firstName: "Avery",
    lastName: "Example",
    email: "avery@example.test",
    role: "customer",
    status: "active",
    emailVerifiedAt: "2025-01-01T00:00:00.000Z",
  },
  tokens: {
    accessToken: "stubbed-access-token",
    tokenType: "Bearer",
    expiresInSeconds: 900,
  },
};
const jwtSecret = "test-only-jwt-signing-secret";

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

test("POST /api/v1/auth/register returns a safe created-account response", async (t) => {
  let receivedEmail: string | undefined;
  t.mock.method(authService, "register", async (input) => {
    receivedEmail = input.email;
    return {
      email: input.email,
      verificationRequired: true,
    };
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Avery",
      lastName: "Example",
      email: " AVERY@EXAMPLE.TEST ",
      password: "Correct-Horse-Battery-7",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(receivedEmail, "avery@example.test");
  assert.equal(body.success, true);
  assert.equal(body.data.email, "avery@example.test");
  assert.equal(body.data.verificationRequired, true);
  assert.equal("tokens" in body.data, false);
});

test("registration rejects privileged role assignment before calling the service", async (t) => {
  const register = t.mock.method(authService, "register", async () => ({
    email: "avery@example.test",
    verificationRequired: true,
  }));

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Avery",
      lastName: "Example",
      email: "avery@example.test",
      password: "Correct-Horse-Battery-7",
      role: "admin",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(register.mock.callCount(), 0);
});

test("registration accepts and validates supported account profile fields", async (t) => {
  let receivedInput: Parameters<typeof authService.register>[0] | undefined;
  t.mock.method(authService, "register", async (input) => {
    receivedInput = input;
    return {
      email: input.email,
      verificationRequired: true,
    };
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Avery",
      middleName: "Quinn",
      lastName: "Example",
      email: "avery@example.test",
      password: "Correct-Horse-Battery-7",
      phoneNumber: "+15555550123",
      dateOfBirth: "1990-04-15",
      gender: "prefer-not-to-say",
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(receivedInput?.middleName, "Quinn");
  assert.equal(receivedInput?.phoneNumber, "+15555550123");
  assert.equal(receivedInput?.dateOfBirth?.toISOString(), "1990-04-15T00:00:00.000Z");
  assert.equal(receivedInput?.gender, "prefer-not-to-say");
});

test("POST /api/v1/auth/login returns the service result for valid input", async (t) => {
  let receivedEmail: string | undefined;
  t.mock.method(authService, "login", async (input) => {
    receivedEmail = input.email;
    return authResult;
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: " AVERY@EXAMPLE.TEST ",
      password: "Correct-Horse-Battery-7",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(receivedEmail, "avery@example.test");
  assert.equal(body.success, true);
  assert.equal(body.data.tokens.tokenType, "Bearer");
});

test("GET /api/v1/auth/me returns the authenticated account summary", async (t) => {
  let receivedUserId: string | undefined;
  t.mock.method(authService, "getCurrentUser", async (userId) => {
    receivedUserId = userId;
    return authResult.user;
  });
  const token = jwt.sign(
    {
      role: "customer",
      email: authResult.user.email,
      emailVerified: true,
    },
    jwtSecret,
    {
      subject: authResult.user.id,
      issuer: "sog-airways-api",
      audience: "sog-airways-client",
      expiresIn: "5m",
    },
  );

  const response = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(receivedUserId, authResult.user.id);
  assert.deepEqual(body.data, authResult.user);
});

test("authenticated customer tokens marked unverified cannot reach protected routes", async (t) => {
  const getCurrentUser = t.mock.method(
    authService,
    "getCurrentUser",
    async () => authResult.user,
  );
  const token = jwt.sign(
    {
      role: "customer",
      email: authResult.user.email,
      emailVerified: false,
    },
    jwtSecret,
    {
      subject: authResult.user.id,
      issuer: "sog-airways-api",
      audience: "sog-airways-client",
      expiresIn: "5m",
    },
  );

  const response = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error.code, "EMAIL_NOT_VERIFIED");
  assert.equal(getCurrentUser.mock.callCount(), 0);
});

test("POST /api/v1/auth/verify-email validates and passes the OTP", async (t) => {
  let receivedInput:
    | Parameters<typeof authService.verifyEmail>[0]
    | undefined;
  t.mock.method(authService, "verifyEmail", async (input) => {
    receivedInput = input;
    return { email: input.email, verified: true };
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: " Avery@Example.test ",
      code: "004291",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(receivedInput, {
    email: "avery@example.test",
    code: "004291",
  });
  assert.equal(body.data.verified, true);
});

test("email verification rejects malformed OTPs before calling the service", async (t) => {
  const verify = t.mock.method(authService, "verifyEmail", async () => ({
    email: "avery@example.test",
    verified: true,
  }));

  const response = await fetch(`${baseUrl}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "avery@example.test",
      code: "12345",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(verify.mock.callCount(), 0);
});

test("POST /api/v1/auth/resend-verification returns an enumeration-safe response", async (t) => {
  let receivedEmail: string | undefined;
  t.mock.method(
    authService,
    "resendVerificationEmail",
    async (input) => {
      receivedEmail = input.email;
    },
  );

  const response = await fetch(
    `${baseUrl}/api/v1/auth/resend-verification`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: " Avery@Example.test " }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(receivedEmail, "avery@example.test");
  assert.match(body.message, /if the address is eligible/i);
});

test("GET /api/v1/auth/me rejects requests without a bearer token", async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/me`);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error.code, "AUTHENTICATION_REQUIRED");
});

test("login rejects malformed credentials before calling the service", async (t) => {
  const login = t.mock.method(authService, "login", async () => authResult);

  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "not-an-email",
      password: "",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(login.mock.callCount(), 0);
});