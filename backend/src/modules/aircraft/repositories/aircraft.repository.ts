
import mongoose, { type UpdateQuery } from "mongoose";

import {
  Aircraft,
  type AircraftRecord,
} from "../models/aircraft.model.js";

import type {
  AircraftFilters,
  AircraftPaginationOptions,
  CreateAircraftInput,
  UpdateAircraftInput,
} from "../types/aircraft.types.js";

export type AircraftRepositoryUpdateData = UpdateAircraftInput;

type AircraftQuery = ReturnType<typeof Aircraft.find> extends {
  getFilter(): infer T;
}
  ? T
  : Record<string, unknown>;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAircraftFilter(
  filters: AircraftFilters = {},
): AircraftQuery {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");

    query.$or = [
      { registrationNumber: searchRegex },
      { manufacturer: searchRegex },
      { model: searchRegex },
      { serialNumber: searchRegex },
    ];
  }

  if (filters.manufacturer) {
    query.manufacturer = new RegExp(
      escapeRegex(filters.manufacturer),
      "i",
    );
  }

  if (filters.aircraftType) {
    query.aircraftType = filters.aircraftType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.manufactureYear !== undefined) {
    query.manufactureYear = filters.manufactureYear;
  }

  if (
    filters.minRangeKilometers !== undefined ||
    filters.maxRangeKilometers !== undefined
  ) {
    const rangeFilter: { $gte?: number; $lte?: number } = {};

    if (filters.minRangeKilometers !== undefined) {
      rangeFilter.$gte = filters.minRangeKilometers;
    }

    if (filters.maxRangeKilometers !== undefined) {
      rangeFilter.$lte = filters.maxRangeKilometers;
    }

    query.rangeKilometers = rangeFilter;
  }

  return query as AircraftQuery;
}

export class AircraftRepository {
  async findById(id: string): Promise<AircraftRecord | null> {
    return Aircraft.findById(id).exec();
  }

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<AircraftRecord | null> {
    return Aircraft.findOne({
      registrationNumber: registrationNumber.trim().toUpperCase(),
    }).exec();
  }

  async create(data: CreateAircraftInput): Promise<AircraftRecord> {
    const aircraft = new Aircraft(data);
    return aircraft.save();
  }

  async updateById(
    id: string,
    data: AircraftRepositoryUpdateData,
  ): Promise<AircraftRecord | null> {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, 1> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      if (
        (key === "serialNumber" || key === "notes") &&
        value === null
      ) {
        unsetData[key] = 1;
      } else {
        setData[key] = value;
      }
    }

    const update: UpdateQuery<AircraftRecord> = {};

    if (Object.keys(setData).length > 0) {
      update.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    return Aircraft.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async findMany(
    filters: AircraftFilters,
    pagination: AircraftPaginationOptions,
  ): Promise<AircraftRecord[]> {
    const query = buildAircraftFilter(filters);
    const sortDirection = pagination.sortOrder === "asc" ? 1 : -1;
    const sortField = pagination.sortBy ?? "createdAt";

    return Aircraft.find(query)
      .sort({ [sortField]: sortDirection })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: AircraftFilters = {}): Promise<number> {
    return Aircraft.countDocuments(buildAircraftFilter(filters)).exec();
  }

  async deleteById(id: string): Promise<AircraftRecord | null> {
    return Aircraft.findByIdAndDelete(id).exec();
  }

  async registrationNumberExists(
    registrationNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      registrationNumber: registrationNumber.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    return (await Aircraft.exists(query)) !== null;
  }

  async serialNumberExists(
    serialNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      serialNumber: serialNumber.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    return (await Aircraft.exists(query)) !== null;
  }

  async countByStatus(): Promise<
    Record<"active" | "maintenance" | "inactive" | "retired", number>
  > {
    const results = await Aircraft.aggregate<{
      _id: "active" | "maintenance" | "inactive" | "retired";
      count: number;
    }>([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const counts = {
      active: 0,
      maintenance: 0,
      inactive: 0,
      retired: 0,
    };

    for (const result of results) {
      counts[result._id] = result.count;
    }

    return counts;
  }

  async countByType(): Promise<Record<string, number>> {
    const results = await Aircraft.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: "$aircraftType",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return Object.fromEntries(
      results.map((result) => [result._id, result.count]),
    );
  }
}

export const aircraftRepository = new AircraftRepository();
