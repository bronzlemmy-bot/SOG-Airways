
import type { SortOrder } from "mongoose";

import {
  CheckIn,
  type CheckInRecord,
} from "../models/check-in-record.model.js";

import type {
  CheckInFilters,
  CheckInPaginationOptions,
  CheckInRepositoryUpdateData,
  CreateCheckInInput,
} from "../types/check-in.types.js";

type CheckInDocument = CheckInRecord;

type CheckInQuery = Record<string, unknown> & {
  $or?: Array<Record<string, unknown>>;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};

type CheckInSort = Record<string, SortOrder>;

export class CheckInRepository {
  async create(input: CreateCheckInInput): Promise<CheckInDocument> {
    return CheckIn.create(input);
  }

  async findById(id: string): Promise<CheckInDocument | null> {
    return CheckIn.findById(id).exec();
  }

  async findByReference(
    checkInReference: string,
  ): Promise<CheckInDocument | null> {
    return CheckIn.findOne({
      checkInReference: checkInReference.trim().toUpperCase(),
    }).exec();
  }

  async findByTicket(ticketId: string): Promise<CheckInDocument | null> {
    return CheckIn.findOne({ ticket: ticketId }).exec();
  }

  async findByBookingPassengerAndFlight(
    bookingId: string,
    passengerId: string,
    flightId: string,
  ): Promise<CheckInDocument | null> {
    return CheckIn.findOne({
      booking: bookingId,
      passenger: passengerId,
      flight: flightId,
    }).exec();
  }

  async findMany(
    filters: CheckInFilters,
    pagination: CheckInPaginationOptions,
  ): Promise<CheckInDocument[]> {
    const query = this.buildFilterQuery(filters);

    const sortBy = pagination.sortBy ?? "createdAt";
    const sortOrder: SortOrder =
      pagination.sortOrder === "asc" ? 1 : -1;

    const sort: CheckInSort = {
      [sortBy]: sortOrder,
      _id: sortOrder,
    };

    const skip = (pagination.page - 1) * pagination.limit;

    return CheckIn.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: CheckInFilters = {}): Promise<number> {
    return CheckIn.countDocuments(this.buildFilterQuery(filters)).exec();
  }

  async countByStatus(
    filters: CheckInFilters = {},
  ): Promise<Record<string, number>> {
    const results = await CheckIn.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: this.buildFilterQuery(filters) },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return results.reduce<Record<string, number>>((result, item) => {
      result[item._id] = item.count;
      return result;
    }, {});
  }

  async countByBoardingPassStatus(
    filters: CheckInFilters = {},
  ): Promise<Record<string, number>> {
    const results = await CheckIn.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: this.buildFilterQuery(filters) },
      {
        $group: {
          _id: "$boardingPassStatus",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return results.reduce<Record<string, number>>((result, item) => {
      result[item._id] = item.count;
      return result;
    }, {});
  }

  async update(
    id: string,
    updates: CheckInRepositoryUpdateData,
    customerId?: string,
  ): Promise<CheckInDocument | null> {
    const filter: Record<string, unknown> = { _id: id };
    if (customerId) {
      filter.customer = customerId;
    }

    return CheckIn.findOneAndUpdate(
      filter,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async delete(id: string): Promise<CheckInDocument | null> {
    return CheckIn.findByIdAndDelete(id).exec();
  }

  async existsByReference(
    checkInReference: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      checkInReference: checkInReference.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return (await CheckIn.exists(query)) !== null;
  }

  async findByCustomer(
    customerId: string,
    pagination: CheckInPaginationOptions,
  ): Promise<CheckInDocument[]> {
    return this.findMany({ customer: customerId }, pagination);
  }

  async findByFlight(
    flightId: string,
    pagination: CheckInPaginationOptions,
  ): Promise<CheckInDocument[]> {
    return this.findMany({ flight: flightId }, pagination);
  }

  async findByPassenger(
    passengerId: string,
  ): Promise<CheckInDocument[]> {
    return CheckIn.find({ passenger: passengerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByBooking(bookingId: string): Promise<CheckInDocument[]> {
    return CheckIn.find({ booking: bookingId })
      .sort({ createdAt: -1 })
      .exec();
  }

  private buildFilterQuery(filters: CheckInFilters): CheckInQuery {
    const query: CheckInQuery = {};

    if (filters.booking) query.booking = filters.booking;
    if (filters.ticket) query.ticket = filters.ticket;
    if (filters.passenger) query.passenger = filters.passenger;
    if (filters.flight) query.flight = filters.flight;
    if (filters.customer) query.customer = filters.customer;
    if (filters.status) query.status = filters.status;

    if (filters.boardingPassStatus) {
      query.boardingPassStatus = filters.boardingPassStatus;
    }

    if (filters.checkInReference) {
      query.checkInReference = filters.checkInReference
        .trim()
        .toUpperCase();
    }

    if (filters.seatNumber) {
      query.seatNumber = filters.seatNumber.trim().toUpperCase();
    }

    if (filters.createdFrom || filters.createdTo) {
      query.createdAt = {};

      if (filters.createdFrom) {
        query.createdAt.$gte = filters.createdFrom;
      }

      if (filters.createdTo) {
        query.createdAt.$lte = filters.createdTo;
      }
    }

    if (filters.search) {
      const escapedSearch = this.escapeRegex(filters.search);

      const searchCondition = {
        $regex: escapedSearch,
        $options: "i",
      };

      query.$or = [
        { checkInReference: searchCondition },
        { seatNumber: searchCondition },
        { cancellationReason: searchCondition },
      ];
    }

    return query;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export const checkInRepository = new CheckInRepository();
