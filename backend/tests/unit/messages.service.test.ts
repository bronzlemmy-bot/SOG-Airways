import assert from "node:assert/strict";
import { test } from "node:test";
import { conversationRepository } from "../../src/modules/messages/repositories/conversation.repository.js";
import { messageRepository } from "../../src/modules/messages/repositories/message.repository.js";
import { conversationService } from "../../src/modules/messages/services/conversation.service.js";
import { messageService } from "../../src/modules/messages/services/message.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const userId = "68a111111111111111111111";
const otherId = "68a222222222222222222222";
const conversationId = "68a333333333333333333333";
const messageId = "68a444444444444444444444";
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("conversation creation includes the creator and validates participant count", async (t) => {
  const create = t.mock.method(conversationRepository, "create", async (input) => input);
  const result = await conversationService.create({ subject: "Help", participants: [otherId] }, userId);
  assert.deepEqual(result.participants, [otherId, userId]);
  assert.equal(result.createdBy, userId);
  assert.equal(create.mock.callCount(), 1);
  await assert.rejects(conversationService.create({ subject: "Help", participants: [] }, "bad"),
    hasError(400, "INVALID_CREATOR_ID"));
});

test("closed conversations cannot be reopened through status updates", async (t) => {
  const find = t.mock.method(conversationRepository, "findByIdForUpdate", async () => ({
    status: "closed",
    participants: [userId],
  } as never));
  const update = t.mock.method(conversationRepository, "updateStatus", async () => ({}));
  await assert.rejects(conversationService.updateStatus(conversationId, "open", userId),
    hasError(409, "CONVERSATION_ALREADY_CLOSED"));
  assert.equal(update.mock.callCount(), 0);
  assert.equal(find.mock.callCount(), 1);
});

test("only a message recipient can mark it read, and read messages cannot be failed", async (t) => {
  const find = t.mock.method(messageRepository, "findByIdForUpdate", async () => ({
    recipient: otherId,
    sender: userId,
    conversationId,
    status: "sent",
  } as never));
  const markRead = t.mock.method(messageRepository, "markAsRead", async () => ({}));
  await assert.rejects(messageService.markAsRead(messageId, userId),
    hasError(403, "MESSAGE_READ_FORBIDDEN"));
  assert.equal(markRead.mock.callCount(), 0);
  find.mock.restore();
  t.mock.method(messageRepository, "findByIdForUpdate", async () => ({
    recipient: otherId,
    sender: userId,
    conversationId,
    status: "read",
  } as never));
  const markFailed = t.mock.method(messageRepository, "markAsFailed", async () => ({}));
  await assert.rejects(messageService.markAsFailed(messageId, "delivery failed"),
    hasError(409, "MESSAGE_FAILURE_CONFLICT"));
  assert.equal(markFailed.mock.callCount(), 0);
});

test("message update requires a failure reason and sender-only delete", async (t) => {
  const find = t.mock.method(messageRepository, "findByIdForUpdate", async () => ({
    sender: otherId,
    status: "sent",
  } as never));
  const update = t.mock.method(messageRepository, "update", async () => ({}));
  const remove = t.mock.method(messageRepository, "delete", async () => ({}));
  await assert.rejects(messageService.update(messageId, { status: "failed" }),
    hasError(400, "FAILED_REASON_REQUIRED"));
  assert.equal(update.mock.callCount(), 0);
  await assert.rejects(messageService.delete(messageId, userId),
    hasError(403, "MESSAGE_DELETE_FORBIDDEN"));
  assert.equal(remove.mock.callCount(), 0);
  assert.equal(find.mock.callCount(), 2);
});
