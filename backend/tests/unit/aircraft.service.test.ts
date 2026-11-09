import assert from "node:assert/strict";
import { test } from "node:test";
import { Types } from "mongoose";

import { ApiError } from "../../src/utils/api-error.js";
import { aircraftRepository } from "../../src/modules/aircraft/repositories/aircraft.repository.js";
import { AircraftService } from "../../src/modules/aircraft/services/aircraft.service.js";

const service = new AircraftService();
const aircraftId = "68a222222222222222222222";
const createdAt = new Date("2025-01-01T00:00:00.000Z");
const updatedAt = new Date("2025-01-02T00:00:00.000Z");

function aircraft(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(aircraftId),
    registrationNumber: "N123SG",
    manufacturer: "Example Aircraft",
    model: "A100",
    aircraftType: "narrow_body" as const,
    serialNumber: "SERIAL-1",
    manufactureYear: 2020,
    capacity: {
      economy: 100,
      premiumEconomy: 20,
      business: 10,
      first: 0,
      total: 130,
    },
    rangeKilometers: 6000,
    status: "active" as const,
    notes: "Test aircraft",
    createdAt,
    updatedAt,
    ...overrides,
  };
}

function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}

const createInput = {
  registrationNumber: "N123SG",
  manufacturer: "Example Aircraft",
  model: "A100",
  aircraftType: "narrow_body" as const,
  serialNumber: "SERIAL-1",
  manufactureYear: 2020,
  capacity: {
    economy: 100,
    premiumEconomy: 20,
    business: 10,
    first: 0,
    total: 130,
  },
  rangeKilometers: 6000,
};

test("createAircraft enforces registration and serial uniqueness", async (t) => {
  const registrationExists = t.mock.method(
    aircraftRepository,
    "registrationNumberExists",
    async () => true,
  );
  const serialExists = t.mock.method(aircraftRepository, "serialNumberExists", async () => false);
  const create = t.mock.method(aircraftRepository, "create", async () => aircraft());

  await assert.rejects(
    service.createAircraft(createInput),
    (error: unknown) => hasApiError(error, 409, "AIRCRAFT_REGISTRATION_EXISTS"),
  );
  assert.equal(serialExists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);

  registrationExists.mock.restore();
  t.mock.method(aircraftRepository, "registrationNumberExists", async () => false);
  serialExists.mock.restore();
  t.mock.method(aircraftRepository, "serialNumberExists", async () => true);
  await assert.rejects(
    service.createAircraft(createInput),
    (error: unknown) => hasApiError(error, 409, "AIRCRAFT_SERIAL_NUMBER_EXISTS"),
  );
  assert.equal(create.mock.callCount(), 0);
});

test("createAircraft creates and serializes aircraft without optional values", async (t) => {
  t.mock.method(aircraftRepository, "registrationNumberExists", async () => false);
  t.mock.method(aircraftRepository, "serialNumberExists", async () => false);
  const create = t.mock.method(aircraftRepository, "create", async () => aircraft({
    serialNumber: undefined,
    notes: undefined,
  }));

  const result = await service.createAircraft(createInput);
  assert.equal(result.id, aircraftId);
  assert.equal(result.registrationNumber, "N123SG");
  assert.equal(result.serialNumber, undefined);
  assert.equal(result.notes, undefined);
  assert.deepEqual(create.mock.calls[0]?.arguments[0], createInput);
});

test("aircraft lookup methods return profiles and report missing aircraft", async (t) => {
  const findById = t.mock.method(aircraftRepository, "findById", async () => aircraft());
  const findByRegistration = t.mock.method(
    aircraftRepository,
    "findByRegistrationNumber",
    async () => aircraft(),
  );
  assert.equal((await service.getAircraftById(aircraftId)).id, aircraftId);
  assert.equal((await service.getAircraftByRegistrationNumber("n123sg")).registrationNumber, "N123SG");
  assert.equal(findById.mock.callCount(), 1);
  assert.equal(findByRegistration.mock.callCount(), 1);

  findById.mock.restore();
  t.mock.method(aircraftRepository, "findById", async () => null);
  await assert.rejects(
    service.getAircraftById(aircraftId),
    (error: unknown) => hasApiError(error, 404, "AIRCRAFT_NOT_FOUND"),
  );
});

