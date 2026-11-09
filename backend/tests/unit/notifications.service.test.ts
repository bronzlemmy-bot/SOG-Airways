import assert from "node:assert/strict";
import { test } from "node:test";
import { notificationRepository } from "../../src/modules/notifications/repositories/notification.repository.js";
import { notificationService } from "../../src/modules/notifications/services/notification.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const recipientId = "68a111111111111111111111";
const notificationId = "68a222222222222222222222";
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("create requires recipient and delegates valid notifications", async (t) => {
  const create = t.mock.method(notificationRepository, "create", async (input) => input);
  await assert.rejects(notificationService.create({ recipient: "", title: "Notice", message: "Test" }),
    hasError(400, "NOTIFICATION_RECIPIENT_REQUIRED"));
  assert.equal(create.mock.callCount(), 0);
  const result = await notificationService.create({ recipient: recipientId, title: "Notice", message: "Test" });
  assert.equal(result.recipient, recipientId);
  assert.equal(create.mock.callCount(), 1);
});

test("recipient-scoped archive and delete do not return another user's notifications", async (t) => {
  const archive = t.mock.method(notificationRepository, "archive", async () => null);
  const remove = t.mock.method(notificationRepository, "deleteForRecipient", async () => null);
  await assert.rejects(notificationService.archive(notificationId, recipientId),
    hasError(404, "NOTIFICATION_NOT_FOUND_OR_ARCHIVED"));
  await assert.rejects(notificationService.deleteForRecipient(notificationId, recipientId),
    hasError(404, "NOTIFICATION_NOT_FOUND"));
  assert.deepEqual(archive.mock.calls[0]?.arguments, [notificationId, recipientId]);
  assert.deepEqual(remove.mock.calls[0]?.arguments, [notificationId, recipientId]);
});

test("bulk read rejects malformed notification identifiers", async (t) => {
  const mark = t.mock.method(notificationRepository, "markManyAsRead", async () => ({}));
  await assert.rejects(notificationService.markManyAsRead(recipientId, { notificationIds: ["bad"] }),
    hasError(400, "INVALID_NOTIFICATION_ID"));
  assert.equal(mark.mock.callCount(), 0);
  await notificationService.markManyAsRead(recipientId, {});
  assert.deepEqual(mark.mock.calls[0]?.arguments, [recipientId, {}]);
});
