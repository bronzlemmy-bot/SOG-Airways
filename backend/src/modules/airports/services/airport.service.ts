
import { ApiError } from "../../../utils/api-error.js";
import { airportRepository } from "../repositories/airport.repository.js";

import type {
  CreateAirportInput,
  UpdateAirportInput,
  AirportFilters,
  AirportPaginationOptions,
  AirportProfileResponse,
  PaginatedAirports,
} from "../types/airport.types.js";

import type { AirportRecord } from "../models/airport.model.js";

function toAirportResponse(airport: AirportRecord): AirportProfileResponse {
  return {
    id: airport._id.toString(),
    airportCode: airport.airportCode,
    icaoCode: airport.icaoCode,
    name: airport.name,
    city: airport.city,
    state: airport.state ?? null,
    country: airport.country,
    countryCode: airport.countryCode,
    timezone: airport.timezone,
    coordinates: {
      latitude: airport.coordinates.latitude,
      longitude: airport.coordinates.longitude,
    },
    status: airport.status,
    createdAt: airport.createdAt.toISOString(),
    updatedAt: airport.updatedAt.toISOString(),
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export class AirportService {
  async createAirport(
    input: CreateAirportInput,
  ): Promise<AirportProfileResponse> {
    const existingAirportCode = await airportRepository.findByAirportCode(
      input.airportCode,
    );

    if (existingAirportCode) {
      throw new ApiError("This airport IATA code is already registered.", 409, {
        code: "AIRPORT_CODE_ALREADY_EXISTS",
      });
    }

    const existingIcaoCode = await airportRepository.findByIcaoCode(
      input.icaoCode,
    );

    if (existingIcaoCode) {
      throw new ApiError("This airport ICAO code is already registered.", 409, {
        code: "ICAO_CODE_ALREADY_EXISTS",
      });
    }

    try {
      const airport = await airportRepository.create(input);
      return toAirportResponse(airport);
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ApiError(
          "An airport with this IATA or ICAO code already exists.",
          409,
          { code: "AIRPORT_DUPLICATE_CODE" },
        );
      }

      throw error;
    }
  }

  async getAirportById(
    airportId: string,
  ): Promise<AirportProfileResponse> {
    const airport = await airportRepository.findById(airportId);

    if (!airport) {
      throw new ApiError("Airport not found.", 404, {
        code: "AIRPORT_NOT_FOUND",
      });
    }

    return toAirportResponse(airport);
  }

  async getAirportByCode(
    airportCode: string,
  ): Promise<AirportProfileResponse> {
    const airport = await airportRepository.findByAirportCode(airportCode);

    if (!airport) {
      throw new ApiError("Airport not found.", 404, {
        code: "AIRPORT_NOT_FOUND",
      });
    }

    return toAirportResponse(airport);
  }

  async updateAirport(
    airportId: string,
    input: UpdateAirportInput,
  ): Promise<AirportProfileResponse> {
    const existingAirport = await airportRepository.findById(airportId);

    if (!existingAirport) {
      throw new ApiError("Airport not found.", 404, {
        code: "AIRPORT_NOT_FOUND",
      });
    }

    if (input.airportCode !== undefined) {
      const exists = await airportRepository.airportCodeExists(
        input.airportCode,
        airportId,
      );

      if (exists) {
        throw new ApiError(
          "This airport IATA code is already registered.",
          409,
          { code: "AIRPORT_CODE_ALREADY_EXISTS" },
        );
      }
    }

    if (input.icaoCode !== undefined) {
      const exists = await airportRepository.icaoCodeExists(
        input.icaoCode,
        airportId,
      );

      if (exists) {
        throw new ApiError(
          "This airport ICAO code is already registered.",
          409,
          { code: "ICAO_CODE_ALREADY_EXISTS" },
        );
      }
    }

    try {
      const airport = await airportRepository.updateById(airportId, input);

      if (!airport) {
        throw new ApiError("Airport not found.", 404, {
          code: "AIRPORT_NOT_FOUND",
        });
      }

      return toAirportResponse(airport);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (isDuplicateKeyError(error)) {
        throw new ApiError(
          "An airport with this IATA or ICAO code already exists.",
          409,
          { code: "AIRPORT_DUPLICATE_CODE" },
        );
      }

      throw error;
    }
  }

  async listAirports(
    filters: AirportFilters,
    pagination: AirportPaginationOptions,
  ): Promise<PaginatedAirports> {
    const { items, totalItems } = await airportRepository.findMany(
      filters,
      pagination,
    );

    return {
      items: items.map(toAirportResponse),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / pagination.limit),
      },
    };
  }

  async deleteAirport(airportId: string): Promise<void> {
    const deleted = await airportRepository.deleteById(airportId);

    if (!deleted) {
      throw new ApiError("Airport not found.", 404, {
        code: "AIRPORT_NOT_FOUND",
      });
    }
  }

  async countAirports(): Promise<number> {
    return airportRepository.count();
  }
}

export const airportService = new AirportService();
