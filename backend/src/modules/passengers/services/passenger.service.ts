
import mongoose, { type ClientSession } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";

import {
  passengerRepository,
} from "../repositories/passenger.repository.js";

import type {
  CreatePassengerInput,
  PassengerCountResult,
  PassengerFilters,
  PassengerPaginationOptions,
  PassengerProfileResponse,
  PaginatedPassengers,
  UpdatePassengerInput,
} from "../types/passenger.types.js";

import type { PassengerRecord } from "../models/passenger.model.js";

function toPassengerResponse(
  passenger: PassengerRecord,
): PassengerProfileResponse {
  return {
    id: passenger._id.toString(),
    customer: passenger.customer.toString(),
    firstName: passenger.firstName,
    middleName: passenger.middleName ?? undefined,
    lastName: passenger.lastName,
    fullName: [
      passenger.firstName,
      passenger.middleName,
      passenger.lastName,
    ]
      .filter(Boolean)
      .join(" "),
    dateOfBirth: passenger.dateOfBirth,
    gender: passenger.gender,
    nationality: passenger.nationality,
    email: passenger.email ?? undefined,
    phoneNumber: passenger.phoneNumber ?? undefined,
    documentType: passenger.documentType ?? undefined,
    documentNumber: passenger.documentNumber ?? undefined,
    documentIssuingCountry:
      passenger.documentIssuingCountry ?? undefined,
    documentExpiryDate:
      passenger.documentExpiryDate ?? undefined,
    specialAssistanceRequired:
      passenger.specialAssistanceRequired,
    specialAssistanceNotes:
      passenger.specialAssistanceNotes ?? undefined,
    frequentFlyerNumber:
      passenger.frequentFlyerNumber ?? undefined,
    status: passenger.status,
    notes: passenger.notes ?? undefined,
    createdAt: passenger.createdAt,
    updatedAt: passenger.updatedAt,
  };
}

function validatePassengerDates(
  dateOfBirth: Date | undefined,
  documentExpiryDate: Date | null | undefined,
): void {
  if (
    dateOfBirth !== undefined &&
    (!Number.isFinite(dateOfBirth.getTime()) ||
      dateOfBirth >= new Date())
  ) {
    throw new ApiError(
      "Date of birth must be a valid date in the past.",
      400,
      { code: "INVALID_PASSENGER_DATE_OF_BIRTH" },
    );
  }

  if (
    documentExpiryDate instanceof Date &&
    (!Number.isFinite(documentExpiryDate.getTime()) ||
      documentExpiryDate <= new Date())
  ) {
    throw new ApiError(
      "Document expiry date must be in the future.",
      400,
      { code: "INVALID_DOCUMENT_EXPIRY_DATE" },
    );
  }
}

export class PassengerService {
  async createPassenger(
    input: CreatePassengerInput,
    session?: ClientSession,
  ): Promise<PassengerProfileResponse> {
    if (!mongoose.isValidObjectId(input.customer)) {
      throw new ApiError("Invalid customer ID.", 400, {
        code: "INVALID_CUSTOMER_ID",
      });
    }

    validatePassengerDates(
      input.dateOfBirth,
      input.documentExpiryDate,
    );

    if (
      input.documentType &&
      input.documentNumber &&
      (await passengerRepository.documentExists(
        input.documentType,
        input.documentNumber,
      ))
    ) {
      throw new ApiError(
        "A passenger with this document already exists.",
        409,
        { code: "PASSENGER_DOCUMENT_EXISTS" },
      );
    }

    const passenger = await passengerRepository.create(input, session);

    return toPassengerResponse(passenger);
  }

  async getPassengerById(
    passengerId: string,
  ): Promise<PassengerProfileResponse> {
    if (!mongoose.isValidObjectId(passengerId)) {
      throw new ApiError("Invalid passenger ID.", 400, {
        code: "INVALID_PASSENGER_ID",
      });
    }

    const passenger =
      await passengerRepository.findById(passengerId);

    if (!passenger) {
      throw new ApiError("Passenger not found.", 404, {
        code: "PASSENGER_NOT_FOUND",
      });
    }

    return toPassengerResponse(passenger);
  }

