
import mongoose, {
  type ClientSession,
  type UpdateQuery,
} from "mongoose";

import {
  Booking,
  BOOKING_STATUSES,
  type BookingRecord,
  type BookingStatus,
} from "../models/booking.model.js";

import type {
  BookingFilters,
  BookingPaginationOptions,
  BookingRepositoryUpdateData,
  CreateBookingInput,
} from "../types/booking.types.js";

type BookingQuery = Record<string, unknown>;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBookingFilter(
  filters: BookingFilters = {},
): BookingQuery {
  const query: BookingQuery = {};

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");

    query.$or = [
      { bookingReference: searchRegex },
      { currency: searchRegex },
    ];
  }

  if (filters.bookingReference) {
    query.bookingReference = filters.bookingReference
      .trim()
      .toUpperCase();
  }

  if (filters.customer) {
    query.customer = new mongoose.Types.ObjectId(filters.customer);
  }

  if (filters.flight) {
    query.flight = new mongoose.Types.ObjectId(filters.flight);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  if (filters.bookingClass) {
    query.bookingClass = filters.bookingClass;
  }

  if (filters.currency) {
    query.currency = filters.currency.trim().toUpperCase();
  }

  if (filters.bookedFrom || filters.bookedTo) {
    const bookedAt: { $gte?: Date; $lte?: Date } = {};

    if (filters.bookedFrom) {
      bookedAt.$gte = filters.bookedFrom;
    }

    if (filters.bookedTo) {
      bookedAt.$lte = filters.bookedTo;
    }

    query.bookedAt = bookedAt;
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

    query.totalAmount = amount;
  }

  return query;
}

export class BookingRepository {
  async findById(id: string): Promise<BookingRecord | null> {
    return Booking.findById(id).exec();
  }

  async findByReference(
    bookingReference: string,
  ): Promise<BookingRecord | null> {
    return Booking.findOne({
      bookingReference: bookingReference.trim().toUpperCase(),
    }).exec();
  }

  async create(data: CreateBookingInput & {
    bookingReference: string;
    totalAmount: number;
  }, session?: ClientSession): Promise<BookingRecord> {
    const booking = new Booking(data);
    return booking.save(session ? { session } : undefined);
  }

  async findByIdempotencyKey(
    customerId: string,
    idempotencyKey: string,
    session?: ClientSession,
  ): Promise<BookingRecord | null> {
    let query = Booking.findOne({
      customer: customerId,
      idempotencyKey,
    });

    if (session) query = query.session(session);
    return query.exec();
  }

  async updateById(
    id: string,
    data: BookingRepositoryUpdateData,
  ): Promise<BookingRecord | null> {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, 1> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      if (
        value === null &&
        ["expiresAt", "cancellationReason", "notes"].includes(key)
      ) {
        unsetData[key] = 1;
      } else {
        setData[key] = value;
      }
    }

    const update: UpdateQuery<BookingRecord> = {};

    if (Object.keys(setData).length > 0) {
      update.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    return Booking.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async findMany(
    filters: BookingFilters,
    pagination: BookingPaginationOptions,
  ): Promise<BookingRecord[]> {
    const sortDirection = pagination.sortOrder === "asc" ? 1 : -1;
    const sortField = pagination.sortBy ?? "bookedAt";

    return Booking.find(buildBookingFilter(filters))
      .sort({ [sortField]: sortDirection })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: BookingFilters = {}): Promise<number> {
    return Booking.countDocuments(buildBookingFilter(filters)).exec();
  }

  async deleteById(id: string): Promise<BookingRecord | null> {
    return Booking.findByIdAndDelete(id).exec();
  }

  async bookingReferenceExists(
    bookingReference: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      bookingReference: bookingReference.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    return (await Booking.exists(query)) !== null;
  }

  async countByStatus(): Promise<Record<BookingStatus, number>> {
    const counts: Record<BookingStatus, number> = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      expired: 0,
    };

    const results = await Booking.aggregate<{
      _id: BookingStatus;
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
      if (BOOKING_STATUSES.includes(result._id)) {
        counts[result._id] = result.count;
      }
    }

    return counts;
  }

  async getRevenueByCurrency(): Promise<
    Array<{
      currency: string;
      totalBookings: number;
      totalRevenue: number;
      totalDiscount: number;
    }>
  > {
    const results = await Booking.aggregate<{
      _id: string;
      totalBookings: number;
      totalRevenue: number;
      totalDiscount: number;
    }>([
      {
        $match: {
          paymentStatus: "paid",
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$currency",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$discount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    return results.map((result) => ({
      currency: result._id,
      totalBookings: result.totalBookings,
      totalRevenue: result.totalRevenue,
      totalDiscount: result.totalDiscount,
    }));
  }
}

export const bookingRepository = new BookingRepository();
