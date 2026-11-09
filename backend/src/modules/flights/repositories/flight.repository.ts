
import mongoose, { type UpdateQuery } from "mongoose";

import {
  Flight,
  FLIGHT_STATUSES,
  type FlightRecord,
  type FlightStatus,
} from "../models/flight.model.js";

import type {
  CreateFlightInput,
  FlightFilters,
  FlightPaginationOptions,
  UpdateFlightInput,
} from "../types/flight.types.js";


type FlightQuery = Record<string, unknown>;


function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFlightFilter(
  filters: FlightFilters = {},
): FlightQuery {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");

    query.$or = [
      { flightNumber: searchRegex },
      { departureTerminal: searchRegex },
      { departureGate: searchRegex },
      { arrivalTerminal: searchRegex },
      { arrivalGate: searchRegex },
    ];
  }

  if (filters.flightNumber) {
    query.flightNumber = new RegExp(
      escapeRegex(filters.flightNumber),
      "i",
    );
  }

  if (filters.aircraft) {
    query.aircraft = new mongoose.Types.ObjectId(filters.aircraft);
  }

  if (filters.departureAirport) {
    query.departureAirport = new mongoose.Types.ObjectId(
      filters.departureAirport,
    );
  }

  if (filters.arrivalAirport) {
    query.arrivalAirport = new mongoose.Types.ObjectId(
      filters.arrivalAirport,
    );
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.departureFrom || filters.departureTo) {
    const departureFilter: { $gte?: Date; $lte?: Date } = {};

    if (filters.departureFrom) {
      departureFilter.$gte = filters.departureFrom;
    }

    if (filters.departureTo) {
      departureFilter.$lte = filters.departureTo;
    }

    query.scheduledDeparture = departureFilter;
  }

  if (filters.arrivalFrom || filters.arrivalTo) {
    const arrivalFilter: { $gte?: Date; $lte?: Date } = {};

    if (filters.arrivalFrom) {
      arrivalFilter.$gte = filters.arrivalFrom;
    }

    if (filters.arrivalTo) {
      arrivalFilter.$lte = filters.arrivalTo;
    }

    query.scheduledArrival = arrivalFilter;
  }

  return query as FlightQuery;
}

export class FlightRepository {
  async findById(id: string): Promise<FlightRecord | null> {
    return Flight.findById(id).exec();
  }

  async findByFlightNumber(
    flightNumber: string,
  ): Promise<FlightRecord | null> {
    return Flight.findOne({
      flightNumber: flightNumber.trim().toUpperCase(),
    }).exec();
  }

  async create(data: CreateFlightInput): Promise<FlightRecord> {
    const flight = new Flight(data);
    return flight.save();
  }

  async updateById(
    id: string,
    data: UpdateFlightInput,
  ): Promise<FlightRecord | null> {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, 1> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      if (
        value === null &&
        [
          "estimatedDeparture",
          "estimatedArrival",
          "actualDeparture",
          "actualArrival",
          "departureTerminal",
          "departureGate",
          "arrivalTerminal",
          "arrivalGate",
          "distanceKilometers",
          "fareSchedule",
          "notes",
        ].includes(key)
      ) {
        unsetData[key] = 1;
      } else {
        setData[key] = value;
      }
    }

    const update: UpdateQuery<FlightRecord> = {};

    if (Object.keys(setData).length > 0) {
      update.$set = setData;
    }

    if (Object.keys(unsetData).length > 0) {
      update.$unset = unsetData;
    }

    return Flight.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async findMany(
    filters: FlightFilters,
    pagination: FlightPaginationOptions,
  ): Promise<FlightRecord[]> {
    const sortDirection = pagination.sortOrder === "desc" ? -1 : 1;
    const sortField = pagination.sortBy ?? "scheduledDeparture";

    return Flight.find(buildFlightFilter(filters))
      .sort({ [sortField]: sortDirection })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: FlightFilters = {}): Promise<number> {
    return Flight.countDocuments(buildFlightFilter(filters)).exec();
  }

  async deleteById(id: string): Promise<FlightRecord | null> {
    return Flight.findByIdAndDelete(id).exec();
  }

  async flightNumberExists(
    flightNumber: string,
    scheduledDeparture: Date,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      flightNumber: flightNumber.trim().toUpperCase(),
      scheduledDeparture,
    };

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    return (await Flight.exists(query)) !== null;
  }

  async countByStatus(): Promise<Record<FlightStatus, number>> {
    const counts: Record<FlightStatus, number> = {
      scheduled: 0,
      boarding: 0,
      departed: 0,
      in_flight: 0,
      landed: 0,
      delayed: 0,
      cancelled: 0,
    };

    const results = await Flight.aggregate<{
      _id: FlightStatus;
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
      if (FLIGHT_STATUSES.includes(result._id)) {
        counts[result._id] = result.count;
      }
    }

    return counts;
  }

  async countByRoute(): Promise<
    Array<{
      departureAirport: string;
      arrivalAirport: string;
      count: number;
    }>
  > {
    const results = await Flight.aggregate<{
      _id: {
        departureAirport: mongoose.Types.ObjectId;
        arrivalAirport: mongoose.Types.ObjectId;
      };
      count: number;
    }>([
      {
        $group: {
          _id: {
            departureAirport: "$departureAirport",
            arrivalAirport: "$arrivalAirport",
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return results.map((result) => ({
      departureAirport: result._id.departureAirport.toString(),
      arrivalAirport: result._id.arrivalAirport.toString(),
      count: result.count,
    }));
  }
}

export const flightRepository = new FlightRepository();
