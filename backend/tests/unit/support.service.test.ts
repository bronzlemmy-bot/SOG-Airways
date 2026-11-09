import assert from "node:assert/strict";
import { test } from "node:test";
import { supportCaseRepository } from "../../src/modules/support/repositories/support-case.repository.js";
import { SupportService } from "../../src/modules/support/services/support.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const service = new SupportService();
const caseId = "68a222222222222222222222";
const ownerId = "68a111111111111111111111";
const otherId = "68a333333333333333333333";
const hasError = (status: number) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status;

test("customer case lists are scoped to requester and ignore assignedTo", async (t) => {
  const find = t.mock.method(supportCaseRepository, "findMany", async (filters) => ({ items: [], total: 0 }));
  await service.listCases({ assignedTo: otherId, status: "open" }, ownerId, false);
  assert.deepEqual(find.mock.calls[0]?.arguments[0], { status: "open", customerId: ownerId });
});

test("case access rejects non-owners and returns not found for missing cases", async (t) => {
  const find = t.mock.method(supportCaseRepository, "findById", async () => ({ customerId: otherId } as never));
  await assert.rejects(service.getCaseById(caseId, ownerId, false), hasError(403));
  find.mock.restore();
  t.mock.method(supportCaseRepository, "findById", async () => null);
  await assert.rejects(service.getCaseById(caseId, ownerId, false), hasError(404));
});

test("resolved cases reject new messages and customer messages are persisted with requester identity", async (t) => {
  const find = t.mock.method(supportCaseRepository, "findById", async () => ({
    customerId: ownerId,
    status: "resolved",
  } as never));
  const add = t.mock.method(supportCaseRepository, "addMessage", async () => ({} as never));
  await assert.rejects(service.addMessage(caseId, { message: "Hello" }, ownerId, "customer"), hasError(409));
  assert.equal(add.mock.callCount(), 0);
  find.mock.restore();
  t.mock.method(supportCaseRepository, "findById", async () => ({
    customerId: ownerId,
    status: "open",
  } as never));
  const result = await service.addMessage(caseId, { message: "  Need assistance. " }, ownerId, "customer");
  assert.ok(result);
  assert.equal(add.mock.calls[0]?.arguments[1].message, "Need assistance.");
  assert.equal(add.mock.calls[0]?.arguments[1].senderRole, "customer");
});
