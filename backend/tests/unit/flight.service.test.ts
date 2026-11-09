import assert from "node:assert/strict";
import { test } from "node:test";
import { flightRepository } from "../../src/modules/flights/repositories/flight.repository.js";
import { FlightService } from "../../src/modules/flights/services/flight.service.js";
import { ApiError } from "../../src/utils/api-error.js";

test("flight ID lookup reports a missing flight without database access", async (t) => {
  const find = t.mock.method(flightRepository, "findById", async () => null);
  await assert.rejects(new FlightService().getFlightById("68a111111111111111111111"),
    (error: unknown) => error instanceof ApiError && error.statusCode === 404);
  assert.equal(find.mock.callCount(), 1);
});