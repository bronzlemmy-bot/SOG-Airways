
import mongoose, {
  type ClientSession,
  type UpdateQuery,
} from "mongoose";

import {
  Passenger,
  PASSENGER_STATUSES,
  type PassengerRecord,
  type PassengerStatus,
} from "../models/passenger.model.js";

import type {
  CreatePassengerInput,
  PassengerFilters,
  PassengerPaginationOptions,
  PassengerRepositoryUpdateData,
} from "../types/passenger.types.js";

type PassengerQuery = Record<string, unknown>;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPassengerFilter(
  filters: PassengerFilters = {},
): PassengerQuery {
  const query: PassengerQuery = {};

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");

    query.$or = [
      { firstName: searchRegex },
      { middleName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { nationality: searchRegex },
      { frequentFlyerNumber: searchRegex },
    ];
  }

  if (filters.customer) {
    query.customer = new mongoose.Types.ObjectId(filters.customer);
  }

  if (filters.firstName) {
    query.firstName = new RegExp(
      escapeRegex(filters.firstName),
      "i",
    );
  }

  if (filters.lastName) {
    query.lastName = new RegExp(
      escapeRegex(filters.lastName),
      "i",
    );
  }

  if (filters.email) {
    query.email = filters.email.trim().toLowerCase();
  }

  if (filters.nationality) {
    query.nationality = new RegExp(
      `^${escapeRegex(filters.nationality)}$`,
      "i",
    );
  }

  if (filters.gender) {
    query.gender = filters.gender;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.documentType) {
    query.documentType = filters.documentType;
  }

  if (filters.specialAssistanceRequired !== undefined) {
    query.specialAssistanceRequired =
      filters.specialAssistanceRequired;
  }

  if (filters.dateOfBirthFrom || filters.dateOfBirthTo) {
    const dateOfBirth: { $gte?: Date; $lte?: Date } = {};

    if (filters.dateOfBirthFrom) {
      dateOfBirth.$gte = filters.dateOfBirthFrom;
    }

    if (filters.dateOfBirthTo) {
      dateOfBirth.$lte = filters.dateOfBirthTo;
    }

    query.dateOfBirth = dateOfBirth;
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

  return query;
}

export class PassengerRepository {
  async findById(id: string): Promise<PassengerRecord | null> {
    return Passenger.findById(id).exec();
  }

  async findMany(
    filters: PassengerFilters = {},
    pagination: PassengerPaginationOptions,
  ): Promise<PassengerRecord[]> {
    const sortDirection = pagination.sortOrder === "asc" ? 1 : -1;
    const sortField = pagination.sortBy ?? "createdAt";

    return Passenger.find(buildPassengerFilter(filters))
      .sort({ [sortField]: sortDirection })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();
  }

  async create(
    data: CreatePassengerInput,
    session?: ClientSession,
  ): Promise<PassengerRecord> {
    const passenger = new Passenger(data);
    return passenger.save(session ? { session } : undefined);
  }

  async updateById(
    id: string,
    data: PassengerRepositoryUpdateData,
  ): Promise<PassengerRecord | null> {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, 1> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      if (
        value === null &&
        [
          "middleName",
          "email",
          "phoneNumber",
          "documentType",
          "documentNumber",
          "documentIssuingCountry",
          "documentExpiryDate",
          "specialAssistanceNotes",
          "frequentFlyerNumber",
          "notes",
        ].includes(key)
      ) {
        unsetData[key] = 1;
      } else {
        setData[key] = value;
      }
    }

    const update: UpdateQuery<PassengerRecord> = {};

    if (Object.keys(setData).length > 0) {
      update.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    return Passenger.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async deleteById(id: string): Promise<PassengerRecord | null> {
    return Passenger.findByIdAndDelete(id).exec();
  }

  async count(filters: PassengerFilters = {}): Promise<number> {
    return Passenger.countDocuments(
      buildPassengerFilter(filters),
    ).exec();
  }

  async findByCustomer(
    customerId: string,
  ): Promise<PassengerRecord[]> {
    return Passenger.find({
      customer: new mongoose.Types.ObjectId(customerId),
    })
      .sort({ lastName: 1, firstName: 1 })
      .exec();
  }

  async documentExists(
    documentType: string,
    documentNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      documentType,
      documentNumber: documentNumber.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = {
        $ne: new mongoose.Types.ObjectId(excludeId),
      };
    }

    return (await Passenger.exists(query)) !== null;
  }

  async countByStatus(): Promise<Record<PassengerStatus, number>> {
    const counts: Record<PassengerStatus, number> = {
      active: 0,
      inactive: 0,
      blocked: 0,
    };

    const results = await Passenger.aggregate<{
      _id: PassengerStatus;
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
      if (PASSENGER_STATUSES.includes(result._id)) {
        counts[result._id] = result.count;
      }
    }

    return counts;
  }

  async countByCustomer(): Promise<
    Array<{ customer: string; passengerCount: number }>
  > {
    const results = await Passenger.aggregate<{
      _id: mongoose.Types.ObjectId;
      passengerCount: number;
    }>([
      {
        $group: {
          _id: "$customer",
          passengerCount: { $sum: 1 },
        },
      },
      {
        $sort: { passengerCount: -1 },
      },
    ]).exec();

    return results.map((result) => ({
      customer: result._id.toString(),
      passengerCount: result.passengerCount,
    }));
  }
}

export const passengerRepository = new PassengerRepository();
