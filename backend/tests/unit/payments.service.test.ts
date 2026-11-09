import assert from "node:assert/strict";
import { test } from "node:test";
import { Payment } from "../../src/modules/payments/models/payment.model.js";
import { paymentRepository } from "../../src/modules/payments/repositories/payment.repository.js";
import { PaymentService } from "../../src/modules/payments/services/payment.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const service = new PaymentService();
const paymentId = "68a222222222222222222222";
const bookingId = "68a333333333333333333333";
const customerId = "68a111111111111111111111";
function payment(overrides: Record<string, unknown> = {}) {
  return Payment.hydrate({
    _id: paymentId,
    paymentReference: "SOG-PAY-1001",
    booking: bookingId,
    customer: customerId,
    amount: 100,
    currency: "USD",
    method: "credit_card",
    provider: "manual",
    status: "completed",
    refundedAmount: 0,
    refundStatus: "not_requested",
    metadata: {},
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
    ...overrides,
  });
}
function hasApiError(error: unknown, status: number, code: string): boolean {
  return error instanceof ApiError && error.statusCode === status && error.code === code;
}
const input = {
  booking: bookingId,
  customer: customerId,
  amount: 100,
  currency: "USD",
  method: "credit_card" as const,
  idempotencyKey: "request-1001",
};

