import assert from "node:assert/strict";
import { test } from "node:test";
import { Types } from "mongoose";

import { ApiError } from "../../src/utils/api-error.js";
import { flightRepository } from "../../src/modules/flights/repositories/flight.repository.js";
import { FlightService } from "../../src/modules/flights/services/flight.service.js";

const service = new FlightService();
const flightId = "68a222222222222222222222";
const aircraftId = "68a333333333333333333333";
const departureAirport = "68a444444444444444444444";
const arrivalAirport = "68a555555555555555555555";
const departure = new Date("2025-06-01T10:00:00.000Z");
const arrival = new Date("2025-06-01T12:00:00.000Z");

function flight(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(flightId),
    flightNumber: "SG101",
    aircraft: new Types.ObjectId(aircraftId),
    departureAirport: new Types.ObjectId(departureAirport),
    arrivalAirport: new Types.ObjectId(arrivalAirport),
    scheduledDeparture: departure,
    scheduledArrival: arrival,
    estimatedDeparture: null,
    estimatedArrival: null,
    actualDeparture: null,
    actualArrival: null,
    status: "scheduled" as const,
    durationMinutes: 120,
    createdAt: departure,
    updatedAt: arrival,
    ...overrides,
  };
}

function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}

const createInput = {
  flightNumber: "SG101",
  aircraft: aircraftId,
  departureAirport,
  arrivalAirport,
  scheduledDeparture: departure,
  scheduledArrival: arrival,
  durationMinutes: 120,
};

test("createFlight rejects duplicate flight number and departure pairs", async (t) => {
  const exists = t.mock.method(flightRepository, "flightNumberExists", async () => true);
  const create = t.mock.method(flightRepository, "create", async () => flight());
  await assert.rejects(
    service.createFlight(createInput),
    (error: unknown) => hasApiError(error, 409, "FLIGHT_ALREADY_EXISTS"),
  );
  assert.equal(exists.mock.calls[0]?.arguments[0], "SG101");
  assert.equal(create.mock.callCount(), 0);
});

test("createFlight persists and serializes valid flight information", async (t) => {
  const exists = t.mock.method(flightRepository, "flightNumberExists", async () => false);
  const create = t.mock.method(flightRepository, "create", async () => flight());
  const result = await service.createFlight(createInput);
  assert.equal(result.id, flightId);
  assert.equal(result.aircraft, aircraftId);
  assert.equal(result.departureAirport, departureAirport);
  assert.equal(result.arrivalAirport, arrivalAirport);
  assert.equal(result.status, "scheduled");
  assert.deepEqual(create.mock.calls[0]?.arguments[0], createInput);
  assert.equal(exists.mock.callCount(), 1);
});

test("flight lookups serialize results and return 404 when absent", async (t) => {
  const byId = t.mock.method(flightRepository, "findById", async () => flight());
  const byNumber = t.mock.method(flightRepository, "findByFlightNumber", async () => flight());
  assert.equal((await service.getFlightById(flightId)).flightNumber, "SG101");
  assert.equal((await service.getFlightByNumber("SG101")).id, flightId);

  byId.mock.restore();
  t.mock.method(flightRepository, "findById", async () => null);
  await assert.rejects(
    service.getFlightById(flightId),
    (error: unknown) => hasApiError(error, 404, "FLIGHT_NOT_FOUND"),
  );
  assert.equal(byNumber.mock.callCount(), 1);
});

test("updateFlight checks updated uniqueness and missing or failed updates", async (t) => {
  const find = t.mock.method(flightRepository, "findById", async () => flight());
  const exists = t.mock.method(flightRepository, "flightNumberExists", async () => false);
  const update = t.mock.method(flightRepository, "updateById", async (_id, data) => flight(data));

  const changed = await service.updateFlight(flightId, { flightNumber: "SG102" });
  assert.equal(changed.flightNumber, "SG102");
  assert.equal(exists.mock.calls[0]?.arguments[0], "SG102");
  assert.equal(exists.mock.calls[0]?.arguments[2], flightId);

  exists.mock.restore();
  t.mock.method(flightRepository, "flightNumberExists", async () => true);
  await assert.rejects(
    service.updateFlight(flightId, { scheduledDeparture: new Date("2025-06-02T10:00:00Z") }),
    (error: unknown) => hasApiError(error, 409, "FLIGHT_ALREADY_EXISTS"),
  );
  assert.equal(update.mock.callCount(), 1);

  find.mock.restore();
  t.mock.method(flightRepository, "findById", async () => null);
  await assert.rejects(
    service.updateFlight(flightId, { status: "delayed" }),
    (error: unknown) => hasApiError(error, 404, "FLIGHT_NOT_FOUND"),
  );
});

test("updateFlight reports repository update failure", async (t) => {
  t.mock.method(flightRepository, "findById", async () => flight());
  t.mock.method(flightRepository, "updateById", async () => null);
  await assert.rejects(
    service.updateFlight(flightId, { status: "delayed" }),
    (error: unknown) => hasApiError(error, 500, "FLIGHT_UPDATE_FAILED"),
  );
});

test("listFlights returns pagination metadata; count and statistics delegate", async (t) => {
  const findMany = t.mock.method(flightRepository, "findMany", async () => [flight()]);
  const count = t.mock.method(flightRepository, "count", async () => 15);
  const status = t.mock.method(flightRepository, "countByStatus", async () => ({
    scheduled: 1, boarding: 2, departed: 3, in_flight: 4, landed: 1, delayed: 2, cancelled: 2,
  }));
  const routes = t.mock.method(flightRepository, "countByRoute", async () => [{
    departureAirport, arrivalAirport, count: 7,
  }]);

  const result = await service.listFlights({ status: "scheduled" }, { page: 2, limit: 5 });
  assert.equal(result.items[0]?.id, flightId);
  assert.deepEqual(result.pagination, {
    page: 2, limit: 5, totalItems: 15, totalPages: 3, hasNextPage: true, hasPreviousPage: true,
  });
  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { status: "scheduled" },
    { page: 2, limit: 5 },
  ]);
  assert.equal(await service.countFlights({ status: "landed" }), 15);
  assert.deepEqual(await service.getFlightStatistics(), {
    total: 15,
    scheduled: 1,
    boarding: 2,
    departed: 3,
    inFlight: 4,
    landed: 1,
    delayed: 2,
    cancelled: 2,
  });
  assert.deepEqual(await service.getFlightRouteStatistics(), [{
    departureAirport, arrivalAirport, count: 7,
  }]);
  assert.equal(count.mock.callCount(), 3);
  assert.equal(status.mock.callCount(), 1);
  assert.equal(routes.mock.callCount(), 1);
});

test("deleteFlight requires an existing flight and then delegates deletion", async (t) => {
  const find = t.mock.method(flightRepository, "findById", async () => flight());
  const remove = t.mock.method(flightRepository, "deleteById", async () => flight());
  await service.deleteFlight(flightId);
  assert.equal(find.mock.callCount(), 1);
  assert.equal(remove.mock.calls[0]?.arguments[0], flightId);

  find.mock.restore();
  t.mock.method(flightRepository, "findById", async () => null);
  await assert.rejects(
    service.deleteFlight(flightId),
    (error: unknown) => hasApiError(error, 404, "FLIGHT_NOT_FOUND"),
  );
  assert.equal(remove.mock.callCount(), 1);
});
