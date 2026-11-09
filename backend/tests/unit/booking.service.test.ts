import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingRepository } from "../../src/modules/bookings/repositories/booking.repository.js";
import { BookingService } from "../../src/modules/bookings/services/booking.service.js";
import { ApiError } from "../../src/utils/api-error.js";

test("booking ID lookup returns not found for absent records", async (t) => {
  const find = t.mock.method(bookingRepository, "findById", async () => null);
  await assert.rejects(new BookingService().getBookingById("68a111111111111111111111"),
    (error: unknown) => error instanceof ApiError && error.statusCode === 404 && error.code === "BOOKING_NOT_FOUND");
  assert.equal(find.mock.callCount(), 1);
});