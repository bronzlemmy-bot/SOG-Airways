
import { Types } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";

import {
  CheckIn,
  type CheckInRecord,
  type CheckInStatus,
  type BoardingPassStatus,
} from "../models/check-in-record.model.js";

import { checkInRepository } from "../repositories/check-in.repository.js";

import type {
  CheckInCountResult,
  CheckInFilters,
  CheckInPaginationOptions,
  CreateCheckInInput,
  UpdateCheckInInput,
} from "../types/check-in.types.js";

type CheckInProfile = {
  id: string;
  booking: string;
  ticket: string;
  passenger: string;
  flight: string;
  customer: string;
  status: CheckInStatus;
  boardingPassStatus: BoardingPassStatus;
  checkInReference: string | null;
  seatNumber: string | null;
  checkedInAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  boardingPassIssuedAt: Date | null;
  boardingPassUsedAt: Date | null;
  baggageCount: number;
  baggageWeightKg: number;
  specialAssistanceRequired: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class CheckInService {
  async createCheckIn(
    input: CreateCheckInInput,
  ): Promise<CheckInProfile> {
    this.validateObjectIds(input);

    const existingTicket = await checkInRepository.findByTicket(
      input.ticket,
    );

    if (existingTicket) {
      throw new ApiError(
        "A check-in record already exists for this ticket.",
        409,
        { code: "CHECK_IN_ALREADY_EXISTS" },
      );
    }

    const existingCombination =
      await checkInRepository.findByBookingPassengerAndFlight(
        input.booking,
        input.passenger,
        input.flight,
      );

    if (existingCombination) {
      throw new ApiError(
        "A check-in record already exists for this passenger and flight.",
        409,
        { code: "DUPLICATE_CHECK_IN" },
      );
    }

    if (
      input.status === "checked_in" &&
      !input.checkedInAt
    ) {
      input.checkedInAt = new Date();
    }

    const created = await checkInRepository.create(input);

    return this.toProfile(created);
  }

  async getCheckInById(
    id: string,
    customerId?: string,
  ): Promise<CheckInProfile> {
    this.validateObjectId(id, "Check-in ID");

    const record = await checkInRepository.findById(id);

    if (!record) {
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    }

    this.assertCustomerOwnership(record, customerId);
    return this.toProfile(record);
  }

  async getCheckInByReference(
    reference: string,
    customerId?: string,
  ): Promise<CheckInProfile> {
    const record = await checkInRepository.findByReference(reference);

    if (!record) {
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    }

    this.assertCustomerOwnership(record, customerId);
    return this.toProfile(record);
  }

  async listCheckIns(
    filters: CheckInFilters,
    pagination: CheckInPaginationOptions,
  ): Promise<{
    items: CheckInProfile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    this.validatePagination(pagination);

    const [records, total] = await Promise.all([
      checkInRepository.findMany(filters, pagination),
      checkInRepository.count(filters),
    ]);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      items: records.map((record) => this.toProfile(record)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1,
      },
    };
  }

  async getCustomerCheckIns(
    customerId: string,
    pagination: CheckInPaginationOptions,
  ): Promise<CheckInProfile[]> {
    this.validateObjectId(customerId, "Customer ID");
    this.validatePagination(pagination);

    const records = await checkInRepository.findByCustomer(
      customerId,
      pagination,
    );

    return records.map((record) => this.toProfile(record));
  }

  async getFlightCheckIns(
    flightId: string,
    pagination: CheckInPaginationOptions,
  ): Promise<CheckInProfile[]> {
    this.validateObjectId(flightId, "Flight ID");
    this.validatePagination(pagination);

    const records = await checkInRepository.findByFlight(
      flightId,
      pagination,
    );

    return records.map((record) => this.toProfile(record));
  }

  async getBookingCheckIns(
    bookingId: string,
  ): Promise<CheckInProfile[]> {
    this.validateObjectId(bookingId, "Booking ID");

    const records = await checkInRepository.findByBooking(bookingId);

    return records.map((record) => this.toProfile(record));
  }

  async updateCheckIn(
    id: string,
    updates: UpdateCheckInInput,
    customerId?: string,
  ): Promise<CheckInProfile> {
    this.validateObjectId(id, "Check-in ID");

    const existing = await checkInRepository.findById(id);

    if (!existing) {
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    }

    this.assertCustomerOwnership(existing, customerId);

    if (updates.status) {
      this.validateStatusTransition(existing.status, updates.status);
    }

    if (updates.boardingPassStatus) {
      this.validateBoardingPassTransition(
        existing.boardingPassStatus,
        updates.boardingPassStatus,
      );
    }

    if (
      updates.boardingPassStatus === "used" &&
      !existing.boardingPassIssuedAt &&
      !updates.boardingPassIssuedAt
    ) {
      throw new ApiError(
        "A boarding pass must be issued before it can be used.",
        400,
        { code: "BOARDING_PASS_NOT_ISSUED" },
      );
    }

    if (
      updates.status === "cancelled" &&
      (existing.boardingPassStatus === "used" ||
        updates.boardingPassStatus === "used")
    ) {
      throw new ApiError(
        "A check-in with a used boarding pass cannot be cancelled.",
        400,
        { code: "USED_BOARDING_PASS_CANNOT_BE_CANCELLED" },
      );
    }

    const updated = await checkInRepository.update(
      id,
      updates,
      customerId,
    );

    if (!updated) {
      throw new ApiError("Check-in record could not be updated.", 500, {
        code: "CHECK_IN_UPDATE_FAILED",
      });
    }

    return this.toProfile(updated);
  }

  async cancelCheckIn(
    id: string,
    reason: string,
    customerId?: string,
  ): Promise<CheckInProfile> {
    const normalizedReason = reason.trim();

    if (normalizedReason.length < 3 || normalizedReason.length > 500) {
      throw new ApiError(
        "Cancellation reason must contain between 3 and 500 characters.",
        400,
        { code: "INVALID_CANCELLATION_REASON" },
      );
    }

    return this.updateCheckIn(
      id,
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: normalizedReason,
      },
      customerId,
    );
  }

  async issueBoardingPass(id: string): Promise<CheckInProfile> {
    return this.updateCheckIn(id, {
      boardingPassStatus: "issued",
      boardingPassIssuedAt: new Date(),
    });
  }

  async markBoardingPassUsed(id: string): Promise<CheckInProfile> {
    return this.updateCheckIn(id, {
      boardingPassStatus: "used",
      boardingPassUsedAt: new Date(),
    });
  }

  async deleteCheckIn(id: string): Promise<CheckInProfile> {
    this.validateObjectId(id, "Check-in ID");

    const existing = await checkInRepository.findById(id);

    if (!existing) {
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    }

    if (existing.boardingPassStatus === "used") {
      throw new ApiError(
        "A check-in with a used boarding pass cannot be deleted.",
        400,
        { code: "USED_BOARDING_PASS_CANNOT_BE_DELETED" },
      );
    }

    const deleted = await checkInRepository.delete(id);

    if (!deleted) {
      throw new ApiError("Check-in record could not be deleted.", 500, {
        code: "CHECK_IN_DELETE_FAILED",
      });
    }

    return this.toProfile(deleted);
  }

  async countCheckIns(
    filters: CheckInFilters = {},
  ): Promise<CheckInCountResult> {
    const [total, byStatus, byBoardingPassStatus] = await Promise.all([
      checkInRepository.count(filters),
      checkInRepository.countByStatus(filters),
      checkInRepository.countByBoardingPassStatus(filters),
    ]);

    return {
      total,
      byStatus,
      byBoardingPassStatus,
    };
  }

  private validateStatusTransition(
    current: CheckInStatus,
    next: CheckInStatus,
  ): void {
    if (current === next) return;

    const allowed: Record<CheckInStatus, CheckInStatus[]> = {
      pending: ["checked_in", "cancelled"],
      checked_in: ["cancelled"],
      cancelled: [],
    };

    if (!allowed[current].includes(next)) {
      throw new ApiError(
        `Check-in status cannot transition from '${current}' to '${next}'.`,
        400,
        { code: "INVALID_CHECK_IN_STATUS_TRANSITION" },
      );
    }
  }

  private validateBoardingPassTransition(
    current: BoardingPassStatus,
    next: BoardingPassStatus,
  ): void {
    if (current === next) return;

    const allowed: Record<
      BoardingPassStatus,
      BoardingPassStatus[]
    > = {
      not_issued: ["issued", "voided"],
      issued: ["used", "voided"],
      used: [],
      voided: [],
    };

    if (!allowed[current].includes(next)) {
      throw new ApiError(
        `Boarding pass status cannot transition from '${current}' to '${next}'.`,
        400,
        { code: "INVALID_BOARDING_PASS_TRANSITION" },
      );
    }
  }

  private validateObjectId(
    value: string,
    label: string,
  ): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new ApiError(`${label} is invalid.`, 400, {
        code: "INVALID_OBJECT_ID",
      });
    }
  }

  private assertCustomerOwnership(
    record: CheckInRecord,
    customerId?: string,
  ): void {
    if (
      customerId &&
      record.customer.toString() !== customerId
    ) {
      throw new ApiError("Check-in record not found.", 404, {
        code: "CHECK_IN_NOT_FOUND",
      });
    }
  }

  private validateObjectIds(input: CreateCheckInInput): void {
    this.validateObjectId(input.booking, "Booking ID");
    this.validateObjectId(input.ticket, "Ticket ID");
    this.validateObjectId(input.passenger, "Passenger ID");
    this.validateObjectId(input.flight, "Flight ID");
    this.validateObjectId(input.customer, "Customer ID");
  }

  private validatePagination(
    pagination: CheckInPaginationOptions,
  ): void {
    if (!Number.isInteger(pagination.page) || pagination.page < 1) {
      throw new ApiError("Page must be a positive integer.", 400, {
        code: "INVALID_PAGE",
      });
    }

    if (
      !Number.isInteger(pagination.limit) ||
      pagination.limit < 1 ||
      pagination.limit > 100
    ) {
      throw new ApiError("Limit must be between 1 and 100.", 400, {
        code: "INVALID_LIMIT",
      });
    }
  }

  private toProfile(record: CheckInRecord): CheckInProfile {
    const raw = record as CheckInRecord & {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    };

    return {
      id: raw._id.toString(),
      booking: String(raw.booking),
      ticket: String(raw.ticket),
      passenger: String(raw.passenger),
      flight: String(raw.flight),
      customer: String(raw.customer),
      status: raw.status,
      boardingPassStatus: raw.boardingPassStatus,
      checkInReference: raw.checkInReference ?? null,
      seatNumber: raw.seatNumber ?? null,
      checkedInAt: raw.checkedInAt ?? null,
      cancelledAt: raw.cancelledAt ?? null,
      cancellationReason: raw.cancellationReason ?? null,
      boardingPassIssuedAt: raw.boardingPassIssuedAt ?? null,
      boardingPassUsedAt: raw.boardingPassUsedAt ?? null,
      baggageCount: raw.baggageCount,
      baggageWeightKg: raw.baggageWeightKg,
      specialAssistanceRequired: raw.specialAssistanceRequired,
      notes: raw.notes ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

export const checkInService = new CheckInService();
