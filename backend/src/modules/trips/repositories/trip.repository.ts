


import { Types } from "mongoose";
import type { UpdateQuery } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import { Trip, type TripRecord } from "../models/trip.model.js";
import type {
  CreateTripInput,
  TripCountResult,
  TripFilters,
  TripPaginationOptions,
  TripRepositoryUpdateData,
} from "../types/trip.types.js";
;

type TripDocument = TripRecord & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


const buildTripFilter = (
  filters: TripFilters = {},
): Record<string, any> => {
const query: Record<string, any> = {};


  if (filters.customer) {
    query.customer = new Types.ObjectId(filters.customer);
  }

  if (filters.booking) {
    query.booking = new Types.ObjectId(filters.booking);
  }

  if (filters.tripReference) {
    query.tripReference = filters.tripReference.toUpperCase();
  }

  if (filters.tripType) {
    query.tripType = filters.tripType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.originAirport) {
    query.originAirport = new Types.ObjectId(filters.originAirport);
  }

  if (filters.destinationAirport) {
    query.destinationAirport = new Types.ObjectId(
      filters.destinationAirport,
    );
  }

  if (filters.departureFrom || filters.departureTo) {
    query.departureDate = {};

    if (filters.departureFrom) {
      query.departureDate.$gte = filters.departureFrom;
    }

    if (filters.departureTo) {
      query.departureDate.$lte = filters.departureTo;
    }
  }

  if (filters.returnFrom || filters.returnTo) {
    query.returnDate = {};

    if (filters.returnFrom) {
      query.returnDate.$gte = filters.returnFrom;
    }

    if (filters.returnTo) {
      query.returnDate.$lte = filters.returnTo;
    }
  }

  if (
    filters.minBudget !== undefined ||
    filters.maxBudget !== undefined
  ) {
    query.estimatedBudget = {};

    if (filters.minBudget !== undefined) {
      query.estimatedBudget.$gte = filters.minBudget;
    }

    if (filters.maxBudget !== undefined) {
      query.estimatedBudget.$lte = filters.maxBudget;
    }
  }

  if (filters.search?.trim()) {
    const searchRegex = new RegExp(
      escapeRegex(filters.search.trim()),
      "i",
    );

    query.$or = [
      { tripReference: searchRegex },
      { title: searchRegex },
      { notes: searchRegex },
      { cancellationReason: searchRegex },
    ];
  }

  return query;
};

class TripRepository {
  async create(input: CreateTripInput) {
    return Trip.create(input);
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Trip.findById(id)
      .populate("customer")
      .populate("booking")
      .populate("originAirport")
      .populate("destinationAirport")
      .exec();
  }

  async findByIdForCustomer(id: string, customerId: string) {
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(customerId)
    ) {
      return null;
    }

    return Trip.findOne({
      _id: new Types.ObjectId(id),
      customer: new Types.ObjectId(customerId),
    })
      .populate("booking")
      .populate("originAirport")
      .populate("destinationAirport")
      .exec();
  }

  async findByReference(tripReference: string) {
    return Trip.findOne({
      tripReference: tripReference.trim().toUpperCase(),
    })
      .populate("customer")
      .populate("booking")
      .populate("originAirport")
      .populate("destinationAirport")
      .exec();
  }

  async findByBooking(bookingId: string) {
    if (!Types.ObjectId.isValid(bookingId)) {
      return [];
    }

    return Trip.find({
      booking: new Types.ObjectId(bookingId),
    })
      .sort({ departureDate: -1 })
      .exec();
  }

  async findMany(
    filters: TripFilters = {},
    pagination: TripPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  ) {
    const page = Math.max(1, pagination.page);
    const limit = Math.min(100, Math.max(1, pagination.limit));
    const skip = (page - 1) * limit;
    const sortBy = pagination.sortBy ?? "createdAt";
    const sortOrder = pagination.sortOrder === "asc" ? 1 : -1;
    const filter = buildTripFilter(filters);

    const [items, total] = await Promise.all([
      Trip.find(filter)
        .populate("booking")
        .populate("originAirport")
        .populate("destinationAirport")
        .sort({ [sortBy]: sortOrder, _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Trip.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateById(
    id: string,
    updates: TripRepositoryUpdateData,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Trip.findByIdAndUpdate(
      id,
      { $set: updates } as UpdateQuery<TripDocument>,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("booking")
      .populate("originAirport")
      .populate("destinationAirport")
      .exec();
  }

  async updateForCustomer(
    id: string,
    customerId: string,
    updates: TripRepositoryUpdateData,
  ) {
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(customerId)
    ) {
      return null;
    }

    return Trip.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        customer: new Types.ObjectId(customerId),
      },
      { $set: updates } as UpdateQuery<TripDocument>,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("booking")
      .populate("originAirport")
      .populate("destinationAirport")
      .exec();
  }

  async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Trip.findByIdAndDelete(id).exec();
  }

  async deleteForCustomer(id: string, customerId: string) {
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(customerId)
    ) {
      return null;
    }

    return Trip.findOneAndDelete({
      _id: new Types.ObjectId(id),
      customer: new Types.ObjectId(customerId),
    }).exec();
  }

  async count(filters: TripFilters = {}) {
    return Trip.countDocuments(buildTripFilter(filters)).exec();
  }

  async getCounts(filters: TripFilters = {}): Promise<TripCountResult> {
    const match = buildTripFilter(filters);

    const [statusResults, typeResults, total] = await Promise.all([
      Trip.aggregate<{ _id: string; count: number }>([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).exec(),
      Trip.aggregate<{ _id: string; count: number }>([
        { $match: match },
        { $group: { _id: "$tripType", count: { $sum: 1 } } },
      ]).exec(),
      Trip.countDocuments(match).exec(),
    ]);

    const byStatus: TripCountResult["byStatus"] = {};
    const byType: TripCountResult["byType"] = {};

    for (const item of statusResults) {
      byStatus[item._id as keyof typeof byStatus] = item.count;
    }

    for (const item of typeResults) {
      byType[item._id as keyof typeof byType] = item.count;
    }

    return {
      total,
      byStatus,
      byType,
    };
  }

  async existsByReference(
    tripReference: string,
    excludeId?: string,
  ): Promise<boolean> {
const filter: Record<string, any> = {
  tripReference: tripReference.trim().toUpperCase(),
};


    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      filter._id = { $ne: new Types.ObjectId(excludeId) };
    }

    return (await Trip.exists(filter)) !== null;
  }

  async existsForCustomer(
    id: string,
    customerId: string,
  ): Promise<boolean> {
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(customerId)
    ) {
      return false;
    }

    return (
      (await Trip.exists({
        _id: new Types.ObjectId(id),
        customer: new Types.ObjectId(customerId),
      })) !== null
    );
  }
}

export const tripRepository = new TripRepository();
