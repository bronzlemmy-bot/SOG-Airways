import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { ApiError } from "../../src/utils/api-error.js";
import { User } from "../../src/modules/users/models/user.model.js";
import { userRepository } from "../../src/modules/users/repositories/user.repository.js";
import { userService } from "../../src/modules/users/services/user.service.js";
import {
  authService,
  createAuthService,
} from "../../src/modules/auth/services/auth.service.js";
import type { EmailMessage } from "../../src/integrations/email/email.provider.js";

const password = "Correct-Horse-Battery-7";
const passwordHash = bcrypt.hashSync(password, 4);
const jwtSecret = "test-only-jwt-signing-secret";

function makeUser(
  status: "active" | "pending_verification" | "suspended" = "active",
) {
  return User.hydrate({
    _id: "68a111111111111111111111",
    firstName: "Avery",
    lastName: "Example",
    email: "avery@example.test",
    passwordHash,
    role: "customer",
    status,
    emailVerifiedAt:
      status === "pending_verification"
        ? null
        : new Date("2025-01-01T00:00:00.000Z"),
    lastLoginAt: null,
    passwordChangedAt: null,
    failedLoginAttempts: 3,
    lockedUntil: new Date("2030-01-01T00:00:00.000Z"),
  });
}

function isApiError(
  error: unknown,
  statusCode: number,
  code: string,
): error is ApiError {
  return (
    error instanceof ApiError &&
    error.statusCode === statusCode &&
    error.code === code
  );
}

test("login returns a safe user and a scoped access token for valid credentials", async (t) => {
  const user = makeUser();
  const findUser = t.mock.method(
    userRepository,
    "findByEmailWithPasswordHash",
    async () => user,
  );
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async () => user,
  );

  const result = await authService.login({
    email: " AVERY@EXAMPLE.TEST ",
    password,
  });

  assert.equal(findUser.mock.callCount(), 1);
  assert.equal(
    findUser.mock.calls[0]?.arguments[0],
    "avery@example.test",
  );
  assert.equal(updateUser.mock.callCount(), 1);
  const [updatedId, updates] = updateUser.mock.calls[0]!.arguments;
  assert.equal(updatedId, user._id.toString());
  assert.equal(updates.failedLoginAttempts, 0);
  assert.equal(updates.lockedUntil, null);
  assert.ok(updates.lastLoginAt instanceof Date);

  assert.equal(result.user.id, user._id.toString());
  assert.equal(result.user.email, "avery@example.test");
  assert.equal("passwordHash" in result.user, false);
  assert.equal(result.tokens.tokenType, "Bearer");
  assert.equal(result.tokens.expiresInSeconds, 900);

  const verified = jwt.verify(result.tokens.accessToken, jwtSecret, {
    issuer: "sog-airways-api",
    audience: "sog-airways-client",
  });
  assert.equal(typeof verified, "object");
  assert.equal((verified as JwtPayload).sub, user._id.toString());
  assert.equal((verified as JwtPayload).role, "customer");
  assert.equal((verified as JwtPayload).emailVerified, true);
});

test("login returns the same invalid-credentials error for an unknown email", async (t) => {
  const findUser = t.mock.method(
    userRepository,
    "findByEmailWithPasswordHash",
    async () => null,
  );

  await assert.rejects(
    authService.login({ email: "missing@example.test", password }),
    (error: unknown) => isApiError(error, 401, "INVALID_CREDENTIALS"),
  );

  assert.equal(findUser.mock.callCount(), 1);
});

test("login returns the same invalid-credentials error for a wrong password", async (t) => {
  t.mock.method(
    userRepository,
    "findByEmailWithPasswordHash",
    async () => makeUser(),
  );
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async () => makeUser(),
  );

  await assert.rejects(
    authService.login({
      email: "avery@example.test",
      password: "incorrect-password",
    }),
    (error: unknown) => isApiError(error, 401, "INVALID_CREDENTIALS"),
  );

  assert.equal(updateUser.mock.callCount(), 0);
});

test("login rejects unverified customers without updating their login state", async (t) => {
  t.mock.method(
    userRepository,
    "findByEmailWithPasswordHash",
    async () => makeUser("pending_verification"),
  );
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async () => makeUser("pending_verification"),
  );

  await assert.rejects(
    authService.login({ email: "avery@example.test", password }),
    (error: unknown) => isApiError(error, 403, "EMAIL_NOT_VERIFIED"),
  );

  assert.equal(updateUser.mock.callCount(), 0);
});

test("login rejects suspended verified accounts", async (t) => {
  t.mock.method(
    userRepository,
    "findByEmailWithPasswordHash",
    async () => makeUser("suspended"),
  );
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async () => makeUser("suspended"),
  );

  await assert.rejects(
    authService.login({ email: "avery@example.test", password }),
    (error: unknown) => isApiError(error, 403, "ACCOUNT_NOT_ACTIVE"),
  );

  assert.equal(updateUser.mock.callCount(), 0);
});

