import assert from "node:assert/strict";
import { test } from "node:test";
import { PaymentService } from "../../src/modules/payments/services/payment.service.js";
import { ApiError } from "../../src/utils/api-error.js";

test("payment ID lookup rejects malformed identifiers before repository access", async () => {
  await assert.rejects(new PaymentService().getPaymentById("invalid"),
    (error: unknown) => error instanceof ApiError && error.statusCode === 400 && error.code === "INVALID_PAYMENT_ID");
});