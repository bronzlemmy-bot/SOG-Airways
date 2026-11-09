import assert from "node:assert/strict";
import { test } from "node:test";
import { Types } from "mongoose";

import { ApiError } from "../../src/utils/api-error.js";
import { User } from "../../src/modules/users/models/user.model.js";
import { staffRepository } from "../../src/modules/staff/repositories/staff.repository.js";
import { StaffService } from "../../src/modules/staff/services/staff.service.js";

const service = new StaffService();
const staffId = "68a222222222222222222222";
const userId = "68a111111111111111111111";
const createdAt = new Date("2025-01-01T00:00:00.000Z");
const hireDate = new Date("2020-05-01T00:00:00.000Z");
const updatedAt = new Date("2025-01-02T00:00:00.000Z");

function staff(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(staffId),
    userId: new Types.ObjectId(userId),
    employeeNumber: "SG-123",
    department: "flight_operations" as const,
    jobTitle: "Dispatcher",
    employmentStatus: "active" as const,
    hireDate,
    terminationDate: null,
    notes: "Example notes",
    createdAt,
    updatedAt,
    ...overrides,
  };
}

function hasApiError(error: unknown, status: number, code: string): boolean {
  return (
    error instanceof ApiError &&
    error.statusCode === status &&
    error.code === code
  );
}

test("get staff profiles return serialized data and missing records return 404", async (t) => {
  const findById = t.mock.method(staffRepository, "findById", async () => staff());
  const findByUserId = t.mock.method(staffRepository, "findByUserId", async () => staff());

  const result = await service.getStaffProfileById(staffId);
  assert.equal(result.id, staffId);
  assert.equal(result.userId, userId);
  assert.equal(result.hireDate, hireDate.toISOString());
  assert.equal(result.terminationDate, null);
  assert.equal(findById.mock.callCount(), 1);

  assert.equal((await service.getStaffProfileByUserId(userId)).employeeNumber, "SG-123");
  assert.equal(findByUserId.mock.callCount(), 1);

  findById.mock.restore();
  t.mock.method(staffRepository, "findById", async () => null);
  await assert.rejects(
    service.getStaffProfileById(staffId),
    (error: unknown) => hasApiError(error, 404, "STAFF_PROFILE_NOT_FOUND"),
  );
});

test("createStaffProfile verifies active staff user, uniqueness, and maps duplicate-key races", async (t) => {
  const userQuery = {
    select() { return this; },
    lean() { return this; },
    exec: async () => ({ role: "staff", status: "active" }),
  };
  const findUser = t.mock.method(User, "findById", () => userQuery as never);
  const findByUser = t.mock.method(staffRepository, "findByUserId", async () => null);
  const employeeExists = t.mock.method(staffRepository, "employeeNumberExists", async () => false);
  const create = t.mock.method(staffRepository, "create", async (data) => staff({
    employeeNumber: data.employeeNumber,
    hireDate: data.hireDate,
  }));

  const result = await service.createStaffProfile({
    userId,
    employeeNumber: "sg-123",
    department: "flight_operations",
    jobTitle: "Dispatcher",
    hireDate: "2020-05-01",
  });
  assert.equal(result.employeeNumber, "sg-123");
  assert.equal(result.hireDate, hireDate.toISOString());
  assert.equal(findUser.mock.callCount(), 1);
  assert.equal(findByUser.mock.callCount(), 1);
  assert.equal(employeeExists.mock.calls[0]?.arguments[0], "sg-123");
  assert.equal(create.mock.callCount(), 1);

  create.mock.restore();
  t.mock.method(staffRepository, "create", async () => {
    throw { code: 11000 };
  });
  await assert.rejects(
    service.createStaffProfile({
      userId,
      employeeNumber: "SG-123",
      department: "flight_operations",
      jobTitle: "Dispatcher",
      hireDate: "2020-05-01",
    }),
    (error: unknown) => hasApiError(error, 409, "STAFF_DUPLICATE_RECORD"),
  );
});

test("createStaffProfile rejects missing, non-staff, inactive, existing, duplicate, future and invalid inputs", async (t) => {
  let queriedUser: { role: string; status: string } | null = null;
  const userQuery = {
    select() { return this; },
    lean() { return this; },
    exec: async () => queriedUser,
  };
  t.mock.method(User, "findById", () => userQuery as never);
  const findByUser = t.mock.method(staffRepository, "findByUserId", async () => null);
  const employeeExists = t.mock.method(staffRepository, "employeeNumberExists", async () => false);
  const create = t.mock.method(staffRepository, "create", async () => staff());

  const input = {
    userId,
    employeeNumber: "SG-123",
    department: "flight_operations" as const,
    jobTitle: "Dispatcher",
    hireDate: "2020-05-01",
  };
  await assert.rejects(
    service.createStaffProfile(input),
    (error: unknown) => hasApiError(error, 404, "STAFF_USER_NOT_FOUND"),
  );
  queriedUser = { role: "customer", status: "active" };
  await assert.rejects(
    service.createStaffProfile(input),
    (error: unknown) => hasApiError(error, 400, "USER_IS_NOT_STAFF"),
  );
  queriedUser = { role: "staff", status: "suspended" };
  await assert.rejects(
    service.createStaffProfile(input),
    (error: unknown) => hasApiError(error, 403, "STAFF_USER_NOT_ACTIVE"),
  );
  queriedUser = { role: "staff", status: "active" };
  findByUser.mock.restore();
  t.mock.method(staffRepository, "findByUserId", async () => staff());
  await assert.rejects(
    service.createStaffProfile(input),
    (error: unknown) => hasApiError(error, 409, "STAFF_PROFILE_ALREADY_EXISTS"),
  );
  assert.equal(employeeExists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);

  findByUser.mock.restore();
  t.mock.method(staffRepository, "findByUserId", async () => null);
  employeeExists.mock.restore();
  t.mock.method(staffRepository, "employeeNumberExists", async () => true);
  await assert.rejects(
    service.createStaffProfile(input),
    (error: unknown) => hasApiError(error, 409, "EMPLOYEE_NUMBER_ALREADY_EXISTS"),
  );

  employeeExists.mock.restore();
  t.mock.method(staffRepository, "employeeNumberExists", async () => false);
  await assert.rejects(
    service.createStaffProfile({ ...input, hireDate: "not-a-date" }),
    (error: unknown) => hasApiError(error, 400, "INVALID_STAFF_DATE"),
  );
  await assert.rejects(
    service.createStaffProfile({ ...input, hireDate: "2999-01-01" }),
    (error: unknown) => hasApiError(error, 400, "INVALID_HIRE_DATE"),
  );
  assert.equal(create.mock.callCount(), 0);
});