  async listPassengers(
    filters: PassengerFilters,
    pagination: PassengerPaginationOptions,
  ): Promise<PaginatedPassengers> {
    const [passengers, totalItems] = await Promise.all([
      passengerRepository.findMany(filters, pagination),
      passengerRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: passengers.map(toPassengerResponse),
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

  async updatePassenger(
    passengerId: string,
    input: UpdatePassengerInput,
  ): Promise<PassengerProfileResponse> {
    if (!mongoose.isValidObjectId(passengerId)) {
      throw new ApiError("Invalid passenger ID.", 400, {
        code: "INVALID_PASSENGER_ID",
      });
    }

    const existing =
      await passengerRepository.findById(passengerId);

    if (!existing) {
      throw new ApiError("Passenger not found.", 404, {
        code: "PASSENGER_NOT_FOUND",
      });
    }

    if (
      input.customer !== undefined &&
      !mongoose.isValidObjectId(input.customer)
    ) {
      throw new ApiError("Invalid customer ID.", 400, {
        code: "INVALID_CUSTOMER_ID",
      });
    }

    validatePassengerDates(
      input.dateOfBirth,
      input.documentExpiryDate,
    );

    const nextDocumentType =
      input.documentType === undefined
        ? existing.documentType
        : input.documentType;

    const nextDocumentNumber =
      input.documentNumber === undefined
        ? existing.documentNumber
        : input.documentNumber;

    if (Boolean(nextDocumentType) !== Boolean(nextDocumentNumber)) {
      throw new ApiError(
        "Document type and document number must be provided together.",
        400,
        { code: "INCOMPLETE_PASSENGER_DOCUMENT" },
      );
    }

    if (
      nextDocumentType &&
      nextDocumentNumber &&
      (await passengerRepository.documentExists(
        nextDocumentType,
        nextDocumentNumber,
        passengerId,
      ))
    ) {
      throw new ApiError(
        "Another passenger already uses this document.",
        409,
        { code: "PASSENGER_DOCUMENT_EXISTS" },
      );
    }

    const nextAssistanceRequired =
      input.specialAssistanceRequired ??
      existing.specialAssistanceRequired;

    const nextAssistanceNotes =
      input.specialAssistanceNotes === undefined
        ? existing.specialAssistanceNotes
        : input.specialAssistanceNotes;

    if (!nextAssistanceRequired && nextAssistanceNotes) {
      throw new ApiError(
        "Enable special assistance before providing assistance notes.",
        400,
        { code: "INVALID_SPECIAL_ASSISTANCE_NOTES" },
      );
    }

    const updated = await passengerRepository.updateById(
      passengerId,
      input,
    );

    if (!updated) {
      throw new ApiError("Passenger could not be updated.", 500, {
        code: "PASSENGER_UPDATE_FAILED",
      });
    }

    return toPassengerResponse(updated);
  }

  async deletePassenger(passengerId: string): Promise<void> {
    if (!mongoose.isValidObjectId(passengerId)) {
      throw new ApiError("Invalid passenger ID.", 400, {
        code: "INVALID_PASSENGER_ID",
      });
    }

    const passenger =
      await passengerRepository.findById(passengerId);

    if (!passenger) {
      throw new ApiError("Passenger not found.", 404, {
        code: "PASSENGER_NOT_FOUND",
      });
    }

    await passengerRepository.deleteById(passengerId);
  }

  async getPassengersByCustomer(
    customerId: string,
  ): Promise<PassengerProfileResponse[]> {
    if (!mongoose.isValidObjectId(customerId)) {
      throw new ApiError("Invalid customer ID.", 400, {
        code: "INVALID_CUSTOMER_ID",
      });
    }

    const passengers =
      await passengerRepository.findByCustomer(customerId);

    return passengers.map(toPassengerResponse);
  }

  async countPassengers(
    filters: PassengerFilters = {},
  ): Promise<number> {
    return passengerRepository.count(filters);
  }

  async getPassengerStatistics(): Promise<PassengerCountResult> {
    const [total, statusCounts] = await Promise.all([
      passengerRepository.count(),
      passengerRepository.countByStatus(),
    ]);

    return {
      total,
      active: statusCounts.active,
      inactive: statusCounts.inactive,
      blocked: statusCounts.blocked,
    };
  }

  async getPassengerCountsByCustomer(): Promise<
    Array<{ customer: string; passengerCount: number }>
  > {
    return passengerRepository.countByCustomer();
  }
}

export const passengerService = new PassengerService();
