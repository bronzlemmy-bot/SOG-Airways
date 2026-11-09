import assert from "node:assert/strict";
import { test } from "node:test";
import { airportService } from "../../src/modules/airports/services/airport.service.js";
import { flightService } from "../../src/modules/flights/services/flight.service.js";
import { trackingRepository } from "../../src/modules/tracking/repositories/tracking.repository.js";
import { TrackingService } from "../../src/modules/tracking/services/tracking.service.js";
import type { AirportProfileResponse } from "../../src/modules/airports/types/airport.types.js";
import type { FlightProfileResponse } from "../../src/modules/flights/types/flight.types.js";
import { ApiError } from "../../src/utils/api-error.js";

const service = new TrackingService();
const flightId = "68a111111111111111111111";
const scheduledDeparture = new Date("2030-01-01T10:00:00.000Z");
const scheduledArrival = new Date("2030-01-01T12:00:00.000Z");
const existing = (overrides: Record<string, unknown> = {}) => ({
  flightId,
  flightNumber: "SOG101",
  status: "scheduled",
  scheduledDeparture,
  scheduledArrival,
  lastUpdated: new Date("2030-01-01T09:00:00.000Z"),
  ...overrides,
}) as never;
const hasError = (status: number) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status;

test("tracking creation rejects invalid schedule and duplicate flight IDs", async (t) => {
  const findId = t.mock.method(trackingRepository, "findByFlightId", async () => null);
  const findNumber = t.mock.method(trackingRepository, "findByFlightNumber", async () => null);
  const create = t.mock.method(trackingRepository, "create", async (input) => input as never);
  await assert.rejects(service.createTracking({
    flightId, flightNumber: "SOG101", departureAirport: "JFK", arrivalAirport: "LHR",
    scheduledDeparture, scheduledArrival: scheduledDeparture,
  }), hasError(400));
  assert.equal(findId.mock.callCount(), 0);
  findId.mock.restore();
  t.mock.method(trackingRepository, "findByFlightId", async () => existing());
  await assert.rejects(service.createTracking({
    flightId, flightNumber: "SOG101", departureAirport: "JFK", arrivalAirport: "LHR",
    scheduledDeparture, scheduledArrival,
  }), hasError(409));
  assert.equal(create.mock.callCount(), 0);
  assert.equal(findNumber.mock.callCount(), 0);
});

test("position updates reject stale timestamps and terminal flight statuses", async (t) => {
  const find = t.mock.method(trackingRepository, "findByFlightId", async () => existing());
  const update = t.mock.method(trackingRepository, "updatePosition", async () => existing());
  await assert.rejects(service.updatePosition(flightId, {
    latitude: 0, longitude: 0, recordedAt: new Date("2030-01-01T08:00:00.000Z"),
  }), hasError(400));
  assert.equal(update.mock.callCount(), 0);
  find.mock.restore();
  t.mock.method(trackingRepository, "findByFlightId", async () => existing({ status: "landed" }));
  await assert.rejects(service.updatePosition(flightId, { latitude: 0, longitude: 0 }), hasError(409));
});

test("status updates enforce state transitions and event ordering", async (t) => {
  const find = t.mock.method(trackingRepository, "findByFlightId", async () => existing());
  const update = t.mock.method(trackingRepository, "updateStatus", async () => existing());
  await assert.rejects(service.updateStatus(flightId, {
    status: "landed", description: "Landed", timestamp: new Date("2030-01-01T10:00:00.000Z"),
  }), hasError(409));
  assert.equal(update.mock.callCount(), 0);
  find.mock.restore();
  t.mock.method(trackingRepository, "findByFlightId", async () => existing({ status: "departed" }));
  await assert.rejects(service.updateStatus(flightId, {
    status: "in_flight", description: "Airborne", timestamp: new Date("2030-01-01T08:00:00.000Z"),
  }), hasError(400));
  assert.equal(update.mock.callCount(), 0);
});

test("tracking listing normalizes pagination and delegates filters", async (t) => {
  const list = t.mock.method(trackingRepository, "list", async (query) => ({ items: [], total: 0, query }));
  const result = await service.listTracking({ page: 0, limit: 200, status: "scheduled" });
  assert.equal(result.pagination.page, 1);
  assert.equal(result.pagination.limit, 100);
  assert.equal(list.mock.calls[0]?.arguments[0].status, "scheduled");
});

test("missing tracking records return the disabled provider status for a real flight", async (t) => {
  const departureAirportId = "68a222222222222222222222";
  const arrivalAirportId = "68a333333333333333333333";
  const flight = {
    id: flightId,
    flightNumber: "SOG101",
    aircraft: "68a444444444444444444444",
    departureAirport: departureAirportId,
    arrivalAirport: arrivalAirportId,
    scheduledDeparture,
    scheduledArrival,
    status: "scheduled",
    durationMinutes: 120,
    createdAt: scheduledDeparture,
    updatedAt: scheduledDeparture,
  } satisfies FlightProfileResponse;
  const departureAirport = {
    id: departureAirportId,
    airportCode: "JFK",
    icaoCode: "KJFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    state: "NY",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    coordinates: { latitude: 40.6413, longitude: -73.7781 },
    status: "active",
    createdAt: scheduledDeparture.toISOString(),
    updatedAt: scheduledDeparture.toISOString(),
  } satisfies AirportProfileResponse;
  const arrivalAirport = {
    ...departureAirport,
    id: arrivalAirportId,
    airportCode: "LHR",
    icaoCode: "EGLL",
    name: "Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
  } satisfies AirportProfileResponse;

  t.mock.method(trackingRepository, "findByFlightNumber", async () => null);
  t.mock.method(flightService, "getFlightByNumber", async () => flight);
  t.mock.method(airportService, "getAirportById", async (id) =>
    id === departureAirportId ? departureAirport : arrivalAirport,
  );

  const result = await service.getTracking({ flightNumber: "SOG101" });

  assert.equal("status" in result && result.status, "unavailable");
  assert.equal("provider" in result && result.provider, "disabled");
  if ("flight" in result) {
    assert.equal(result.flight?.departureAirport, "JFK");
    assert.equal(result.flight?.arrivalAirport, "LHR");
    assert.equal(
      result.flight?.scheduledArrival?.toISOString(),
      scheduledArrival.toISOString(),
    );
    assert.equal(result.flight?.status, "unavailable");
    assert.equal("latitude" in (result.flight ?? {}), false);
  }
});
