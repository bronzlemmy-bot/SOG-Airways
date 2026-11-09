import assert from "node:assert/strict";
import { test } from "node:test";
import { Types } from "mongoose";

import { ApiError } from "../../src/utils/api-error.js";
import { customerRepository } from "../../src/modules/customers/repositories/customer.repository.js";
import { CustomerService } from "../../src/modules/customers/services/customer.service.js";

const service = new CustomerService();
const userId = "68a111111111111111111111";
const profileId = "68a222222222222222222222";
const createdAt = new Date("2025-01-01T00:00:00.000Z");
const updatedAt = new Date("2025-01-02T00:00:00.000Z");

function profile(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(profileId),
    userId: new Types.ObjectId(userId),
    loyaltyNumber: "SOG-123",
    loyaltyTier: "gold" as const,
    milesBalance: 1200,
    preferredCabinClass: "business" as const,
    preferredCurrency: "USD",
    marketingConsent: true,
    createdAt,
    updatedAt,
    ...overrides,
  };
}

function hasApiError(error: unknown, statusCode: number): boolean {
  return error instanceof ApiError && error.statusCode === statusCode;
}

test("getMyProfile returns serialized customer profile data", async (t) => {
  const find = t.mock.method(
    customerRepository,
    "findByUserId",
    async () => profile(),
  );

  const result = await service.getMyProfile(userId);

  assert.equal(find.mock.calls[0]?.arguments[0], userId);
  assert.deepEqual(result, {
    id: profileId,
    userId,
    loyaltyNumber: "SOG-123",
    loyaltyTier: "gold",
    milesBalance: 1200,
    preferredCabinClass: "business",
    preferredCurrency: "USD",
    marketingConsent: true,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  });
});

test("getMyProfile and getProfileByUserId report missing profiles", async (t) => {
  const find = t.mock.method(
    customerRepository,
    "findByUserId",
    async () => null,
  );

  await assert.rejects(
    service.getMyProfile(userId),
    (error: unknown) => hasApiError(error, 404),
  );
  await assert.rejects(
    service.getProfileByUserId(userId),
    (error: unknown) => hasApiError(error, 404),
  );
  assert.equal(find.mock.callCount(), 2);
});

test("createProfile rejects an existing profile before checking loyalty number", async (t) => {
  const find = t.mock.method(
    customerRepository,
    "findByUserId",
    async () => profile(),
  );
  const loyaltyExists = t.mock.method(
    customerRepository,
    "loyaltyNumberExists",
    async () => false,
  );
  const create = t.mock.method(
    customerRepository,
    "create",
    async () => profile(),
  );

  await assert.rejects(
    service.createProfile(userId, { loyaltyNumber: "SOG-123" }),
    (error: unknown) => hasApiError(error, 409),
  );
  assert.equal(find.mock.callCount(), 1);
  assert.equal(loyaltyExists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
});

test("createProfile rejects a duplicate loyalty number and handles database duplicate-key races", async (t) => {
  t.mock.method(
    customerRepository,
    "findByUserId",
    async () => null,
  );
  const loyaltyExists = t.mock.method(
    customerRepository,
    "loyaltyNumberExists",
    async () => true,
  );
  const create = t.mock.method(
    customerRepository,
    "create",
    async () => profile(),
  );

  await assert.rejects(
    service.createProfile(userId, { loyaltyNumber: "SOG-123" }),
    (error: unknown) => hasApiError(error, 409),
  );
  assert.equal(create.mock.callCount(), 0);
  assert.equal(loyaltyExists.mock.callCount(), 1);

  loyaltyExists.mock.restore();
  t.mock.method(
    customerRepository,
    "loyaltyNumberExists",
    async () => false,
  );
  create.mock.restore();
  t.mock.method(customerRepository, "create", async () => {
    throw { code: 11000 };
  });

  await assert.rejects(
    service.createProfile(userId, { loyaltyNumber: "SOG-123" }),
    (error: unknown) => hasApiError(error, 409),
  );
});

test("createProfile creates and serializes a new profile", async (t) => {
  t.mock.method(
    customerRepository,
    "findByUserId",
    async () => null,
  );
  t.mock.method(
    customerRepository,
    "loyaltyNumberExists",
    async () => false,
  );
  const create = t.mock.method(
    customerRepository,
    "create",
    async () => profile(),
  );

  const result = await service.createProfile(userId, {
    loyaltyNumber: "SOG-123",
    preferredCabinClass: "business",
  });

  assert.deepEqual(create.mock.calls[0]?.arguments, [
    userId,
    {
      loyaltyNumber: "SOG-123",
      preferredCabinClass: "business",
    },
  ]);
  assert.equal(result.id, profileId);
});

test("updateMyProfile serializes results and reports missing profiles", async (t) => {
  const update = t.mock.method(
    customerRepository,
    "updatePreferences",
    async () => profile(),
  );

  const result = await service.updateMyProfile(userId, {
    preferredCurrency: "CAD",
  });
  assert.equal(update.mock.calls[0]?.arguments[0], userId);
  assert.equal(result.userId, userId);

  update.mock.restore();
  t.mock.method(
    customerRepository,
    "updatePreferences",
    async () => null,
  );
  await assert.rejects(
    service.updateMyProfile(userId, { marketingConsent: false }),
    (error: unknown) => hasApiError(error, 404),
  );
});

test("listProfiles maps results and computes pagination totals", async (t) => {
  const findMany = t.mock.method(
    customerRepository,
    "findMany",
    async () => ({ items: [profile()], totalItems: 21 }),
  );

  const result = await service.listProfiles(
    { loyaltyTier: "gold" },
    { page: 2, limit: 10 },
  );

  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { loyaltyTier: "gold" },
    { page: 2, limit: 10 },
  ]);
  assert.equal(result.items[0]?.id, profileId);
  assert.deepEqual(result.pagination, {
    page: 2,
    limit: 10,
    totalItems: 21,
    totalPages: 3,
  });
});

test("loyalty availability inverts repository existence and count delegates", async (t) => {
  const exists = t.mock.method(
    customerRepository,
    "loyaltyNumberExists",
    async () => false,
  );
  const count = t.mock.method(
    customerRepository,
    "count",
    async () => 7,
  );

  assert.equal(await service.isLoyaltyNumberAvailable("SOG-123"), true);
  assert.equal(exists.mock.calls[0]?.arguments[0], "SOG-123");
  assert.equal(await service.countProfiles(), 7);
  assert.equal(count.mock.callCount(), 1);
});
