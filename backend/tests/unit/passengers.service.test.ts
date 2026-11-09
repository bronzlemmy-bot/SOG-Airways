import assert from "node:assert/strict";
import { test } from "node:test";

import { ApiError } from "../../src/utils/api-error.js";
import { passengerRepository } from "../../src/modules/passengers/repositories/passenger.repository.js";
import { PassengerService } from "../../src/modules/passengers/services/passenger.service.js";
import { makePassenger, passengerCustomerId, passengerId } from "../fixtures/passenger.fixture.js";

const service = new PassengerService();
function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}
const input = {
  customer: passengerCustomerId,
  firstName: "Avery",
  middleName: "J",
  lastName: "Example",
  dateOfBirth: new Date("1990-01-01T00:00:00.000Z"),
  nationality: "US",
  documentType: "passport" as const,
  documentNumber: "P123456",
};

test("createPassenger validates customer, DOB, document expiry, and document uniqueness", async (t) => {
  const exists = t.mock.method(passengerRepository, "documentExists", async () => true);
  const create = t.mock.method(passengerRepository, "create", async () => makePassenger());
  await assert.rejects(service.createPassenger({ ...input, customer: "bad-id" }),
    (e: unknown) => hasApiError(e, 400, "INVALID_CUSTOMER_ID"));
  await assert.rejects(service.createPassenger({ ...input, dateOfBirth: new Date(Date.now() + 60_000) }),
    (e: unknown) => hasApiError(e, 400, "INVALID_PASSENGER_DATE_OF_BIRTH"));
  await assert.rejects(service.createPassenger({ ...input, documentExpiryDate: new Date(Date.now() - 60_000) }),
    (e: unknown) => hasApiError(e, 400, "INVALID_DOCUMENT_EXPIRY_DATE"));
  await assert.rejects(service.createPassenger(input),
    (e: unknown) => hasApiError(e, 409, "PASSENGER_DOCUMENT_EXISTS"));
  assert.equal(exists.mock.callCount(), 1);
  assert.equal(create.mock.callCount(), 0);
});

test("createPassenger returns serialized passenger identity and full name", async (t) => {
  const exists = t.mock.method(passengerRepository, "documentExists", async () => false);
  const create = t.mock.method(passengerRepository, "create", async () => makePassenger());
  const result = await service.createPassenger(input);
  assert.equal(result.id, passengerId);
  assert.equal(result.customer, passengerCustomerId);
  assert.equal(result.fullName, "Avery J Example");
  assert.equal(result.documentNumber, "P123456");
  assert.equal(create.mock.callCount(), 1);
  assert.equal(exists.mock.callCount(), 1);
});

test("getPassengerById rejects invalid IDs and reports missing passengers", async (t) => {
  const find = t.mock.method(passengerRepository, "findById", async () => null);
  await assert.rejects(service.getPassengerById("bad-id"),
    (e: unknown) => hasApiError(e, 400, "INVALID_PASSENGER_ID"));
  assert.equal(find.mock.callCount(), 0);
  await assert.rejects(service.getPassengerById(passengerId),
    (e: unknown) => hasApiError(e, 404, "PASSENGER_NOT_FOUND"));
});

test("updatePassenger enforces document consistency and assistance rules", async (t) => {
  const find = t.mock.method(passengerRepository, "findById", async () => makePassenger());
  const exists = t.mock.method(passengerRepository, "documentExists", async () => false);
  const update = t.mock.method(passengerRepository, "updateById", async (_id, data) => makePassenger(data));
  const result = await service.updatePassenger(passengerId, { firstName: "Updated" });
  assert.equal(result.fullName, "Updated J Example");
  await assert.rejects(service.updatePassenger(passengerId, { documentType: null }),
    (e: unknown) => hasApiError(e, 400, "INCOMPLETE_PASSENGER_DOCUMENT"));
  await assert.rejects(service.updatePassenger(passengerId, { specialAssistanceNotes: "Wheelchair" }),
    (e: unknown) => hasApiError(e, 400, "INVALID_SPECIAL_ASSISTANCE_NOTES"));
  await assert.rejects(service.updatePassenger(passengerId, { dateOfBirth: new Date(Date.now() + 60_000) }),
    (e: unknown) => hasApiError(e, 400, "INVALID_PASSENGER_DATE_OF_BIRTH"));
  assert.equal(find.mock.callCount(), 4);
  assert.equal(update.mock.callCount(), 1);
  assert.equal(exists.mock.callCount(), 2);
});

test("updatePassenger reports duplicate documents, missing records, and failed updates", async (t) => {
  const find = t.mock.method(passengerRepository, "findById", async () => makePassenger());
  const exists = t.mock.method(passengerRepository, "documentExists", async () => true);
  const update = t.mock.method(passengerRepository, "updateById", async () => null);
  await assert.rejects(service.updatePassenger(passengerId, {
    documentNumber: "NEW", documentType: "passport",
  }), (e: unknown) => hasApiError(e, 409, "PASSENGER_DOCUMENT_EXISTS"));
  assert.equal(update.mock.callCount(), 0);
  find.mock.restore();
  t.mock.method(passengerRepository, "findById", async () => null);
  await assert.rejects(service.updatePassenger(passengerId, { firstName: "New" }),
    (e: unknown) => hasApiError(e, 404, "PASSENGER_NOT_FOUND"));
  exists.mock.restore();
  t.mock.method(passengerRepository, "documentExists", async () => false);
  find.mock.restore();
  t.mock.method(passengerRepository, "findById", async () => makePassenger());
  await assert.rejects(service.updatePassenger(passengerId, { firstName: "New" }),
    (e: unknown) => hasApiError(e, 500, "PASSENGER_UPDATE_FAILED"));
});

test("list, delete, customer lookups and statistics delegate to repository", async (t) => {
  const find = t.mock.method(passengerRepository, "findById", async () => makePassenger());
  const remove = t.mock.method(passengerRepository, "deleteById", async () => makePassenger());
  const byCustomer = t.mock.method(passengerRepository, "findByCustomer", async () => [makePassenger()]);
  const many = t.mock.method(passengerRepository, "findMany", async () => [makePassenger()]);
  const count = t.mock.method(passengerRepository, "count", async () => 10);
  const status = t.mock.method(passengerRepository, "countByStatus", async () => ({ active: 7, inactive: 2, blocked: 1 }));
  const grouped = t.mock.method(passengerRepository, "countByCustomer", async () => [{ customer: passengerCustomerId, passengerCount: 1 }]);
  await service.deletePassenger(passengerId);
  assert.equal((await service.getPassengersByCustomer(passengerCustomerId))[0]?.id, passengerId);
  const page = await service.listPassengers({}, { page: 1, limit: 10 });
  assert.equal(page.items[0]?.fullName, "Avery J Example");
  assert.equal(page.pagination.totalItems, 10);
  assert.deepEqual(await service.getPassengerStatistics(), { total: 10, active: 7, inactive: 2, blocked: 1 });
  assert.equal((await service.getPassengerCountsByCustomer())[0]?.passengerCount, 1);
  assert.equal(find.mock.callCount(), 1);
  assert.equal(remove.mock.callCount(), 1);
  assert.equal(byCustomer.mock.callCount(), 1);
  assert.equal(many.mock.callCount(), 1);
  assert.equal(count.mock.callCount(), 2);
  assert.equal(status.mock.callCount(), 1);
  assert.equal(grouped.mock.callCount(), 1);
  await assert.rejects(service.getPassengersByCustomer("bad-id"),
    (e: unknown) => hasApiError(e, 400, "INVALID_CUSTOMER_ID"));
});