test("updateAircraft checks existence, registration and serial conflicts", async (t) => {
  const find = t.mock.method(aircraftRepository, "findById", async () => aircraft());
  const registrationExists = t.mock.method(
    aircraftRepository,
    "registrationNumberExists",
    async () => false,
  );
  const serialExists = t.mock.method(aircraftRepository, "serialNumberExists", async () => false);
  const update = t.mock.method(
    aircraftRepository,
    "updateById",
    async (_id, data) => aircraft(data),
  );

  const result = await service.updateAircraft(aircraftId, { status: "maintenance" });
  assert.equal(result.status, "maintenance");
  assert.equal(registrationExists.mock.callCount(), 0);
  assert.equal(serialExists.mock.callCount(), 0);

  registrationExists.mock.restore();
  t.mock.method(aircraftRepository, "registrationNumberExists", async () => true);
  await assert.rejects(
    service.updateAircraft(aircraftId, { registrationNumber: "N999SG" }),
    (error: unknown) => hasApiError(error, 409, "AIRCRAFT_REGISTRATION_EXISTS"),
  );
  assert.equal(update.mock.callCount(), 1);

  registrationExists.mock.restore();
  t.mock.method(aircraftRepository, "registrationNumberExists", async () => false);
  serialExists.mock.restore();
  t.mock.method(aircraftRepository, "serialNumberExists", async () => true);
  await assert.rejects(
    service.updateAircraft(aircraftId, { serialNumber: "SERIAL-2" }),
    (error: unknown) => hasApiError(error, 409, "AIRCRAFT_SERIAL_NUMBER_EXISTS"),
  );

  find.mock.restore();
  t.mock.method(aircraftRepository, "findById", async () => null);
  await assert.rejects(
    service.updateAircraft(aircraftId, { status: "inactive" }),
    (error: unknown) => hasApiError(error, 404, "AIRCRAFT_NOT_FOUND"),
  );
});

test("updateAircraft reports a failed update", async (t) => {
  t.mock.method(aircraftRepository, "findById", async () => aircraft());
  t.mock.method(aircraftRepository, "updateById", async () => null);
  await assert.rejects(
    service.updateAircraft(aircraftId, { status: "inactive" }),
    (error: unknown) => hasApiError(error, 500, "AIRCRAFT_UPDATE_FAILED"),
  );
});

test("listAircraft returns page metadata and aggregates filters", async (t) => {
  const findMany = t.mock.method(aircraftRepository, "findMany", async () => [aircraft()]);
  const count = t.mock.method(aircraftRepository, "count", async () => 21);
  const result = await service.listAircraft(
    { manufacturer: "Example" },
    { page: 2, limit: 10 },
  );
  assert.equal(result.items.length, 1);
  assert.deepEqual(result.pagination, {
    page: 2,
    limit: 10,
    totalItems: 21,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
  });
  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { manufacturer: "Example" },
    { page: 2, limit: 10 },
  ]);
  assert.equal(count.mock.calls[0]?.arguments[0]?.manufacturer, "Example");
});

test("delete, count and statistics delegate to repository", async (t) => {
  const find = t.mock.method(aircraftRepository, "findById", async () => aircraft());
  const remove = t.mock.method(aircraftRepository, "deleteById", async () => aircraft());
  const count = t.mock.method(aircraftRepository, "count", async () => 4);
  const status = t.mock.method(aircraftRepository, "countByStatus", async () => ({
    active: 1,
    maintenance: 1,
    inactive: 1,
    retired: 1,
  }));
  const type = t.mock.method(aircraftRepository, "countByType", async () => ({
    narrow_body: 3,
    cargo: 1,
  }));

  await service.deleteAircraft(aircraftId);
  assert.equal(await service.countAircraft({ status: "active" }), 4);
  assert.deepEqual(await service.getAircraftStatistics(), {
    total: 4,
    active: 1,
    maintenance: 1,
    inactive: 1,
    retired: 1,
  });
  assert.deepEqual(await service.getAircraftTypeStatistics(), {
    narrow_body: 3,
    cargo: 1,
  });
  assert.equal(find.mock.callCount(), 1);
  assert.equal(remove.mock.callCount(), 1);
  assert.equal(count.mock.callCount(), 2);
  assert.equal(status.mock.callCount(), 1);
  assert.equal(type.mock.callCount(), 1);
});
