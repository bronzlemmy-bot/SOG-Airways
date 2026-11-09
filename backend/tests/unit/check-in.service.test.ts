import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError } from "../../src/utils/api-error.js";
import { checkInRepository } from "../../src/modules/check-in/repositories/check-in.repository.js";
import { CheckInService } from "../../src/modules/check-in/services/check-in.service.js";
import {
  checkInBookingId,
  checkInCustomerId,
  checkInFlightId,
  checkInId,
  checkInPassengerId,
  checkInTicketId,
  makeCheckIn,
} from "../fixtures/check-in.fixture.js";

const service = new CheckInService();
const input = {
  booking: checkInBookingId,
  ticket: checkInTicketId,
  passenger: checkInPassengerId,
  flight: checkInFlightId,
  customer: checkInCustomerId,
};
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("createCheckIn rejects duplicate ticket or passenger-flight combination", async (t) => {
  const ticket = t.mock.method(checkInRepository, "findByTicket", async () => makeCheckIn());
  const combo = t.mock.method(checkInRepository, "findByBookingPassengerAndFlight", async () => null);
  const create = t.mock.method(checkInRepository, "create", async () => makeCheckIn());
  await assert.rejects(service.createCheckIn(input), hasError(409, "CHECK_IN_ALREADY_EXISTS"));
  assert.equal(combo.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
  ticket.mock.restore();
  t.mock.method(checkInRepository, "findByTicket", async () => null);
  t.mock.method(checkInRepository, "findByBookingPassengerAndFlight", async () => makeCheckIn());
  await assert.rejects(service.createCheckIn(input), hasError(409, "DUPLICATE_CHECK_IN"));
  assert.equal(create.mock.callCount(), 0);
});

test("createCheckIn maps created records and rejects invalid object IDs", async (t) => {
  const ticket = t.mock.method(checkInRepository, "findByTicket", async () => null);
  t.mock.method(checkInRepository, "findByBookingPassengerAndFlight", async () => null);
  let receivedInput: typeof input | undefined;
  const create = t.mock.method(checkInRepository, "create", async (values) => {
    receivedInput = values;
    return makeCheckIn();
  });
  const result = await service.createCheckIn({ ...input, status: "checked_in" });
  assert.equal(result.id, checkInId);
  assert.equal(result.ticket, checkInTicketId);
  assert.ok(receivedInput?.checkedInAt instanceof Date);
  assert.equal(create.mock.callCount(), 1);
  await assert.rejects(service.createCheckIn({ ...input, flight: "invalid" }), hasError(400, "INVALID_OBJECT_ID"));
  assert.equal(ticket.mock.callCount(), 1);
});

test("check-in and boarding pass transitions reject invalid states", async (t) => {
  const find = t.mock.method(checkInRepository, "findById", async () => makeCheckIn());
  const update = t.mock.method(checkInRepository, "update", async (_id, values) => makeCheckIn(values));
  const result = await service.updateCheckIn(checkInId, { status: "checked_in" });
  assert.equal(result.status, "checked_in");
  await assert.rejects(service.updateCheckIn(checkInId, { boardingPassStatus: "used" }),
    hasError(400, "INVALID_BOARDING_PASS_TRANSITION"));
  assert.equal(update.mock.callCount(), 1);
  find.mock.restore();
  t.mock.method(checkInRepository, "findById", async () => makeCheckIn({ status: "cancelled" }));
  await assert.rejects(service.updateCheckIn(checkInId, { status: "checked_in" }),
    hasError(400, "INVALID_CHECK_IN_STATUS_TRANSITION"));
  assert.equal(update.mock.callCount(), 1);
});

test("used boarding passes cannot be cancelled or deleted", async (t) => {
  t.mock.method(checkInRepository, "findById", async () =>
    makeCheckIn({ boardingPassStatus: "used", boardingPassIssuedAt: new Date() }));
  const update = t.mock.method(checkInRepository, "update", async (_id, values) => makeCheckIn(values));
  const remove = t.mock.method(checkInRepository, "delete", async () => makeCheckIn());
  await assert.rejects(service.cancelCheckIn(checkInId, "customer request"),
    hasError(400, "USED_BOARDING_PASS_CANNOT_BE_CANCELLED"));
  await assert.rejects(service.deleteCheckIn(checkInId),
    hasError(400, "USED_BOARDING_PASS_CANNOT_BE_DELETED"));
  assert.equal(update.mock.callCount(), 0);
  assert.equal(remove.mock.callCount(), 0);
});

test("customer check-in queries validate pagination and return mapped records", async (t) => {
  const find = t.mock.method(checkInRepository, "findByCustomer", async () => [makeCheckIn()]);
  const result = await service.getCustomerCheckIns(checkInCustomerId, { page: 1, limit: 20 });
  assert.equal(result[0]?.id, checkInId);
  assert.deepEqual(find.mock.calls[0]?.arguments, [checkInCustomerId, { page: 1, limit: 20 }]);
  await assert.rejects(service.getCustomerCheckIns(checkInCustomerId, { page: 0, limit: 20 }),
    hasError(400, "INVALID_PAGE"));
});

test("customer check-in reads and changes are restricted to their linked profile", async (t) => {
  const find = t.mock.method(checkInRepository, "findById", async () => makeCheckIn());
  const findByReference = t.mock.method(
    checkInRepository,
    "findByReference",
    async () => makeCheckIn(),
  );
  const update = t.mock.method(
    checkInRepository,
    "update",
    async (_id, values) => makeCheckIn(values),
  );

  await assert.rejects(
    service.getCheckInById(checkInId, "68a888888888888888888888"),
    hasError(404, "CHECK_IN_NOT_FOUND"),
  );
  await assert.rejects(
    service.getCheckInByReference(
      "SOG-CI-1001",
      "68a888888888888888888888",
    ),
    hasError(404, "CHECK_IN_NOT_FOUND"),
  );
  await assert.rejects(
    service.cancelCheckIn(
      checkInId,
      "Customer requested cancellation",
      "68a888888888888888888888",
    ),
    hasError(404, "CHECK_IN_NOT_FOUND"),
  );

  assert.equal(find.mock.callCount(), 2);
  assert.equal(findByReference.mock.callCount(), 1);
  assert.equal(update.mock.callCount(), 0);

  const ownRecord = await service.getCheckInById(
    checkInId,
    checkInCustomerId,
  );
  assert.equal(ownRecord.customer, checkInCustomerId);
});
