
import { ApiError } from "../../../utils/api-error.js";
import { aircraftRepository } from "../repositories/aircraft.repository.js";

import type {
  AircraftCountResult,
  AircraftFilters,
  AircraftPaginationOptions,
  AircraftProfileResponse,
  CreateAircraftInput,
  PaginatedAircraft,
  UpdateAircraftInput,
} from "../types/aircraft.types.js";

import type { AircraftRecord } from "../models/aircraft.model.js";

function toAircraftResponse(
  aircraft: AircraftRecord,
): AircraftProfileResponse {
  return {
    id: aircraft._id.toString(),
    registrationNumber: aircraft.registrationNumber,
    manufacturer: aircraft.manufacturer,
    model: aircraft.model,
    aircraftType: aircraft.aircraftType,
    serialNumber: aircraft.serialNumber ?? undefined,
    manufactureYear: aircraft.manufactureYear,
    capacity: {
      economy: aircraft.capacity.economy,
      premiumEconomy: aircraft.capacity.premiumEconomy,
      business: aircraft.capacity.business,
      first: aircraft.capacity.first,
      total: aircraft.capacity.total,
    },
    rangeKilometers: aircraft.rangeKilometers,
    status: aircraft.status,
    notes: aircraft.notes ?? undefined,
    createdAt: aircraft.createdAt,
    updatedAt: aircraft.updatedAt,
  };
}

export class AircraftService {
  async createAircraft(
    input: CreateAircraftInput,
  ): Promise<AircraftProfileResponse> {
    if (
      await aircraftRepository.registrationNumberExists(
        input.registrationNumber,
      )
    ) {
      throw new ApiError(
        "An aircraft with this registration number already exists.",
        409,
        { code: "AIRCRAFT_REGISTRATION_EXISTS" },
      );
    }

    if (input.serialNumber) {
      if (
        await aircraftRepository.serialNumberExists(input.serialNumber)
      ) {
        throw new ApiError(
          "An aircraft with this serial number already exists.",
          409,
          { code: "AIRCRAFT_SERIAL_NUMBER_EXISTS" },
        );
      }
    }

    const aircraft = await aircraftRepository.create(input);
    return toAircraftResponse(aircraft);
  }

  async getAircraftById(
    aircraftId: string,
  ): Promise<AircraftProfileResponse> {
    const aircraft = await aircraftRepository.findById(aircraftId);

    if (!aircraft) {
      throw new ApiError("Aircraft not found.", 404, {
        code: "AIRCRAFT_NOT_FOUND",
      });
    }

    return toAircraftResponse(aircraft);
  }

  async getAircraftByRegistrationNumber(
    registrationNumber: string,
  ): Promise<AircraftProfileResponse> {
    const aircraft =
      await aircraftRepository.findByRegistrationNumber(
        registrationNumber,
      );

    if (!aircraft) {
      throw new ApiError("Aircraft not found.", 404, {
        code: "AIRCRAFT_NOT_FOUND",
      });
    }

    return toAircraftResponse(aircraft);
  }

  async updateAircraft(
    aircraftId: string,
    input: UpdateAircraftInput,
  ): Promise<AircraftProfileResponse> {
    const existing = await aircraftRepository.findById(aircraftId);

    if (!existing) {
      throw new ApiError("Aircraft not found.", 404, {
        code: "AIRCRAFT_NOT_FOUND",
      });
    }

    if (input.registrationNumber !== undefined) {
      if (
        await aircraftRepository.registrationNumberExists(
          input.registrationNumber,
          aircraftId,
        )
      ) {
        throw new ApiError(
          "Another aircraft already uses this registration number.",
          409,
          { code: "AIRCRAFT_REGISTRATION_EXISTS" },
        );
      }
    }

    if (input.serialNumber) {
      if (
        await aircraftRepository.serialNumberExists(
          input.serialNumber,
          aircraftId,
        )
      ) {
        throw new ApiError(
          "Another aircraft already uses this serial number.",
          409,
          { code: "AIRCRAFT_SERIAL_NUMBER_EXISTS" },
        );
      }
    }

    const updated = await aircraftRepository.updateById(
      aircraftId,
      input,
    );

    if (!updated) {
      throw new ApiError("Aircraft could not be updated.", 500, {
        code: "AIRCRAFT_UPDATE_FAILED",
      });
    }

    return toAircraftResponse(updated);
  }

  async listAircraft(
    filters: AircraftFilters,
    pagination: AircraftPaginationOptions,
  ): Promise<PaginatedAircraft> {
    const [aircraft, totalItems] = await Promise.all([
      aircraftRepository.findMany(filters, pagination),
      aircraftRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: aircraft.map(toAircraftResponse),
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

  async deleteAircraft(aircraftId: string): Promise<void> {
    const aircraft = await aircraftRepository.findById(aircraftId);

    if (!aircraft) {
      throw new ApiError("Aircraft not found.", 404, {
        code: "AIRCRAFT_NOT_FOUND",
      });
    }

    await aircraftRepository.deleteById(aircraftId);
  }

  async countAircraft(
    filters: AircraftFilters = {},
  ): Promise<number> {
    return aircraftRepository.count(filters);
  }

  async getAircraftStatistics(): Promise<AircraftCountResult> {
    const [total, statusCounts] = await Promise.all([
      aircraftRepository.count(),
      aircraftRepository.countByStatus(),
    ]);

    return {
      total,
      active: statusCounts.active,
      maintenance: statusCounts.maintenance,
      inactive: statusCounts.inactive,
      retired: statusCounts.retired,
    };
  }

  async getAircraftTypeStatistics(): Promise<Record<string, number>> {
    return aircraftRepository.countByType();
  }
}

export const aircraftService = new AircraftService();