test("register creates a pending account and sends a hashed one-time code", async (t) => {
  const user = makeUser("pending_verification");
  const createUser = t.mock.method(
    userService,
    "createCustomerUser",
    async () => user,
  );
  const setChallenge = t.mock.method(
    userRepository,
    "setEmailVerificationChallenge",
    async () => user,
  );
  let sentMessage: EmailMessage | undefined;
  const testService = createAuthService({
    isEnabled: true,
    async sendEmail(message) {
      sentMessage = message;
      return {
        success: true,
        provider: "demo",
        status: "sent",
      };
    },
  });

  const result = await testService.register({
    firstName: "Avery",
    lastName: "Example",
    email: "avery@example.test",
    password,
  });

  assert.equal(createUser.mock.callCount(), 1);
  assert.deepEqual(createUser.mock.calls[0]?.arguments[0], {
    firstName: "Avery",
    lastName: "Example",
    email: "avery@example.test",
    password,
  });
  assert.deepEqual(result, {
    email: "avery@example.test",
    verificationRequired: true,
  });
  assert.equal(setChallenge.mock.callCount(), 1);
  const [, storedHash, expiresAt, sentAt] =
    setChallenge.mock.calls[0]!.arguments;
  assert.match(storedHash, /^[a-f\d]{64}$/);
  assert.ok(expiresAt.getTime() > sentAt.getTime());
  const code = sentMessage?.text.match(/\b\d{6}\b/)?.[0];
  assert.ok(code);
  assert.notEqual(storedHash, code);
  assert.equal(
    storedHash,
    createHmac("sha256", jwtSecret)
      .update(`email-verification:avery@example.test:${code}`)
      .digest("hex"),
  );
});

test("register does not create an account when email delivery is disabled", async (t) => {
  const createUser = t.mock.method(
    userService,
    "createCustomerUser",
    async () => makeUser("pending_verification"),
  );
  const testService = createAuthService({
    isEnabled: false,
    async sendEmail() {
      return {
        success: false,
        provider: "disabled",
        status: "disabled",
      };
    },
  });

  await assert.rejects(
    testService.register({
      firstName: "Avery",
      lastName: "Example",
      email: "avery@example.test",
      password,
    }),
    (error: unknown) =>
      isApiError(error, 503, "EMAIL_DELIVERY_NOT_CONFIGURED"),
  );
  assert.equal(createUser.mock.callCount(), 0);
});

test("resendVerificationEmail supports existing active but unverified customers", async (t) => {
  const user = makeUser();
  user.emailVerifiedAt = null;
  t.mock.method(userRepository, "findByEmail", async () => user);
  const setChallenge = t.mock.method(
    userRepository,
    "setEmailVerificationChallenge",
    async () => user,
  );
  let sendCount = 0;
  const testService = createAuthService({
    isEnabled: true,
    async sendEmail() {
      sendCount += 1;
      return {
        success: true,
        provider: "demo",
        status: "sent",
      };
    },
  });

  await testService.resendVerificationEmail({
    email: "avery@example.test",
  });

  assert.equal(setChallenge.mock.callCount(), 1);
  const [, , , sentAt, cooldownBefore] =
    setChallenge.mock.calls[0]!.arguments;
  assert.ok(cooldownBefore);
  assert.equal(sentAt.getTime() - cooldownBefore.getTime(), 60_000);
  assert.equal(sendCount, 1);
});

test("verifyEmail consumes a valid OTP hash and activates the account", async (t) => {
  const user = makeUser("pending_verification");
  let receivedHash: string | undefined;
  t.mock.method(
    userRepository,
    "verifyEmailWithOtp",
    async (_email, codeHash) => {
      receivedHash = codeHash;
      return user;
    },
  );
  const incrementAttempts = t.mock.method(
    userRepository,
    "incrementEmailVerificationAttempts",
    async () => ({ modifiedCount: 1 }),
  );
  const code = "004291";

  const result = await authService.verifyEmail({
    email: "AVERY@example.test",
    code,
  });

  assert.deepEqual(result, {
    email: "avery@example.test",
    verified: true,
  });
  assert.equal(
    receivedHash,
    createHmac("sha256", jwtSecret)
      .update(`email-verification:avery@example.test:${code}`)
      .digest("hex"),
  );
  assert.equal(incrementAttempts.mock.callCount(), 0);
});

test("verifyEmail counts invalid OTP attempts and returns a generic error", async (t) => {
  t.mock.method(
    userRepository,
    "verifyEmailWithOtp",
    async () => null,
  );
  const incrementAttempts = t.mock.method(
    userRepository,
    "incrementEmailVerificationAttempts",
    async () => ({ modifiedCount: 1 }),
  );

  await assert.rejects(
    authService.verifyEmail({
      email: "avery@example.test",
      code: "004291",
    }),
    (error: unknown) =>
      isApiError(error, 400, "INVALID_OR_EXPIRED_VERIFICATION_CODE"),
  );

  assert.equal(incrementAttempts.mock.callCount(), 1);
});