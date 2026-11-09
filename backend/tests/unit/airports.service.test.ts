import assert from "node:assert/strict";
import { test } from "node:test";
import { Types } from "mongoose";

import { ApiError } from "../../src/utils/api-error.js";
import { airportRepository } from "../../src/modules/airports/repositories/airport.repository.js";
import { AirportService } from "../../src/modules/airports/services/airport.service.js";

const service = new AirportService();
const airportId = "68a222222222222222222222";
const createdAt = new Date("2025-01-01T00:00:00.000Z");
const updatedAt = new Date("2025-01-02T00:00:00.000Z");

function airport(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(airportId),
    airportCode: "SOG",
    icaoCode: "KSOG",
    name: "SOG International",
    city: "Example City",
    state: "CA",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    coordinates: { latitude: 34, longitude: -118 },
    status: "active" as const,
    createdAt,
    updatedAt,
    ...overrides,
  };
}

function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}

test("createAirport detects duplicate IATA and ICAO codes", async (t) => {
  const findIata = t.mock.method(airportRepository, "findByAirportCode", async () => airport());
  const findIcao = t.mock.method(airportRepository, "findByIcaoCode", async () => null);
  const create = t.mock.method(airportRepository, "create", async () => airport());

  const input = {
    airportCode: "SOG",
    icaoCode: "KSOG",
    name: "SOG International",
    city: "Example City",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    coordinates: { latitude: 34, longitude: -118 },
  };
  await assert.rejects(
    service.createAirport(input),
    (error: unknown) => hasApiError(error, 409, "AIRPORT_CODE_ALREADY_EXISTS"),
  );
  assert.equal(findIcao.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);

  findIata.mock.restore();
  t.mock.method(airportRepository, "findByAirportCode", async () => null);
  findIcao.mock.restore();
  t.mock.method(airportRepository, "findByIcaoCode", async () => airport());

  await assert.rejects(
    service.createAirport(input),
    (error: unknown) => hasApiError(error, 409, "ICAO_CODE_ALREADY_EXISTS"),
  );
});

test("createAirport serializes result and maps duplicate-key races", async (t) => {
  t.mock.method(airportRepository, "findByAirportCode", async () => null);
  t.mock.method(airportRepository, "findByIcaoCode", async () => null);
  const create = t.mock.method(airportRepository, "create", async () => airport());
  const input = {
    airportCode: "SOG",
    icaoCode: "KSOG",
    name: "SOG International",
    city: "Example City",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    coordinates: { latitude: 34, longitude: -118 },
  };
  const result = await service.createAirport(input);
  assert.equal(result.id, airportId);
  assert.equal(result.coordinates.latitude, 34);
  assert.deepEqual(create.mock.calls[0]?.arguments[0], input);

  create.mock.restore();
  t.mock.method(airportRepository, "create", async () => {
    throw { code: 11000 };
  });
  await assert.rejects(
    service.createAirport(input),
    (error: unknown) => hasApiError(error, 409, "AIRPORT_DUPLICATE_CODE"),
  );
});

test("airport lookups serialize found records and report missing records", async (t) => {
  const findById = t.mock.method(airportRepository, "findById", async () => airport());
  const findByCode = t.mock.method(airportRepository, "findByAirportCode", async () => airport());
  assert.equal((await service.getAirportById(airportId)).airportCode, "SOG");
  assert.equal((await service.getAirportByCode("SOG")).icaoCode, "KSOG");
  assert.equal(findById.mock.callCount(), 1);
  assert.equal(findByCode.mock.callCount(), 1);

  findById.mock.restore();
  t.mock.method(airportRepository, "findById", async () => null);
  await assert.rejects(
    service.getAirportById(airportId),
    (error: unknown) => hasApiError(error, 404, "AIRPORT_NOT_FOUND"),
  );
});

test("updateAirport validates existence, uniqueness, and duplicate-key races", async (t) => {
  const find = t.mock.method(airportRepository, "findById", async () => airport());
  const iataExists = t.mock.method(airportRepository, "airportCodeExists", async () => false);
  const icaoExists = t.mock.method(airportRepository, "icaoCodeExists", async () => false);
  const update = t.mock.method(airportRepository, "updateById", async (_id, data) => airport(data));

  const result = await service.updateAirport(airportId, { airportCode: "NEW" });
  assert.equal(result.airportCode, "NEW");
  assert.deepEqual(iataExists.mock.calls[0]?.arguments, ["NEW", airportId]);
  assert.equal(icaoExists.mock.callCount(), 0);
  assert.equal(update.mock.callCount(), 1);

  iataExists.mock.restore();
  t.mock.method(airportRepository, "airportCodeExists", async () => true);
  await assert.rejects(
    service.updateAirport(airportId, { airportCode: "NEW" }),
    (error: unknown) => hasApiError(error, 409, "AIRPORT_CODE_ALREADY_EXISTS"),
  );
  assert.equal(update.mock.callCount(), 1);

  find.mock.restore();
  t.mock.method(airportRepository, "findById", async () => null);
  await assert.rejects(
    service.updateAirport(airportId, { name: "Changed" }),
    (error: unknown) => hasApiError(error, 404, "AIRPORT_NOT_FOUND"),
  );
});

test("updateAirport maps duplicate key and missing update result", async (t) => {
  t.mock.method(airportRepository, "findById", async () => airport());
  t.mock.method(airportRepository, "airportCodeExists", async () => false);
  const update = t.mock.method(airportRepository, "updateById", async () => null);
  await assert.rejects(
    service.updateAirport(airportId, { airportCode: "NEW" }),
    (error: unknown) => hasApiError(error, 404, "AIRPORT_NOT_FOUND"),
  );

  update.mock.restore();
  t.mock.method(airportRepository, "updateById", async () => {
    throw { code: 11000 };
  });
  await assert.rejects(
    service.updateAirport(airportId, { airportCode: "NEW" }),
    (error: unknown) => hasApiError(error, 409, "AIRPORT_DUPLICATE_CODE"),
  );
});

test("listAirports paginates; delete and count delegate", async (t) => {
  const findMany = t.mock.method(airportRepository, "findMany", async () => ({
    items: [airport()],
    totalItems: 21,
  }));
  const remove = t.mock.method(airportRepository, "deleteById", async () => true);
  const count = t.mock.method(airportRepository, "count", async () => 2);

  const result = await service.listAirports({ city: "Example" }, { page: 2, limit: 10 });
  assert.equal(result.items[0]?.id, airportId);
  assert.equal(result.pagination.totalPages, 3);
  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { city: "Example" },
    { page: 2, limit: 10 },
  ]);
  await service.deleteAirport(airportId);
  assert.equal(await service.countAirports(), 2);
  assert.equal(remove.mock.callCount(), 1);
  assert.equal(count.mock.callCount(), 1);

  remove.mock.restore();
  t.mock.method(airportRepository, "deleteById", async () => false);
  await assert.rejects(
    service.deleteAirport(airportId),
    (error: unknown) => hasApiError(error, 404, "AIRPORT_NOT_FOUND"),
  );
});
