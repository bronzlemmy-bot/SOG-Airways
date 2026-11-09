
import { Types } from "mongoose";

import {
  FlightPositionModel,
  type FlightPosition,
  type FlightPositionDocument,
  type FlightTrackingStatus,
} from "../models/flight-position.model.js";

import type {
  CreateFlightTrackingInput,
  TrackingListQuery,
  UpdateFlightPositionInput,
  UpdateFlightTrackingStatusInput,
} from "../types/tracking.types.js";

export class TrackingRepository {
  async create(
    input: CreateFlightTrackingInput,
  ): Promise<FlightPositionDocument> {
    const tracking = await FlightPositionModel.create({
      flightId: new Types.ObjectId(input.flightId),
      flightNumber: input.flightNumber,
      departureAirport: input.departureAirport,
      arrivalAirport: input.arrivalAirport,
      scheduledDeparture: input.scheduledDeparture,
      scheduledArrival: input.scheduledArrival,
      status: "scheduled",
      events: [
        {
          status: "scheduled",
          description: "Flight tracking record created.",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    });

    return tracking;
  }

  async findById(
    trackingId: string,
  ): Promise<FlightPositionDocument | null> {
    if (!Types.ObjectId.isValid(trackingId)) {
      return null;
    }

    return FlightPositionModel.findById(trackingId).exec();
  }

  async findByFlightId(
    flightId: string,
  ): Promise<FlightPositionDocument | null> {
    if (!Types.ObjectId.isValid(flightId)) {
      return null;
    }

    return FlightPositionModel.findOne({
      flightId: new Types.ObjectId(flightId),
    }).exec();
  }

  async findByFlightNumber(
    flightNumber: string,
  ): Promise<FlightPositionDocument | null> {
    return FlightPositionModel.findOne({
      flightNumber: flightNumber.trim().toUpperCase(),
    }).exec();
  }

  async updatePosition(
    flightId: string,
    input: UpdateFlightPositionInput,
  ): Promise<FlightPositionDocument | null> {
    if (!Types.ObjectId.isValid(flightId)) {
      return null;
    }

    const tracking = await this.findByFlightId(flightId);

    if (!tracking) {
      return null;
    }

    tracking.latitude = input.latitude;
    tracking.longitude = input.longitude;

    if (input.altitude !== undefined) {
      tracking.altitude = input.altitude;
    }

    if (input.speed !== undefined) {
      tracking.speed = input.speed;
    }

    if (input.heading !== undefined) {
      tracking.heading = input.heading;
    }

    if (input.source !== undefined) {
      tracking.source = input.source;
    }

    tracking.recordedAt = input.recordedAt ?? new Date();
    tracking.lastUpdated = new Date();

    return tracking.save();
  }

  async updateStatus(
    flightId: string,
    input: UpdateFlightTrackingStatusInput,
  ): Promise<FlightPositionDocument | null> {
    if (!Types.ObjectId.isValid(flightId)) {
      return null;
    }

    const tracking = await this.findByFlightId(flightId);

    if (!tracking) {
      return null;
    }

    tracking.status = input.status;

    if (input.estimatedDeparture !== undefined) {
      tracking.estimatedDeparture = input.estimatedDeparture;
    }

    if (input.estimatedArrival !== undefined) {
      tracking.estimatedArrival = input.estimatedArrival;
    }

    if (input.actualDeparture !== undefined) {
      tracking.actualDeparture = input.actualDeparture;
    }

    if (input.actualArrival !== undefined) {
      tracking.actualArrival = input.actualArrival;
    }

    tracking.events.push({
      status: input.status,
      description: input.description,
      location: input.location ?? null,
      timestamp: input.timestamp ?? new Date(),
    });

    tracking.lastUpdated = new Date();

    return tracking.save();
  }

  async list(
    filters: TrackingListQuery = {},
  ): Promise<{
    items: FlightPositionDocument[];
    total: number;
  }> {
    const {
      status,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureFrom,
      departureTo,
      page = 1,
      limit = 20,
    } = filters;

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (flightNumber) {
      query.flightNumber = flightNumber.trim().toUpperCase();
    }

    if (departureAirport) {
      query.departureAirport = departureAirport.trim().toUpperCase();
    }

    if (arrivalAirport) {
      query.arrivalAirport = arrivalAirport.trim().toUpperCase();
    }

    if (departureFrom || departureTo) {
      const departureRange: {
        $gte?: Date;
        $lte?: Date;
      } = {};

      if (departureFrom) {
        departureRange.$gte = departureFrom;
      }

      if (departureTo) {
        departureRange.$lte = departureTo;
      }

      query.scheduledDeparture = departureRange;
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [items, total] = await Promise.all([
      FlightPositionModel.find(query)
        .sort({ scheduledDeparture: 1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .exec(),

      FlightPositionModel.countDocuments(query).exec(),
    ]);

    return { items, total };
  }

  async getHistory(
    flightId: string,
  ): Promise<FlightPositionDocument | null> {
    return this.findByFlightId(flightId);
  }

  async deleteByFlightId(
    flightId: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(flightId)) {
      return false;
    }

    const result = await FlightPositionModel.deleteOne({
      flightId: new Types.ObjectId(flightId),
    }).exec();

    return result.deletedCount > 0;
  }
}

export const trackingRepository = new TrackingRepository();
