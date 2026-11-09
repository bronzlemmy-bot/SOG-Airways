import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcryptjs";

import { ApiError } from "../../src/utils/api-error.js";
import { userRepository } from "../../src/modules/users/repositories/user.repository.js";
import { userService } from "../../src/modules/users/services/user.service.js";

const validId = "68a111111111111111111111";

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

test("createCustomerUser normalizes profile data, hashes the password, and restricts role", async (t) => {
  const emailExists = t.mock.method(
    userRepository,
    "emailExists",
    async () => false,
  );
  const createUser = t.mock.method(
    userRepository,
    "create",
    async (input) => input,
  );

  const result = await userService.createCustomerUser({
    firstName: " Avery ",
    lastName: " Example ",
    email: " AVERY@EXAMPLE.TEST ",
    password: "correct-horse-battery",
    phoneNumber: " 555-0100 ",
  });

  assert.equal(emailExists.mock.calls[0]?.arguments[0], "avery@example.test");
  assert.equal(createUser.mock.callCount(), 1);
  const input = createUser.mock.calls[0]!.arguments[0];
  assert.equal(input.firstName, "Avery");
  assert.equal(input.lastName, "Example");
  assert.equal(input.email, "avery@example.test");
  assert.equal(input.phoneNumber, "555-0100");
  assert.equal(input.role, "customer");
  assert.equal(input.status, "pending_verification");
  assert.equal(await bcrypt.compare("correct-horse-battery", input.passwordHash), true);
  assert.equal("password" in result, false);
});

test("createCustomerUser rejects duplicate email without hashing or creating", async (t) => {
  t.mock.method(userRepository, "emailExists", async () => true);
  const createUser = t.mock.method(
    userRepository,
    "create",
    async (input) => input,
  );

  await assert.rejects(
    userService.createCustomerUser({
      firstName: "Avery",
      lastName: "Example",
      email: "avery@example.test",
      password: "correct-horse-battery",
    }),
    (error: unknown) =>
      isApiError(error, 409, "EMAIL_ALREADY_REGISTERED"),
  );

  assert.equal(createUser.mock.callCount(), 0);
});

test("createCustomerUser rejects short passwords before repository access", async (t) => {
  const emailExists = t.mock.method(
    userRepository,
    "emailExists",
    async () => false,
  );
  const createUser = t.mock.method(
    userRepository,
    "create",
    async (input) => input,
  );

  await assert.rejects(
    userService.createCustomerUser({
      firstName: "Avery",
      lastName: "Example",
      email: "avery@example.test",
      password: "short",
    }),
    (error: unknown) => isApiError(error, 400, "PASSWORD_TOO_SHORT"),
  );

  assert.equal(emailExists.mock.callCount(), 0);
  assert.equal(createUser.mock.callCount(), 0);
});

test("getUserById rejects malformed IDs and reports missing records", async (t) => {
  const findUser = t.mock.method(
    userRepository,
    "findById",
    async () => null,
  );

  await assert.rejects(
    userService.getUserById("not-an-object-id"),
    (error: unknown) => isApiError(error, 400, "INVALID_USER_ID"),
  );
  assert.equal(findUser.mock.callCount(), 0);

  await assert.rejects(
    userService.getUserById(validId),
    (error: unknown) => isApiError(error, 404, "USER_NOT_FOUND"),
  );
  assert.equal(findUser.mock.callCount(), 1);
});

test("updateUserProfile trims allowed fields and rejects empty or invalid updates", async (t) => {
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async (_id, updates) => updates,
  );

  const result = await userService.updateUserProfile(validId, {
    firstName: " Avery ",
    phoneNumber: " 555-0100 ",
  });
  assert.deepEqual(result, {
    firstName: "Avery",
    phoneNumber: "555-0100",
  });
  assert.equal(updateUser.mock.calls[0]?.arguments[0], validId);

  await assert.rejects(
    userService.updateUserProfile(validId, {}),
    (error: unknown) => isApiError(error, 400, "EMPTY_PROFILE_UPDATE"),
  );
  await assert.rejects(
    userService.updateUserProfile(validId, { firstName: "   " }),
    (error: unknown) => isApiError(error, 400, "INVALID_FIRST_NAME"),
  );
  await assert.rejects(
    userService.updateUserProfile("bad-id", { lastName: "Example" }),
    (error: unknown) => isApiError(error, 400, "INVALID_USER_ID"),
  );
  assert.equal(updateUser.mock.callCount(), 1);
});

test("updateUserProfile reports a missing record", async (t) => {
  const updateUser = t.mock.method(
    userRepository,
    "updateById",
    async () => null,
  );

  await assert.rejects(
    userService.updateUserProfile(validId, { lastName: "Example" }),
    (error: unknown) => isApiError(error, 404, "USER_NOT_FOUND"),
  );
  assert.equal(updateUser.mock.callCount(), 1);
});