test("createPayment validates IDs, amounts, and initial refund state", async (t) => {
  const exists = t.mock.method(paymentRepository, "paymentReferenceExists", async () => false);
  const create = t.mock.method(paymentRepository, "create", async (data) => payment(data));
  await assert.rejects(service.createPayment({ ...input, booking: "bad-id" }),
    (e: unknown) => hasApiError(e, 400, "INVALID_BOOKING_ID"));
  await assert.rejects(service.createPayment({ ...input, customer: "bad-id" }),
    (e: unknown) => hasApiError(e, 400, "INVALID_CUSTOMER_ID"));
  await assert.rejects(service.createPayment({ ...input, amount: 0 }),
    (e: unknown) => hasApiError(e, 400, "INVALID_PAYMENT_AMOUNT"));
  await assert.rejects(service.createPayment({ ...input, refundedAmount: 1 }),
    (e: unknown) => hasApiError(e, 400, "INVALID_INITIAL_REFUND"));
  assert.equal(exists.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
});

test("createPayment checks reference and idempotency uniqueness and initializes refund fields", async (t) => {
  const exists = t.mock.method(paymentRepository, "paymentReferenceExists", async () => false);
  const idempotency = t.mock.method(paymentRepository, "findByIdempotencyKey", async () => null);
  const create = t.mock.method(paymentRepository, "create", async (data) => payment(data));
  const result = await service.createPayment({ ...input, paymentReference: "SOG-PAY-1001" });
  assert.equal(result.paymentReference, "SOG-PAY-1001");
  assert.equal(result.refundedAmount, 0);
  assert.equal(result.refundStatus, "not_requested");
  assert.equal(create.mock.calls[0]?.arguments[0].refundedAmount, 0);
  assert.equal(idempotency.mock.callCount(), 1);

  exists.mock.restore();
  t.mock.method(paymentRepository, "paymentReferenceExists", async () => true);
  await assert.rejects(service.createPayment(input),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_REFERENCE_EXISTS"));
  assert.equal(create.mock.callCount(), 1);

  exists.mock.restore();
  t.mock.method(paymentRepository, "paymentReferenceExists", async () => false);
  idempotency.mock.restore();
  t.mock.method(paymentRepository, "findByIdempotencyKey", async () => payment());
  await assert.rejects(service.createPayment(input),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_IDEMPOTENCY_KEY_EXISTS"));
  assert.equal(create.mock.callCount(), 1);
});

test("payment retrieval validates IDs and reports missing payments", async (t) => {
  const find = t.mock.method(paymentRepository, "findById", async () => null);
  await assert.rejects(service.getPaymentById("bad-id"),
    (e: unknown) => hasApiError(e, 400, "INVALID_PAYMENT_ID"));
  assert.equal(find.mock.callCount(), 0);
  await assert.rejects(service.getPaymentById(paymentId),
    (e: unknown) => hasApiError(e, 404, "PAYMENT_NOT_FOUND"));
});

test("updatePayment protects refund and terminal statuses and sets paidAt on completion", async (t) => {
  const find = t.mock.method(paymentRepository, "findById", async () => payment({ status: "pending" }));
  const update = t.mock.method(paymentRepository, "updateById", async (_id, data) => payment(data));
  const completed = await service.updatePayment(paymentId, { status: "completed" });
  assert.equal(completed.status, "completed");
  assert.ok(update.mock.calls[0]?.arguments[1].paidAt instanceof Date);

  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment({ status: "refunded" }));
  await assert.rejects(service.updatePayment(paymentId, { notes: "x" }),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_REFUND_REQUIRES_REFUND_WORKFLOW"));
  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment({ status: "failed" }));
  await assert.rejects(service.updatePayment(paymentId, { notes: "x" }),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_TERMINAL_STATUS"));
  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment());
  await assert.rejects(service.updatePayment(paymentId, { status: "refunded" }),
    (e: unknown) => hasApiError(e, 400, "USE_PAYMENT_REFUND_WORKFLOW"));
  assert.equal(update.mock.callCount(), 1);
});

test("refundPayment records partial and full refunds and rejects invalid states or amounts", async (t) => {
  const find = t.mock.method(paymentRepository, "findById", async () => payment());
  const update = t.mock.method(paymentRepository, "updateById", async (_id, data) => payment(data));
  const partial = await service.refundPayment(paymentId, { amount: 30, reason: "  Change  " });
  assert.equal(partial.status, "partially_refunded");
  assert.equal(partial.refundedAmount, 30);
  assert.equal(update.mock.calls[0]?.arguments[1].notes, "Refund reason: Change");

  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment({ refundedAmount: 30, status: "partially_refunded" }));
  const full = await service.refundPayment(paymentId, { amount: 70 });
  assert.equal(full.status, "refunded");
  assert.equal(full.refundedAmount, 100);

  await assert.rejects(service.refundPayment(paymentId, { amount: 80 }),
    (e: unknown) => hasApiError(e, 400, "INVALID_REFUND_AMOUNT"));
  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment({ status: "pending" }));
  await assert.rejects(service.refundPayment(paymentId, {}),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_NOT_REFUNDABLE"));
});

test("payment deletion protects completed records; list, count, stats and revenue delegate", async (t) => {
  const find = t.mock.method(paymentRepository, "findById", async () => payment());
  const remove = t.mock.method(paymentRepository, "deleteById", async () => payment());
  const many = t.mock.method(paymentRepository, "findMany", async () => [payment()]);
  const count = t.mock.method(paymentRepository, "count", async () => 5);
  const statuses = t.mock.method(paymentRepository, "countByStatus", async () => ({
    pending: 1, processing: 0, completed: 2, failed: 0, cancelled: 0, refunded: 1, partially_refunded: 1,
  }));
  const revenue = t.mock.method(paymentRepository, "getRevenueByCurrency", async () => []);

  await assert.rejects(service.deletePayment(paymentId),
    (e: unknown) => hasApiError(e, 409, "PAYMENT_RECORD_PROTECTED"));
  find.mock.restore();
  t.mock.method(paymentRepository, "findById", async () => payment({ status: "pending" }));
  await service.deletePayment(paymentId);
  const page = await service.listPayments({}, { page: 1, limit: 10 });
  assert.equal(page.items[0]?.id, paymentId);
  assert.equal(await service.countPayments(), 5);
  assert.deepEqual(await service.getPaymentStatistics(), {
    total: 5, pending: 1, processing: 0, completed: 2, failed: 0, cancelled: 0, refunded: 1, partially_refunded: 1,
  });
  assert.deepEqual(await service.getPaymentRevenue(), []);
  assert.equal(remove.mock.callCount(), 1);
  assert.equal(many.mock.callCount(), 1);
  assert.equal(count.mock.callCount(), 3);
  assert.equal(statuses.mock.callCount(), 1);
  assert.equal(revenue.mock.callCount(), 1);
});
