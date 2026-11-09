
import mongoose from "mongoose";

import { ApiError } from "../../../utils/api-error.js";

import { bookingRepository } from "../repositories/booking.repository.js";
import { customerService } from "../../customers/services/customer.service.js";

import type {
  BookingCountResult,
  BookingFilters,
  BookingPaginationOptions,
  BookingProfileResponse,
  BookingRevenueResult,
  CreateBookingInput,
  PaginatedBookings,
  UpdateBookingInput,
} from "../types/booking.types.js";

import type { BookingRecord } from "../models/booking.model.js";

function toBookingResponse(
  booking: BookingRecord,
): BookingProfileResponse {
  return {
    id: booking._id.toString(),
    bookingReference: booking.bookingReference,
    customer: booking.customer.toString(),
    flight: booking.flight.toString(),
    passengers: booking.passengers.map((passenger) =>
      passenger.toString(),
    ),
    passengerCount: booking.passengerCount,
    bookingClass: booking.bookingClass,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    currency: booking.currency,
    baseFare: booking.baseFare,
    taxes: booking.taxes,
    fees: booking.fees,
    discount: booking.discount,
    totalAmount: booking.totalAmount,
    bookedAt: booking.bookedAt,
    expiresAt: booking.expiresAt ?? undefined,
    cancelledAt: booking.cancelledAt ?? undefined,
    cancellationReason: booking.cancellationReason ?? undefined,
    notes: booking.notes ?? undefined,
    trackingReference: booking.trackingReference ?? undefined,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

function calculateTotal(
  baseFare: number,
  taxes: number,
  fees: number,
  discount: number,
): number {
  const total = baseFare + taxes + fees - discount;

  if (!Number.isFinite(total) || total < 0) {
    throw new ApiError(
      "The booking total cannot be negative or invalid.",
      400,
      { code: "INVALID_BOOKING_TOTAL" },
    );
  }

  return Math.round((total + Number.EPSILON) * 100) / 100;
}

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = new mongoose.Types.ObjectId()
    .toString()
    .slice(-8)
    .toUpperCase();

  return `SOG-${timestamp}-${randomPart}`;
}

export class BookingService {
  async createBooking(
    input: CreateBookingInput,
  ): Promise<BookingProfileResponse> {
    const baseFare = input.baseFare;
    const taxes = input.taxes ?? 0;
    const fees = input.fees ?? 0;
    const discount = input.discount ?? 0;

    const totalAmount = calculateTotal(
      baseFare,
      taxes,
      fees,
      discount,
    );

    if (
      input.totalAmount !== undefined &&
      Math.abs(input.totalAmount - totalAmount) > 0.01
    ) {
      throw new ApiError(
        "The supplied total does not match the booking price breakdown.",
        400,
        { code: "BOOKING_TOTAL_MISMATCH" },
      );
    }

    const bookingReference =
      input.bookingReference ?? generateBookingReference();

    if (
      await bookingRepository.bookingReferenceExists(bookingReference)
    ) {
      throw new ApiError(
        "A booking with this reference already exists.",
        409,
        { code: "BOOKING_REFERENCE_EXISTS" },
      );
    }

    const booking = await bookingRepository.create({
      ...input,
      bookingReference,
      taxes,
      fees,
      discount,
      totalAmount,
    });

    return toBookingResponse(booking);
  }

  async getBookingById(
    bookingId: string,
  ): Promise<BookingProfileResponse> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    return toBookingResponse(booking);
  }

  async getBookingByIdForAccess(
    bookingId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<BookingProfileResponse> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (!isAdmin) {
      const customerId = await customerService.getProfileIdForUser(userId);
      if (booking.customer.toString() !== customerId) {
        throw new ApiError("Booking not found.", 404, {
          code: "BOOKING_NOT_FOUND",
        });
      }
    }

    return toBookingResponse(booking);
  }

  async getBookingByReference(
    bookingReference: string,
  ): Promise<BookingProfileResponse> {
    const booking =
      await bookingRepository.findByReference(bookingReference);

    if (!booking) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    return toBookingResponse(booking);
  }

  async getBookingByReferenceForAccess(
    bookingReference: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<BookingProfileResponse> {
    const booking =
      await bookingRepository.findByReference(bookingReference);

    if (!booking) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (!isAdmin) {
      const customerId = await customerService.getProfileIdForUser(userId);
      if (booking.customer.toString() !== customerId) {
        throw new ApiError("Booking not found.", 404, {
          code: "BOOKING_NOT_FOUND",
        });
      }
    }

    return toBookingResponse(booking);
  }

  async updateBooking(
    bookingId: string,
    input: UpdateBookingInput,
  ): Promise<BookingProfileResponse> {
    const existing = await bookingRepository.findById(bookingId);

    if (!existing) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (existing.status === "cancelled") {
      throw new ApiError(
        "A cancelled booking cannot be updated.",
        409,
        { code: "CANCELLED_BOOKING_UPDATE" },
      );
    }

    const baseFare = input.baseFare ?? existing.baseFare;
    const taxes = input.taxes ?? existing.taxes;
    const fees = input.fees ?? existing.fees;
    const discount = input.discount ?? existing.discount;

    const totalAmount = calculateTotal(
      baseFare,
      taxes,
      fees,
      discount,
    );

    if (
      input.totalAmount !== undefined &&
      Math.abs(input.totalAmount - totalAmount) > 0.01
    ) {
      throw new ApiError(
        "The supplied total does not match the booking price breakdown.",
        400,
        { code: "BOOKING_TOTAL_MISMATCH" },
      );
    }

    const nextPassengerCount =
      input.passengerCount ?? existing.passengerCount;

    const nextPassengers =
      input.passengers ??
      existing.passengers.map((passenger) => passenger.toString());

    if (nextPassengers.length > nextPassengerCount) {
      throw new ApiError(
        "Passenger records cannot exceed the booking passenger count.",
        400,
        { code: "BOOKING_PASSENGER_COUNT_MISMATCH" },
      );
    }

    const updateData = {
      ...input,
      totalAmount,
    };

    const updated = await bookingRepository.updateById(
      bookingId,
      updateData,
    );

    if (!updated) {
      throw new ApiError("Booking could not be updated.", 500, {
        code: "BOOKING_UPDATE_FAILED",
      });
    }

    return toBookingResponse(updated);
  }

  async cancelBooking(
    bookingId: string,
    cancellationReason?: string,
    customerId?: string,
  ): Promise<BookingProfileResponse> {
    const existing = await bookingRepository.findById(bookingId);

    if (!existing) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (
      customerId &&
      existing.customer.toString() !== customerId
    ) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (existing.status === "cancelled") {
      throw new ApiError(
        "This booking has already been cancelled.",
        409,
        { code: "BOOKING_ALREADY_CANCELLED" },
      );
    }

    if (existing.status === "completed") {
      throw new ApiError(
        "A completed booking cannot be cancelled.",
        409,
        { code: "COMPLETED_BOOKING_CANCELLATION" },
      );
    }

    const updated = await bookingRepository.updateById(bookingId, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: cancellationReason?.trim() || null,
    });

    if (!updated) {
      throw new ApiError("Booking could not be cancelled.", 500, {
        code: "BOOKING_CANCELLATION_FAILED",
      });
    }

    return toBookingResponse(updated);
  }

  async listBookings(
    filters: BookingFilters,
    pagination: BookingPaginationOptions,
  ): Promise<PaginatedBookings> {
    const [bookings, totalItems] = await Promise.all([
      bookingRepository.findMany(filters, pagination),
      bookingRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: bookings.map(toBookingResponse),
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

  async deleteBooking(bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    await bookingRepository.deleteById(bookingId);
  }

  async countBookings(
    filters: BookingFilters = {},
  ): Promise<number> {
    return bookingRepository.count(filters);
  }

  async getBookingStatistics(): Promise<BookingCountResult> {
    const [total, statusCounts] = await Promise.all([
      bookingRepository.count(),
      bookingRepository.countByStatus(),
    ]);

    return {
      total,
      pending: statusCounts.pending,
      confirmed: statusCounts.confirmed,
      cancelled: statusCounts.cancelled,
      completed: statusCounts.completed,
      expired: statusCounts.expired,
    };
  }

  async getBookingRevenue(): Promise<BookingRevenueResult[]> {
    return bookingRepository.getRevenueByCurrency();
  }
}

export const bookingService = new BookingService();
