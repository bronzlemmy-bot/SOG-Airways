
import mongoose, { type ClientSession } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";

import { paymentRepository } from "../repositories/payment.repository.js";
import { Payment } from "../models/payment.model.js";
import type { CreateDemoPaymentInput } from "../types/payment.types.js";

import type {
  CreatePaymentInput,
  PaymentCountResult,
  PaymentFilters,
  PaymentPaginationOptions,
  PaymentProfileResponse,
  PaymentRevenueResult,
  PaginatedPayments,
  RefundPaymentInput,
  UpdatePaymentInput,
} from "../types/payment.types.js";

import type { PaymentRecord } from "../models/payment.model.js";

function getSafeMetadata(value: unknown): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return {};
  }

  const metadata = value as Record<string, unknown>;
  if (metadata.mode !== "DEMO" || metadata.demo !== true) {
    return {};
  }

  return {
    mode: "DEMO",
    demo: true,
    ...(metadata.outcome === "approved" ||
    metadata.outcome === "declined" ||
    metadata.outcome === "error"
      ? { outcome: metadata.outcome }
      : {}),
    ...(metadata.method === "demo-wallet" ||
    metadata.method === "demo-bank-transfer"
      ? { method: metadata.method }
      : {}),
  };
}

function toPaymentResponse(
  payment: PaymentRecord,
): PaymentProfileResponse {
  return {
    id: payment._id.toString(),
    paymentReference: payment.paymentReference,
    booking: payment.booking.toString(),
    customer: payment.customer.toString(),
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    provider: payment.provider,
    status: payment.status,
    providerTransactionId:
      payment.providerTransactionId ?? undefined,
    description: payment.description ?? undefined,
    failureCode: payment.failureCode ?? undefined,
    failureReason: payment.failureReason ?? undefined,
    paidAt: payment.paidAt ?? undefined,
    refundedAmount: payment.refundedAmount,
    refundStatus: payment.refundStatus,
    refundedAt: payment.refundedAt ?? undefined,
    refundReference: payment.refundReference ?? undefined,
    metadata: getSafeMetadata(payment.metadata),
    notes: payment.notes ?? undefined,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = new mongoose.Types.ObjectId()
    .toString()
    .slice(-8)
    .toUpperCase();

  return `SOG-PAY-${timestamp}-${randomPart}`;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export class PaymentService {
  async createDemoPayment(
    input: CreateDemoPaymentInput,
    session: ClientSession,
  ): Promise<PaymentProfileResponse> {
    const approved = input.outcome === "approved";
    const suffix = new mongoose.Types.ObjectId().toString().toUpperCase();
    const payment = new Payment({
      paymentReference: `SOG-DEMO-PAY-${suffix}`,
      booking: input.booking,
      customer: input.customer,
      amount: input.amount,
      currency: input.currency,
      method: "other",
      provider: "manual",
      status: approved ? "completed" : "failed",
      providerTransactionId: `DEMO-TXN-${suffix}`,
      idempotencyKey: input.idempotencyKey,
      description: "DEMO MONEY ONLY - no funds were moved.",
      failureCode: approved
        ? null
        : input.outcome === "declined"
          ? "DEMO_DECLINED"
          : "DEMO_TECHNICAL_FAILURE",
      failureReason: approved
        ? null
        : input.outcome === "declined"
          ? "The simulated demo payment was declined."
          : "The simulated demo payment encountered a technical failure.",
      paidAt: approved ? new Date() : null,
      refundedAmount: 0,
      refundStatus: "not_requested",
      metadata: {
        mode: "DEMO",
        demo: true,
        outcome: input.outcome,
        method: input.method,
      },
    });

    await payment.save({ session });
    return toPaymentResponse(payment);
  }

  async createPayment(
    input: CreatePaymentInput,
  ): Promise<PaymentProfileResponse> {
    if (!mongoose.isValidObjectId(input.booking)) {
      throw new ApiError("Invalid booking ID.", 400, {
        code: "INVALID_BOOKING_ID",
      });
    }

    if (!mongoose.isValidObjectId(input.customer)) {
      throw new ApiError("Invalid customer ID.", 400, {
        code: "INVALID_CUSTOMER_ID",
      });
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new ApiError("Payment amount must be greater than zero.", 400, {
        code: "INVALID_PAYMENT_AMOUNT",
      });
    }

    if (
      input.refundedAmount !== undefined &&
      input.refundedAmount !== 0
    ) {
      throw new ApiError(
        "New payments cannot be created with an existing refund amount.",
        400,
        { code: "INVALID_INITIAL_REFUND" },
      );
    }

    const paymentReference =
      input.paymentReference ?? generatePaymentReference();

    if (
      await paymentRepository.paymentReferenceExists(paymentReference)
    ) {
      throw new ApiError(
        "A payment with this reference already exists.",
        409,
        { code: "PAYMENT_REFERENCE_EXISTS" },
      );
    }

    if (input.idempotencyKey) {
      const existing =
        await paymentRepository.findByIdempotencyKey(
          input.idempotencyKey,
        );

      if (existing) {
        throw new ApiError(
          "A payment with this idempotency key already exists.",
          409,
          { code: "PAYMENT_IDEMPOTENCY_KEY_EXISTS" },
        );
      }
    }

    const payment = await paymentRepository.create({
      ...input,
      paymentReference,
      refundedAmount: 0,
      refundStatus: "not_requested",
      refundedAt: null,
      refundReference: null,
    });

    return toPaymentResponse(payment);
  }

  async getPaymentById(
    paymentId: string,
  ): Promise<PaymentProfileResponse> {
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError("Invalid payment ID.", 400, {
        code: "INVALID_PAYMENT_ID",
      });
    }

    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    return toPaymentResponse(payment);
  }

  async getPaymentByIdForAccess(
    paymentId: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<PaymentProfileResponse> {
    const payment = await this.getPaymentById(paymentId);

    if (!isAdmin && (!customerId || payment.customer !== customerId)) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    return payment;
  }

  async getPaymentByReference(
    paymentReference: string,
  ): Promise<PaymentProfileResponse> {
    const payment =
      await paymentRepository.findByReference(paymentReference);

    if (!payment) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    return toPaymentResponse(payment);
  }

  async getPaymentByReferenceForAccess(
    paymentReference: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<PaymentProfileResponse> {
    const payment = await this.getPaymentByReference(paymentReference);

    if (!isAdmin && (!customerId || payment.customer !== customerId)) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    return payment;
  }

  async listPayments(
    filters: PaymentFilters,
    pagination: PaymentPaginationOptions,
  ): Promise<PaginatedPayments> {
    const [payments, totalItems] = await Promise.all([
      paymentRepository.findMany(filters, pagination),
      paymentRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: payments.map(toPaymentResponse),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1 && totalItems > 0,
      },
    };
  }

  async updatePayment(
    paymentId: string,
    input: UpdatePaymentInput,
  ): Promise<PaymentProfileResponse> {
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError("Invalid payment ID.", 400, {
        code: "INVALID_PAYMENT_ID",
      });
    }

    const existing = await paymentRepository.findById(paymentId);

    if (!existing) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    if (
      existing.status === "refunded" ||
      existing.status === "partially_refunded"
    ) {
      throw new ApiError(
        "Use the refund workflow to modify a refunded payment.",
        409,
        { code: "PAYMENT_REFUND_REQUIRES_REFUND_WORKFLOW" },
      );
    }

    if (
      existing.status === "cancelled" ||
      existing.status === "failed"
    ) {
      throw new ApiError(
        "A cancelled or failed payment cannot be updated.",
        409,
        { code: "PAYMENT_TERMINAL_STATUS" },
      );
    }

    if (
      input.status === "refunded" ||
      input.status === "partially_refunded"
    ) {
      throw new ApiError(
        "Use the refund workflow to record a refund.",
        400,
        { code: "USE_PAYMENT_REFUND_WORKFLOW" },
      );
    }

    if (
      input.status === "completed" &&
      !existing.paidAt &&
      !input.paidAt
    ) {
      input = { ...input, paidAt: new Date() };
    }

    const updated = await paymentRepository.updateById(
      paymentId,
      input,
    );

    if (!updated) {
      throw new ApiError("Payment could not be updated.", 500, {
        code: "PAYMENT_UPDATE_FAILED",
      });
    }

    return toPaymentResponse(updated);
  }

  async refundPayment(
    paymentId: string,
    input: RefundPaymentInput,
  ): Promise<PaymentProfileResponse> {
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError("Invalid payment ID.", 400, {
        code: "INVALID_PAYMENT_ID",
      });
    }

    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    if (payment.status !== "completed" &&
        payment.status !== "partially_refunded") {
      throw new ApiError(
        "Only completed or partially refunded payments can be refunded.",
        409,
        { code: "PAYMENT_NOT_REFUNDABLE" },
      );
    }

    const remainingAmount = roundMoney(
      payment.amount - payment.refundedAmount,
    );

    const refundAmount = roundMoney(
      input.amount ?? remainingAmount,
    );

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > remainingAmount
    ) {
      throw new ApiError(
        "Refund amount must be greater than zero and no greater than the remaining refundable amount.",
        400,
        { code: "INVALID_REFUND_AMOUNT" },
      );
    }

    const refundedAmount = roundMoney(
      payment.refundedAmount + refundAmount,
    );

    const isFullyRefunded =
      refundedAmount >= payment.amount;

    const refundReference =
      input.refundReference?.trim() ||
      `SOG-REF-${new mongoose.Types.ObjectId().toString().toUpperCase()}`;

    const updated = await paymentRepository.updateById(paymentId, {
      status: isFullyRefunded ? "refunded" : "partially_refunded",
      refundedAmount,
      refundStatus: "completed",
      refundedAt: new Date(),
      refundReference,
      notes: input.reason?.trim()
        ? [payment.notes, `Refund reason: ${input.reason.trim()}`]
            .filter(Boolean)
            .join("\n")
        : payment.notes,
    });

    if (!updated) {
      throw new ApiError("Payment refund could not be recorded.", 500, {
        code: "PAYMENT_REFUND_FAILED",
      });
    }

    return toPaymentResponse(updated);
  }

  async deletePayment(paymentId: string): Promise<void> {
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError("Invalid payment ID.", 400, {
        code: "INVALID_PAYMENT_ID",
      });
    }

    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new ApiError("Payment not found.", 404, {
        code: "PAYMENT_NOT_FOUND",
      });
    }

    if (
      payment.status === "completed" ||
      payment.status === "refunded" ||
      payment.status === "partially_refunded"
    ) {
      throw new ApiError(
        "Completed or refunded payment records cannot be deleted.",
        409,
        { code: "PAYMENT_RECORD_PROTECTED" },
      );
    }

    await paymentRepository.deleteById(paymentId);
  }

  async countPayments(
    filters: PaymentFilters = {},
  ): Promise<number> {
    return paymentRepository.count(filters);
  }

  async getPaymentStatistics(): Promise<PaymentCountResult> {
    const [total, statusCounts] = await Promise.all([
      paymentRepository.count(),
      paymentRepository.countByStatus(),
    ]);

    return {
      total,
      pending: statusCounts.pending,
      processing: statusCounts.processing,
      completed: statusCounts.completed,
      failed: statusCounts.failed,
      cancelled: statusCounts.cancelled,
      refunded: statusCounts.refunded,
      partially_refunded: statusCounts.partially_refunded,
    };
  }

  async getPaymentRevenue(): Promise<PaymentRevenueResult[]> {
    return paymentRepository.getRevenueByCurrency();
  }
}

export const paymentService = new PaymentService();
