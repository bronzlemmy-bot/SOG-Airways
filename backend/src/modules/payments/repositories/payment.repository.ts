
import mongoose, { type UpdateQuery } from "mongoose";

import {
  Payment,
  PAYMENT_STATUSES,
  type PaymentRecord,
  type PaymentStatus,
} from "../models/payment.model.js";

import type {
  CreatePaymentInput,
  PaymentFilters,
  PaymentPaginationOptions,
  PaymentRepositoryUpdateData,
} from "../types/payment.types.js";

type PaymentQuery = Record<string, unknown>;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPaymentFilter(
  filters: PaymentFilters = {},
): PaymentQuery {
  const query: PaymentQuery = {};

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");

    query.$or = [
      { paymentReference: searchRegex },
      { providerTransactionId: searchRegex },
      { refundReference: searchRegex },
      { currency: searchRegex },
    ];
  }

  if (filters.paymentReference) {
    query.paymentReference = filters.paymentReference
      .trim()
      .toUpperCase();
  }

  if (filters.booking) {
    query.booking = new mongoose.Types.ObjectId(filters.booking);
  }

  if (filters.customer) {
    query.customer = new mongoose.Types.ObjectId(filters.customer);
  }

  if (filters.method) {
    query.method = filters.method;
  }

  if (filters.provider) {
    query.provider = filters.provider;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.refundStatus) {
    query.refundStatus = filters.refundStatus;
  }

  if (filters.currency) {
    query.currency = filters.currency.trim().toUpperCase();
  }

  if (filters.createdFrom || filters.createdTo) {
    const createdAt: { $gte?: Date; $lte?: Date } = {};

    if (filters.createdFrom) {
      createdAt.$gte = filters.createdFrom;
    }

    if (filters.createdTo) {
      createdAt.$lte = filters.createdTo;
    }

    query.createdAt = createdAt;
  }

  if (
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined
  ) {
    const amount: { $gte?: number; $lte?: number } = {};

    if (filters.minAmount !== undefined) {
      amount.$gte = filters.minAmount;
    }

    if (filters.maxAmount !== undefined) {
      amount.$lte = filters.maxAmount;
    }

    query.amount = amount;
  }

  return query;
}

export class PaymentRepository {
  async findById(id: string): Promise<PaymentRecord | null> {
    return Payment.findById(id).exec();
  }

  async findByReference(
    paymentReference: string,
  ): Promise<PaymentRecord | null> {
    return Payment.findOne({
      paymentReference: paymentReference.trim().toUpperCase(),
    }).exec();
  }

  async findByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<PaymentRecord | null> {
    return Payment.findOne({
      idempotencyKey: idempotencyKey.trim(),
    }).exec();
  }

  async create(
    data: CreatePaymentInput & { paymentReference: string },
  ): Promise<PaymentRecord> {
    const payment = new Payment(data);
    return payment.save();
  }

  async updateById(
    id: string,
    data: PaymentRepositoryUpdateData,
  ): Promise<PaymentRecord | null> {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, 1> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      if (
        value === null &&
        [
          "providerTransactionId",
          "description",
          "failureCode",
          "failureReason",
          "paidAt",
          "refundedAt",
          "refundReference",
          "notes",
        ].includes(key)
      ) {
        unsetData[key] = 1;
      } else {
        setData[key] = value;
      }
    }

    const update: UpdateQuery<PaymentRecord> = {};

    if (Object.keys(setData).length > 0) {
      update.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    return Payment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async findMany(
    filters: PaymentFilters,
    pagination: PaymentPaginationOptions,
  ): Promise<PaymentRecord[]> {
    const sortDirection = pagination.sortOrder === "asc" ? 1 : -1;
    const sortField = pagination.sortBy ?? "createdAt";

    return Payment.find(buildPaymentFilter(filters))
      .sort({ [sortField]: sortDirection })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: PaymentFilters = {}): Promise<number> {
    return Payment.countDocuments(buildPaymentFilter(filters)).exec();
  }

  async deleteById(id: string): Promise<PaymentRecord | null> {
    return Payment.findByIdAndDelete(id).exec();
  }

  async paymentReferenceExists(
    paymentReference: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      paymentReference: paymentReference.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    return (await Payment.exists(query)) !== null;
  }

  async countByStatus(): Promise<Record<PaymentStatus, number>> {
    const counts: Record<PaymentStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      refunded: 0,
      partially_refunded: 0,
    };

    const results = await Payment.aggregate<{
      _id: PaymentStatus;
      count: number;
    }>([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    for (const result of results) {
      if (PAYMENT_STATUSES.includes(result._id)) {
        counts[result._id] = result.count;
      }
    }

    return counts;
  }

  async getRevenueByCurrency(): Promise<
    Array<{
      currency: string;
      totalPayments: number;
      totalAmount: number;
      totalRefunded: number;
      netAmount: number;
    }>
  > {
    const results = await Payment.aggregate<{
      _id: string;
      totalPayments: number;
      totalAmount: number;
      totalRefunded: number;
    }>([
      {
        $match: {
          status: {
            $in: ["completed", "refunded", "partially_refunded"],
          },
        },
      },
      {
        $group: {
          _id: "$currency",
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalRefunded: { $sum: "$refundedAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    return results.map((result) => ({
      currency: result._id,
      totalPayments: result.totalPayments,
      totalAmount: result.totalAmount,
      totalRefunded: result.totalRefunded,
      netAmount: result.totalAmount - result.totalRefunded,
    }));
  }
}

export const paymentRepository = new PaymentRepository();
