import assert from "node:assert/strict";
import { test } from "node:test";

import { ApiError } from "../../src/utils/api-error.js";
import { bookingRepository } from "../../src/modules/bookings/repositories/booking.repository.js";
import { BookingService } from "../../src/modules/bookings/services/booking.service.js";
import {
  bookingCustomerId,
  bookingFlightId,
  bookingId,
  bookingPassengerId,
  makeBooking,
} from "../fixtures/booking.fixture.js";

const service = new BookingService();

function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}

const createInput = {
  bookingReference: "SOG-TEST-1001",
  customer: bookingCustomerId,
  flight: bookingFlightId,
  passengers: [bookingPassengerId],
  passengerCount: 1,
  baseFare: 100,
  taxes: 10,
  fees: 5,
  discount: 0,
};

test("createBooking calculates totals and serializes its record", async (t) => {
  const exists = t.mock.method(bookingRepository, "bookingReferenceExists", async () => false);
  const create = t.mock.method(bookingRepository, "create", async (data) => makeBooking(data));

  const result = await service.createBooking(createInput);
  assert.equal(result.id, bookingId);
  assert.equal(result.totalAmount, 115);
  assert.equal(result.bookingReference, "SOG-TEST-1001");
  assert.deepEqual(create.mock.calls[0]?.arguments[0], {
    ...createInput,
    taxes: 10,
    fees: 5,
    discount: 0,
    totalAmount: 115,
  });
  assert.equal(exists.mock.callCount(), 1);
});

test("createBooking rejects invalid totals and duplicate references before creating", async (t) => {
  const exists = t.mock.method(bookingRepository, "bookingReferenceExists", async () => false);
  const create = t.mock.method(bookingRepository, "create", async (data) => makeBooking(data));

  await assert.rejects(
    service.createBooking({ ...createInput, discount: 200 }),
    (error: unknown) => hasApiError(error, 400, "INVALID_BOOKING_TOTAL"),
  );
  await assert.rejects(
    service.createBooking({ ...createInput, totalAmount: 114 }),
    (error: unknown) => hasApiError(error, 400, "BOOKING_TOTAL_MISMATCH"),
  );
  assert.equal(exists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);

  exists.mock.restore();
  t.mock.method(bookingRepository, "bookingReferenceExists", async () => true);
  await assert.rejects(
    service.createBooking(createInput),
    (error: unknown) => hasApiError(error, 409, "BOOKING_REFERENCE_EXISTS"),
  );
  assert.equal(create.mock.callCount(), 0);
});

test("booking retrieval methods serialize or return a not-found error", async (t) => {
  const byId = t.mock.method(bookingRepository, "findById", async () => makeBooking());
  const byReference = t.mock.method(bookingRepository, "findByReference", async () => makeBooking());
  assert.equal((await service.getBookingById(bookingId)).customer, bookingCustomerId);
  assert.equal((await service.getBookingByReference("SOG-TEST-1001")).id, bookingId);

  byId.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => null);
  await assert.rejects(
    service.getBookingById(bookingId),
    (error: unknown) => hasApiError(error, 404, "BOOKING_NOT_FOUND"),
  );
  assert.equal(byReference.mock.callCount(), 1);
});

test("updateBooking rejects cancelled bookings, invalid price totals, and passenger mismatch", async (t) => {
  const find = t.mock.method(bookingRepository, "findById", async () => makeBooking());
  const update = t.mock.method(bookingRepository, "updateById", async (_id, data) => makeBooking(data));

  const changed = await service.updateBooking(bookingId, { baseFare: 200 });
  assert.equal(changed.totalAmount, 215);
  assert.equal(update.mock.calls[0]?.arguments[1].totalAmount, 215);

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => makeBooking({ status: "cancelled" }));
  await assert.rejects(
    service.updateBooking(bookingId, { baseFare: 200 }),
    (error: unknown) => hasApiError(error, 409, "CANCELLED_BOOKING_UPDATE"),
  );

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => makeBooking());
  await assert.rejects(
    service.updateBooking(bookingId, { passengerCount: 0 }),
    (error: unknown) => hasApiError(error, 400, "BOOKING_PASSENGER_COUNT_MISMATCH"),
  );
  assert.equal(update.mock.callCount(), 1);
});

