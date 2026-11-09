
import { Types } from "mongoose";

import { Airport } from "../models/airport.model.js";

import type {
  CreateAirportInput,
  UpdateAirportInput,
  AirportFilters,
  AirportPaginationOptions,
} from "../types/airport.types.js";

import type { AirportRecord } from "../models/airport.model.js";

export class AirportRepository {
  async findById(airportId: string): Promise<AirportRecord | null> {
    if (!Types.ObjectId.isValid(airportId)) {
      return null;
    }

    return Airport.findById(airportId).exec();
  }

  async findByAirportCode(
    airportCode: string,
  ): Promise<AirportRecord | null> {
    return Airport.findOne({
      airportCode: airportCode.trim().toUpperCase(),
    }).exec();
  }

  async findByIcaoCode(icaoCode: string): Promise<AirportRecord | null> {
    return Airport.findOne({
      icaoCode: icaoCode.trim().toUpperCase(),
    }).exec();
  }

  async create(data: CreateAirportInput): Promise<AirportRecord> {
    const airport = await Airport.create({
      ...data,
      airportCode: data.airportCode.trim().toUpperCase(),
      icaoCode: data.icaoCode.trim().toUpperCase(),
      name: data.name.trim(),
      city: data.city.trim(),
      state: data.state?.trim() || undefined,
      country: data.country.trim(),
      countryCode: data.countryCode.trim().toUpperCase(),
      timezone: data.timezone.trim(),
    });

    return airport;
  }

  async updateById(
    airportId: string,
    data: UpdateAirportInput,
  ): Promise<AirportRecord | null> {
    if (!Types.ObjectId.isValid(airportId)) {
      return null;
    }

    const updateData: Record<string, unknown> = {};

    if (data.airportCode !== undefined) {
      updateData.airportCode = data.airportCode.trim().toUpperCase();
    }

    if (data.icaoCode !== undefined) {
      updateData.icaoCode = data.icaoCode.trim().toUpperCase();
    }

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    if (data.city !== undefined) {
      updateData.city = data.city.trim();
    }

    if (data.state !== undefined) {
      if (data.state === null) {
        updateData.state = null;
      } else {
        updateData.state = data.state.trim();
      }
    }

    if (data.country !== undefined) {
      updateData.country = data.country.trim();
    }

    if (data.countryCode !== undefined) {
      updateData.countryCode = data.countryCode.trim().toUpperCase();
    }

    if (data.timezone !== undefined) {
      updateData.timezone = data.timezone.trim();
    }

    if (data.coordinates !== undefined) {
      updateData.coordinates = data.coordinates;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    return Airport.findByIdAndUpdate(
      airportId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async findMany(
    filters: AirportFilters,
    pagination: AirportPaginationOptions,
  ): Promise<{ items: AirportRecord[]; totalItems: number }> {
    const query: Record<string, unknown> = {};

    if (filters.airportCode) {
      query.airportCode = filters.airportCode.trim().toUpperCase();
    }

    if (filters.icaoCode) {
      query.icaoCode = filters.icaoCode.trim().toUpperCase();
    }

    if (filters.name) {
      query.name = {
        $regex: filters.name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (filters.city) {
      query.city = {
        $regex: filters.city.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (filters.country) {
      query.country = {
        $regex: filters.country.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (filters.countryCode) {
      query.countryCode = filters.countryCode.trim().toUpperCase();
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [items, totalItems] = await Promise.all([
      Airport.find(query)
        .sort({ name: 1, airportCode: 1 })
        .skip(skip)
        .limit(pagination.limit)
        .exec(),

      Airport.countDocuments(query).exec(),
    ]);

    return { items, totalItems };
  }

  async deleteById(airportId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(airportId)) {
      return false;
    }

    const result = await Airport.deleteOne({ _id: airportId }).exec();

    return result.deletedCount > 0;
  }

  async airportCodeExists(
    airportCode: string,
    excludeAirportId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      airportCode: airportCode.trim().toUpperCase(),
    };

    if (excludeAirportId && Types.ObjectId.isValid(excludeAirportId)) {
      query._id = { $ne: new Types.ObjectId(excludeAirportId) };
    }

    return (await Airport.exists(query).exec()) !== null;
  }

  async icaoCodeExists(
    icaoCode: string,
    excludeAirportId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      icaoCode: icaoCode.trim().toUpperCase(),
    };

    if (excludeAirportId && Types.ObjectId.isValid(excludeAirportId)) {
      query._id = { $ne: new Types.ObjectId(excludeAirportId) };
    }

    return (await Airport.exists(query).exec()) !== null;
  }

  async count(): Promise<number> {
    return Airport.countDocuments().exec();
  }
}

export const airportRepository = new AirportRepository();
