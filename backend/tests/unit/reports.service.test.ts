import assert from "node:assert/strict";
import { test } from "node:test";
import { reportRepository } from "../../src/modules/reports/repositories/report.repository.js";
import { reportService } from "../../src/modules/reports/services/report.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const userId = "68a111111111111111111111";
const reportId = "68a222222222222222222222";
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("report creation validates requester and title before repository calls", async (t) => {
  const create = t.mock.method(reportRepository, "create", async (input) => input);
  await assert.rejects(reportService.create({ title: " ", type: "revenue", requestedBy: userId }),
    hasError(400, "REPORT_TITLE_REQUIRED"));
  await assert.rejects(reportService.create({ title: "Revenue", type: "revenue", requestedBy: "bad" }),
    hasError(400, "INVALID_REPORT_REQUESTER"));
  assert.equal(create.mock.callCount(), 0);
  const report = await reportService.create({ title: "Revenue", type: "revenue", requestedBy: userId });
  assert.equal(report.requestedBy, userId);
});

test("completed status requires a report artifact and queued/failed restrictions are surfaced", async (t) => {
  const updateStatus = t.mock.method(reportRepository, "updateStatus", async () => null);
  await assert.rejects(reportService.updateStatus(reportId, { status: "completed" }),
    hasError(400, "REPORT_FILE_REQUIRED"));
  assert.equal(updateStatus.mock.callCount(), 0);
  const update = t.mock.method(reportRepository, "update", async () => null);
  t.mock.method(reportRepository, "findById", async () => ({ status: "processing" } as never));
  await assert.rejects(reportService.update(reportId, { title: "Changed" }),
    hasError(409, "REPORT_NOT_EDITABLE"));
  assert.equal(update.mock.callCount(), 1);
});

test("user reports are always scoped to the authenticated user", async (t) => {
  const find = t.mock.method(reportRepository, "findForUser", async (id, query) => ({ id, query }));
  const result = await reportService.listForUser(userId, { page: 2 });
  assert.deepEqual(result, { id: userId, query: { page: 2 } });
  assert.deepEqual(find.mock.calls[0]?.arguments, [userId, { page: 2 }]);
});

test("deleteForUser reports not found for missing or non-owned records", async (t) => {
  const remove = t.mock.method(reportRepository, "deleteForUser", async () => null);
  await assert.rejects(reportService.deleteForUser(reportId, userId), hasError(404, "REPORT_NOT_FOUND"));
  assert.deepEqual(remove.mock.calls[0]?.arguments, [reportId, userId]);
});