test("updateBooking rejects total mismatches and missing or failed updates", async (t) => {
  const find = t.mock.method(bookingRepository, "findById", async () => makeBooking());
  const update = t.mock.method(bookingRepository, "updateById", async () => makeBooking());

  await assert.rejects(
    service.updateBooking(bookingId, { baseFare: 200, totalAmount: 100 }),
    (error: unknown) => hasApiError(error, 400, "BOOKING_TOTAL_MISMATCH"),
  );
  assert.equal(update.mock.callCount(), 0);

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => null);
  await assert.rejects(
    service.updateBooking(bookingId, { status: "confirmed" }),
    (error: unknown) => hasApiError(error, 404, "BOOKING_NOT_FOUND"),
  );

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => makeBooking());
  update.mock.restore();
  t.mock.method(bookingRepository, "updateById", async () => null);
  await assert.rejects(
    service.updateBooking(bookingId, { status: "confirmed" }),
    (error: unknown) => hasApiError(error, 500, "BOOKING_UPDATE_FAILED"),
  );
});

test("cancelBooking changes status and rejects missing, cancelled, or completed bookings", async (t) => {
  const find = t.mock.method(bookingRepository, "findById", async () => makeBooking());
  const update = t.mock.method(
    bookingRepository,
    "updateById",
    async (_id, data) => makeBooking(data),
  );

  const result = await service.cancelBooking(bookingId, "  Customer request  ");
  assert.equal(result.status, "cancelled");
  assert.equal(update.mock.calls[0]?.arguments[1].cancellationReason, "Customer request");
  assert.ok(update.mock.calls[0]?.arguments[1].cancelledAt instanceof Date);

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => makeBooking({ status: "cancelled" }));
  await assert.rejects(
    service.cancelBooking(bookingId),
    (error: unknown) => hasApiError(error, 409, "BOOKING_ALREADY_CANCELLED"),
  );

  find.mock.restore();
  t.mock.method(bookingRepository, "findById", async () => makeBooking({ status: "completed" }));
  await assert.rejects(
    service.cancelBooking(bookingId),
    (error: unknown) => hasApiError(error, 409, "COMPLETED_BOOKING_CANCELLATION"),
  );
  assert.equal(update.mock.callCount(), 1);
});

test("listing, deletion, statistics, and revenue delegate to the repository", async (t) => {
  const findMany = t.mock.method(bookingRepository, "findMany", async () => [makeBooking()]);
  const count = t.mock.method(bookingRepository, "count", async () => 12);
  const statuses = t.mock.method(bookingRepository, "countByStatus", async () => ({
    pending: 2, confirmed: 3, cancelled: 1, completed: 4, expired: 2,
  }));
  const revenue = t.mock.method(bookingRepository, "getRevenueByCurrency", async () => [{
    currency: "USD", totalBookings: 3, totalRevenue: 300, totalDiscount: 10,
  }]);
  const find = t.mock.method(bookingRepository, "findById", async () => makeBooking());
  const remove = t.mock.method(bookingRepository, "deleteById", async () => makeBooking());

  const listed = await service.listBookings({ status: "pending" }, { page: 2, limit: 5 });
  assert.equal(listed.pagination.totalPages, 3);
  assert.equal(listed.items[0]?.id, bookingId);
  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { status: "pending" },
    { page: 2, limit: 5 },
  ]);
  assert.equal(await service.countBookings(), 12);
  assert.deepEqual(await service.getBookingStatistics(), {
    total: 12, pending: 2, confirmed: 3, cancelled: 1, completed: 4, expired: 2,
  });
  assert.equal((await service.getBookingRevenue())[0]?.totalRevenue, 300);
  await service.deleteBooking(bookingId);
  assert.equal(count.mock.callCount(), 3);
  assert.equal(statuses.mock.callCount(), 1);
  assert.equal(revenue.mock.callCount(), 1);
  assert.equal(find.mock.callCount(), 1);
  assert.equal(remove.mock.callCount(), 1);
});
