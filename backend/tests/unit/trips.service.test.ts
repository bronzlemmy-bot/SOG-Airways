import assert from "node:assert/strict";
import { test } from "node:test";
import { tripRepository } from "../../src/modules/trips/repositories/trip.repository.js";
import { tripService } from "../../src/modules/trips/services/trip.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const customer = "68a111111111111111111111";
const origin = "68a222222222222222222222";
const destination = "68a333333333333333333333";
const tripId = "68a444444444444444444444";
const hasError = (status: number, code?: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && (!code || error.code === code);
const existing = (overrides: Record<string, unknown> = {}) => ({
  status: "planned",
  tripType: "one_way",
  departureDate: new Date("2030-01-01T00:00:00.000Z"),
  returnDate: null,
  originAirport: { toString: () => origin },
  destinationAirport: { toString: () => destination },
  ...overrides,
}) as never;

test("trip creation validates dates, airport distinction, and duplicate references", async (t) => {
  const exists = t.mock.method(tripRepository, "existsByReference", async () => false);
  const create = t.mock.method(tripRepository, "create", async (input) => input as never);
  const input = {
    customer, originAirport: origin, destinationAirport: destination,
    departureDate: new Date("2030-01-01T00:00:00.000Z"),
    tripType: "round_trip" as const,
  };
  await assert.rejects(tripService.createTrip(input), hasError(400, "RETURN_DATE_REQUIRED"));
  await assert.rejects(tripService.createTrip({
    ...input, tripType: "one_way", originAirport: origin, destinationAirport: origin,
  }), hasError(400, "SAME_ORIGIN_DESTINATION"));
  assert.equal(create.mock.callCount(), 0);
  exists.mock.restore();
  t.mock.method(tripRepository, "existsByReference", async () => true);
  await assert.rejects(tripService.createTrip({
    ...input, tripType: "one_way", tripReference: "SOG-TRIP-1",
  }), hasError(409, "TRIP_REFERENCE_EXISTS"));
});

test("customer trip lookups are ownership-scoped", async (t) => {
  const find = t.mock.method(tripRepository, "findByIdForCustomer", async () => null);
  await assert.rejects(tripService.getCustomerTripById(tripId, customer), hasError(404, "TRIP_NOT_FOUND"));
  assert.deepEqual(find.mock.calls[0]?.arguments, [tripId, customer]);
});

test("completed trips cannot be cancelled and editable trips validate return dates", async (t) => {
  const find = t.mock.method(tripRepository, "findById", async () => existing({ status: "completed" }));
  const update = t.mock.method(tripRepository, "updateById", async () => existing());
  await assert.rejects(tripService.cancelTrip(tripId, "request"), hasError(409, "COMPLETED_TRIP_CANNOT_BE_CANCELLED"));
  find.mock.restore();
  t.mock.method(tripRepository, "findById", async () => existing());
  await assert.rejects(tripService.updateTrip(tripId, {
    tripType: "round_trip",
    returnDate: null,
  }), hasError(400, "RETURN_DATE_REQUIRED"));
  assert.equal(update.mock.callCount(), 0);
});