test("updateStaffProfile enforces termination and uniqueness rules", async (t) => {
  t.mock.method(staffRepository, "findById", async () => staff());
  const employeeExists = t.mock.method(staffRepository, "employeeNumberExists", async () => false);
  const update = t.mock.method(staffRepository, "updateById", async (_id, data) => staff(data));

  const terminated = await service.updateStaffProfile(staffId, {
    employmentStatus: "terminated",
    terminationDate: "2024-01-01",
  });
  assert.equal(terminated.employmentStatus, "terminated");
  assert.equal(update.mock.calls[0]?.arguments[1].terminationDate?.toISOString(), "2024-01-01T00:00:00.000Z");

  await assert.rejects(
    service.updateStaffProfile(staffId, { employmentStatus: "terminated" }),
    (error: unknown) => hasApiError(error, 400, "TERMINATION_DATE_REQUIRED"),
  );
  await assert.rejects(
    service.updateStaffProfile(staffId, {
      employmentStatus: "active",
      terminationDate: "2024-01-01",
    }),
    (error: unknown) => hasApiError(error, 400, "TERMINATION_STATUS_MISMATCH"),
  );
  await assert.rejects(
    service.updateStaffProfile(staffId, { hireDate: "2999-01-01" }),
    (error: unknown) => hasApiError(error, 400, "INVALID_HIRE_DATE"),
  );
  await assert.rejects(
    service.updateStaffProfile(staffId, { terminationDate: "2019-01-01" }),
    (error: unknown) => hasApiError(error, 400, "INVALID_TERMINATION_DATE"),
  );
  assert.equal(update.mock.callCount(), 1);

  employeeExists.mock.restore();
  t.mock.method(staffRepository, "employeeNumberExists", async () => true);
  await assert.rejects(
    service.updateStaffProfile(staffId, { employeeNumber: "SG-999" }),
    (error: unknown) => hasApiError(error, 409, "EMPLOYEE_NUMBER_ALREADY_EXISTS"),
  );
});

test("updateStaffProfile maps missing records and duplicate-key races", async (t) => {
  const find = t.mock.method(staffRepository, "findById", async () => null);
  const update = t.mock.method(staffRepository, "updateById", async () => staff());

  await assert.rejects(
    service.updateStaffProfile(staffId, { jobTitle: "Pilot" }),
    (error: unknown) => hasApiError(error, 404, "STAFF_PROFILE_NOT_FOUND"),
  );
  assert.equal(find.mock.callCount(), 1);
  assert.equal(update.mock.callCount(), 0);

  find.mock.restore();
  t.mock.method(staffRepository, "findById", async () => staff());
  t.mock.method(staffRepository, "employeeNumberExists", async () => false);
  t.mock.method(staffRepository, "updateById", async () => {
    throw { code: 11000 };
  });
  await assert.rejects(
    service.updateStaffProfile(staffId, { employeeNumber: "SG-999" }),
    (error: unknown) => hasApiError(error, 409, "EMPLOYEE_NUMBER_ALREADY_EXISTS"),
  );
});

test("list, delete, and count delegate and report results", async (t) => {
  const findMany = t.mock.method(staffRepository, "findMany", async () => ({
    items: [staff()],
    totalItems: 11,
  }));
  const remove = t.mock.method(staffRepository, "deleteById", async () => true);
  const count = t.mock.method(staffRepository, "count", async () => 4);

  const result = await service.listStaffProfiles(
    { department: "flight_operations" },
    { page: 2, limit: 5 },
  );
  assert.equal(result.items[0]?.employeeNumber, "SG-123");
  assert.equal(result.pagination.totalPages, 3);
  assert.deepEqual(findMany.mock.calls[0]?.arguments, [
    { department: "flight_operations" },
    { page: 2, limit: 5 },
  ]);
  await service.deleteStaffProfile(staffId);
  assert.equal(await service.countStaffProfiles(), 4);
  assert.equal(remove.mock.calls[0]?.arguments[0], staffId);
  assert.equal(count.mock.callCount(), 1);

  remove.mock.restore();
  t.mock.method(staffRepository, "deleteById", async () => false);
  await assert.rejects(
    service.deleteStaffProfile(staffId),
    (error: unknown) => hasApiError(error, 404, "STAFF_PROFILE_NOT_FOUND"),
  );
});
