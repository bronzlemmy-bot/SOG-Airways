
import { ApiError } from "../../../utils/api-error.js";

import { flightRepository } from "../repositories/flight.repository.js";

import type {
  FlightCountResult,
  FlightFilters,
  FlightPaginationOptions,
  FlightProfileResponse,
  CreateFlightInput,
  PaginatedFlights,
  UpdateFlightInput,
} from "../types/flight.types.js";

import type {
  FlightFareSchedule,
  FlightRecord,
  FlightStatus,
} from "../models/flight.model.js";

function toFareSchedule(
  fareSchedule: FlightRecord["fareSchedule"],
): FlightFareSchedule | undefined {
  if (!fareSchedule) {
    return undefined;
  }

  const result: FlightFareSchedule = {};
  if (fareSchedule.economy) result.economy = fareSchedule.economy;
  if (fareSchedule.premium_economy) {
    result.premium_economy = fareSchedule.premium_economy;
  }
  if (fareSchedule.business) result.business = fareSchedule.business;
  if (fareSchedule.first) result.first = fareSchedule.first;
  return result;
}

function toFlightResponse(flight: FlightRecord): FlightProfileResponse {
  return {
    id: flight._id.toString(),
    flightNumber: flight.flightNumber,
    aircraft: flight.aircraft.toString(),
    departureAirport: flight.departureAirport.toString(),
    arrivalAirport: flight.arrivalAirport.toString(),
    scheduledDeparture: flight.scheduledDeparture,
    scheduledArrival: flight.scheduledArrival,
    estimatedDeparture: flight.estimatedDeparture ?? undefined,
    estimatedArrival: flight.estimatedArrival ?? undefined,
    actualDeparture: flight.actualDeparture ?? undefined,
    actualArrival: flight.actualArrival ?? undefined,
    status: flight.status,
    departureTerminal: flight.departureTerminal ?? undefined,
    departureGate: flight.departureGate ?? undefined,
    arrivalTerminal: flight.arrivalTerminal ?? undefined,
    arrivalGate: flight.arrivalGate ?? undefined,
    durationMinutes: flight.durationMinutes,
    distanceKilometers: flight.distanceKilometers ?? undefined,
    fareSchedule: toFareSchedule(flight.fareSchedule),
    notes: flight.notes ?? undefined,
    createdAt: flight.createdAt,
    updatedAt: flight.updatedAt,
  };
}

export class FlightService {
  async createFlight(
    input: CreateFlightInput,
  ): Promise<FlightProfileResponse> {
    const duplicate = await flightRepository.flightNumberExists(
      input.flightNumber,
      input.scheduledDeparture,
    );

    if (duplicate) {
      throw new ApiError(
        "A flight with this flight number and scheduled departure already exists.",
        409,
        { code: "FLIGHT_ALREADY_EXISTS" },
      );
    }

    const flight = await flightRepository.create(input);

    return toFlightResponse(flight);
  }

  async getFlightById(
    flightId: string,
  ): Promise<FlightProfileResponse> {
    const flight = await flightRepository.findById(flightId);

    if (!flight) {
      throw new ApiError("Flight not found.", 404, {
        code: "FLIGHT_NOT_FOUND",
      });
    }

    return toFlightResponse(flight);
  }

  async getFlightByNumber(
    flightNumber: string,
  ): Promise<FlightProfileResponse> {
    const flight =
      await flightRepository.findByFlightNumber(flightNumber);

    if (!flight) {
      throw new ApiError("Flight not found.", 404, {
        code: "FLIGHT_NOT_FOUND",
      });
    }

    return toFlightResponse(flight);
  }

  async updateFlight(
    flightId: string,
    input: UpdateFlightInput,
  ): Promise<FlightProfileResponse> {
    const existing = await flightRepository.findById(flightId);

    if (!existing) {
      throw new ApiError("Flight not found.", 404, {
        code: "FLIGHT_NOT_FOUND",
      });
    }

    const nextFlightNumber =
      input.flightNumber ?? existing.flightNumber;

    const nextScheduledDeparture =
      input.scheduledDeparture ?? existing.scheduledDeparture;

    if (
      input.flightNumber !== undefined ||
      input.scheduledDeparture !== undefined
    ) {
      const duplicate = await flightRepository.flightNumberExists(
        nextFlightNumber,
        nextScheduledDeparture,
        flightId,
      );

      if (duplicate) {
        throw new ApiError(
          "Another flight already uses this flight number and departure time.",
          409,
          { code: "FLIGHT_ALREADY_EXISTS" },
        );
      }
    }

    const updated = await flightRepository.updateById(
      flightId,
      input,
    );

    if (!updated) {
      throw new ApiError("Flight could not be updated.", 500, {
        code: "FLIGHT_UPDATE_FAILED",
      });
    }

    return toFlightResponse(updated);
  }

  async listFlights(
    filters: FlightFilters,
    pagination: FlightPaginationOptions,
  ): Promise<PaginatedFlights> {
    const [flights, totalItems] = await Promise.all([
      flightRepository.findMany(filters, pagination),
      flightRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: flights.map(toFlightResponse),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1 && totalItems > 0,
      },
    };
  }

  async deleteFlight(flightId: string): Promise<void> {
    const flight = await flightRepository.findById(flightId);

    if (!flight) {
      throw new ApiError("Flight not found.", 404, {
        code: "FLIGHT_NOT_FOUND",
      });
    }

    await flightRepository.deleteById(flightId);
  }

  async countFlights(
    filters: FlightFilters = {},
  ): Promise<number> {
    return flightRepository.count(filters);
  }

  async getFlightStatistics(): Promise<FlightCountResult> {
    const [total, statusCounts] = await Promise.all([
      flightRepository.count(),
      flightRepository.countByStatus(),
    ]);

    return {
      total,
      scheduled: statusCounts.scheduled,
      boarding: statusCounts.boarding,
      departed: statusCounts.departed,
      inFlight: statusCounts.in_flight,
      landed: statusCounts.landed,
      delayed: statusCounts.delayed,
      cancelled: statusCounts.cancelled,
    };
  }

  async getFlightRouteStatistics(): Promise<
    Array<{
      departureAirport: string;
      arrivalAirport: string;
      count: number;
    }>
  > {
    return flightRepository.countByRoute();
  }
}

export const flightService = new FlightService();
