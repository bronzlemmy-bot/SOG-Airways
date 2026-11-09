
import { ApiError } from "../../../utils/api-error.js";
import { flightTrackingProvider } from "../../../integrations/tracking/flight-tracking.provider.js";
import { airportService } from "../../airports/services/airport.service.js";
import { flightService } from "../../flights/services/flight.service.js";

import {
  FLIGHT_TRACKING_STATUSES,
  type FlightPositionDocument,
  type FlightTrackingStatus,
} from "../models/flight-position.model.js";

import {
  trackingRepository,
} from "../repositories/tracking.repository.js";

import type {
  CreateFlightTrackingInput,
  TrackingFlightLookup,
  TrackingListQuery,
  UpdateFlightPositionInput,
  UpdateFlightTrackingStatusInput,
} from "../types/tracking.types.js";
import type { FlightTrackingResponse as ProviderTrackingResponse } from "../../../integrations/tracking/flight-tracking.provider.js";

export class TrackingService {
  async createTracking(
    input: CreateFlightTrackingInput,
  ): Promise<FlightPositionDocument> {
    if (input.scheduledArrival <= input.scheduledDeparture) {
      throw new ApiError(
        "Scheduled arrival must be after scheduled departure.",
        400,
      );
    }

    const existingByFlightId =
      await trackingRepository.findByFlightId(input.flightId);

    if (existingByFlightId) {
      throw new ApiError(
        "A tracking record already exists for this flight.",
        409,
      );
    }

    const existingByFlightNumber =
      await trackingRepository.findByFlightNumber(input.flightNumber);

    if (existingByFlightNumber) {
      throw new ApiError(
        "A tracking record already exists for this flight number.",
        409,
      );
    }

    return trackingRepository.create(input);
  }

  async getTracking(
    lookup: TrackingFlightLookup,
  ): Promise<FlightPositionDocument | ProviderTrackingResponse> {
    let tracking: FlightPositionDocument | null = null;

    if (lookup.flightId) {
      tracking = await trackingRepository.findByFlightId(
        lookup.flightId,
      );
    } else if (lookup.flightNumber) {
      tracking = await trackingRepository.findByFlightNumber(
        lookup.flightNumber,
      );
    }

    if (tracking) {
      return tracking;
    }

    const flight = lookup.flightId
      ? await flightService.getFlightById(lookup.flightId)
      : lookup.flightNumber
        ? await flightService.getFlightByNumber(lookup.flightNumber)
        : null;

    if (!flight) {
      throw new ApiError("Flight tracking record not found.", 404);
    }

    const [departureAirport, arrivalAirport] = await Promise.all([
      airportService.getAirportById(flight.departureAirport),
      airportService.getAirportById(flight.arrivalAirport),
    ]);

    return flightTrackingProvider.getFlightStatus({
      airlineCode: "SOG",
      flightNumber: flight.flightNumber,
      departureAirport: departureAirport.airportCode,
      arrivalAirport: arrivalAirport.airportCode,
      scheduledDeparture: flight.scheduledDeparture,
      scheduledArrival: flight.scheduledArrival,
    });
  }

  async updatePosition(
    flightId: string,
    input: UpdateFlightPositionInput,
  ): Promise<FlightPositionDocument> {
    const tracking = await trackingRepository.findByFlightId(flightId);

    if (!tracking) {
      throw new ApiError("Flight tracking record not found.", 404);
    }

    if (
      tracking.status === "landed" ||
      tracking.status === "cancelled"
    ) {
      throw new ApiError(
        "Position updates are not allowed for landed or cancelled flights.",
        409,
      );
    }

    if (
      input.recordedAt &&
      input.recordedAt.getTime() < tracking.lastUpdated.getTime()
    ) {
      throw new ApiError(
        "The position update is older than the latest tracking update.",
        400,
      );
    }

    const updated = await trackingRepository.updatePosition(
      flightId,
      input,
    );

    if (!updated) {
      throw new ApiError("Unable to update flight position.", 500);
    }

    return updated;
  }

  async updateStatus(
    flightId: string,
    input: UpdateFlightTrackingStatusInput,
  ): Promise<FlightPositionDocument> {
    const tracking = await trackingRepository.findByFlightId(flightId);

    if (!tracking) {
      throw new ApiError("Flight tracking record not found.", 404);
    }

    this.validateStatusTransition(tracking.status, input.status);

    const eventTime = input.timestamp ?? new Date();

    if (eventTime.getTime() < tracking.lastUpdated.getTime()) {
      throw new ApiError(
        "The status event cannot be older than the latest tracking update.",
        400,
      );
    }

    if (
      input.estimatedArrival &&
      input.estimatedArrival <= tracking.scheduledDeparture
    ) {
      throw new ApiError(
        "Estimated arrival must be after scheduled departure.",
        400,
      );
    }

    if (
      input.actualArrival &&
      input.actualDeparture &&
      input.actualArrival <= input.actualDeparture
    ) {
      throw new ApiError(
        "Actual arrival must be after actual departure.",
        400,
      );
    }

    const updated = await trackingRepository.updateStatus(
      flightId,
      input,
    );

    if (!updated) {
      throw new ApiError("Unable to update flight status.", 500);
    }

    return updated;
  }

  async listTracking(
    filters: TrackingListQuery = {},
  ): Promise<{
    items: FlightPositionDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));

    const { items, total } = await trackingRepository.list({
      ...filters,
      page,
      limit,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTrackingHistory(
    flightId: string,
  ): Promise<FlightPositionDocument> {
    const tracking = await trackingRepository.getHistory(flightId);

    if (!tracking) {
      throw new ApiError("Flight tracking history not found.", 404);
    }

    return tracking;
  }

  async deleteTracking(flightId: string): Promise<void> {
    const tracking = await trackingRepository.findByFlightId(flightId);

    if (!tracking) {
      throw new ApiError("Flight tracking record not found.", 404);
    }

    const deleted = await trackingRepository.deleteByFlightId(flightId);

    if (!deleted) {
      throw new ApiError("Unable to delete flight tracking record.", 500);
    }
  }

  private validateStatusTransition(
    currentStatus: FlightTrackingStatus,
    nextStatus: FlightTrackingStatus,
  ): void {
    const allowedTransitions: Record<
      FlightTrackingStatus,
      readonly FlightTrackingStatus[]
    > = {
      scheduled: ["boarding", "delayed", "cancelled"],
      boarding: ["departed", "delayed", "cancelled"],
      departed: ["in_flight", "diverted", "landed"],
      in_flight: ["diverted", "landed"],
      landed: [],
      delayed: ["scheduled", "boarding", "cancelled"],
      cancelled: [],
      diverted: ["in_flight", "landed"],
    };

    if (!FLIGHT_TRACKING_STATUSES.includes(nextStatus)) {
      throw new ApiError("Invalid flight tracking status.", 400);
    }

    if (
      currentStatus !== nextStatus &&
      !allowedTransitions[currentStatus].includes(nextStatus)
    ) {
      throw new ApiError(
        `Flight status cannot change from ${currentStatus} to ${nextStatus}.`,
        409,
      );
    }
  }
}

export const trackingService = new TrackingService();
