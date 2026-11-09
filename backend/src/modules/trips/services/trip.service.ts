
import { Types } from "mongoose";
import { ApiError } from "../../../utils/api-error.js";
import { TRIP_STATUSES } from "../models/trip.model.js";
import { tripRepository } from "../repositories/trip.repository.js";
import type {
  CreateTripInput,
  TripFilters,
  TripPaginationOptions,
  UpdateTripInput,
} from "../types/trip.types.js";

const ensureObjectId = (value: string, field: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${field}.`, 400, {
      code: "INVALID_OBJECT_ID",
    });
  }
};

const ensureValidDate = (
  value: Date | null | undefined,
  field: string,
): void => {
  if (value instanceof Date && Number.isNaN(value.getTime())) {
    throw new ApiError(`${field} must be a valid date.`, 400, {
      code: "INVALID_DATE",
    });
  }
};

const ensureTripDates = (
  departureDate?: Date,
  returnDate?: Date | null,
  tripType?: CreateTripInput["tripType"],
): void => {
  ensureValidDate(departureDate, "Departure date");
  ensureValidDate(returnDate, "Return date");

  if (
    departureDate &&
    returnDate instanceof Date &&
    returnDate.getTime() < departureDate.getTime()
  ) {
    throw new ApiError(
      "Return date cannot be earlier than departure date.",
      400,
      { code: "INVALID_TRIP_DATES" },
    );
  }

  if (tripType === "round_trip" && !returnDate) {
    throw new ApiError(
      "A return date is required for a round-trip.",
      400,
      { code: "RETURN_DATE_REQUIRED" },
    );
  }

  if (tripType === "one_way" && returnDate) {
    throw new ApiError(
      "A one-way trip cannot have a return date.",
      400,
      { code: "UNEXPECTED_RETURN_DATE" },
    );
  }
};

class TripService {
  async createTrip(input: CreateTripInput) {
    ensureObjectId(input.customer, "customer ID");
    ensureObjectId(input.originAirport, "origin airport ID");
    ensureObjectId(input.destinationAirport, "destination airport ID");

    if (input.booking) {
      ensureObjectId(input.booking, "booking ID");
    }

    ensureTripDates(
      input.departureDate,
      input.returnDate,
      input.tripType,
    );

    if (
      input.originAirport === input.destinationAirport
    ) {
      throw new ApiError(
        "Origin and destination airports must be different.",
        400,
        { code: "SAME_ORIGIN_DESTINATION" },
      );
    }

    if (
      input.tripReference &&
      (await tripRepository.existsByReference(input.tripReference))
    ) {
      throw new ApiError("Trip reference already exists.", 409, {
        code: "TRIP_REFERENCE_EXISTS",
      });
    }

    return tripRepository.create(input);
  }

  async getTripById(id: string) {
    ensureObjectId(id, "trip ID");

    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    return trip;
  }

  async getCustomerTripById(id: string, customerId: string) {
    ensureObjectId(id, "trip ID");
    ensureObjectId(customerId, "customer ID");

    const trip = await tripRepository.findByIdForCustomer(
      id,
      customerId,
    );

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    return trip;
  }

  async getTripByReference(tripReference: string) {
    const trip = await tripRepository.findByReference(tripReference);

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    return trip;
  }

  async getTrips(
    filters: TripFilters = {},
    pagination: TripPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  ) {
    return tripRepository.findMany(filters, pagination);
  }

  async getCustomerTrips(
    customerId: string,
    filters: Omit<TripFilters, "customer"> = {},
    pagination: TripPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "departureDate",
      sortOrder: "desc",
    },
  ) {
    ensureObjectId(customerId, "customer ID");

    return tripRepository.findMany(
      { ...filters, customer: customerId },
      pagination,
    );
  }

  async getTripsByBooking(bookingId: string) {
    ensureObjectId(bookingId, "booking ID");

    return tripRepository.findByBooking(bookingId);
  }

  async updateTrip(id: string, input: UpdateTripInput) {
    ensureObjectId(id, "trip ID");

    const existingTrip = await tripRepository.findById(id);

    if (!existingTrip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    this.ensureTripCanBeModified(existingTrip.status);

    const departureDate =
      input.departureDate ?? existingTrip.departureDate;

    const returnDate =
      input.returnDate !== undefined
        ? input.returnDate
        : existingTrip.returnDate;

    const tripType = input.tripType ?? existingTrip.tripType;

    ensureTripDates(departureDate, returnDate, tripType);

    const originAirport =
      input.originAirport ?? existingTrip.originAirport.toString();

    const destinationAirport =
      input.destinationAirport ??
      existingTrip.destinationAirport.toString();

    ensureObjectId(originAirport, "origin airport ID");
    ensureObjectId(destinationAirport, "destination airport ID");

    if (originAirport === destinationAirport) {
      throw new ApiError(
        "Origin and destination airports must be different.",
        400,
        { code: "SAME_ORIGIN_DESTINATION" },
      );
    }

    if (
      input.booking &&
      !(await this.isValidObjectId(input.booking))
    ) {
      throw new ApiError("Invalid booking ID.", 400, {
        code: "INVALID_OBJECT_ID",
      });
    }

    const updated = await tripRepository.updateById(id, input);

    if (!updated) {
      throw new ApiError("Trip could not be updated.", 404, {
        code: "TRIP_UPDATE_FAILED",
      });
    }

    return updated;
  }

  async updateCustomerTrip(
    id: string,
    customerId: string,
    input: UpdateTripInput,
  ) {
    ensureObjectId(id, "trip ID");
    ensureObjectId(customerId, "customer ID");

    const existingTrip = await tripRepository.findByIdForCustomer(
      id,
      customerId,
    );

    if (!existingTrip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    this.ensureTripCanBeModified(existingTrip.status);

    const departureDate =
      input.departureDate ?? existingTrip.departureDate;

    const returnDate =
      input.returnDate !== undefined
        ? input.returnDate
        : existingTrip.returnDate;

    const tripType = input.tripType ?? existingTrip.tripType;

    ensureTripDates(departureDate, returnDate, tripType);

    const originAirport =
      input.originAirport ?? existingTrip.originAirport.toString();

    const destinationAirport =
      input.destinationAirport ??
      existingTrip.destinationAirport.toString();

    ensureObjectId(originAirport, "origin airport ID");
    ensureObjectId(destinationAirport, "destination airport ID");

    if (originAirport === destinationAirport) {
      throw new ApiError(
        "Origin and destination airports must be different.",
        400,
        { code: "SAME_ORIGIN_DESTINATION" },
      );
    }

    const updated = await tripRepository.updateForCustomer(
      id,
      customerId,
      input,
    );

    if (!updated) {
      throw new ApiError("Trip could not be updated.", 404, {
        code: "TRIP_UPDATE_FAILED",
      });
    }

    return updated;
  }

  async cancelTrip(id: string, reason: string) {
    ensureObjectId(id, "trip ID");

    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    return this.cancelExistingTrip(id, trip.status, reason);
  }

  async cancelCustomerTrip(
    id: string,
    customerId: string,
    reason: string,
  ) {
    ensureObjectId(id, "trip ID");
    ensureObjectId(customerId, "customer ID");

    const trip = await tripRepository.findByIdForCustomer(
      id,
      customerId,
    );

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    return this.cancelExistingTrip(id, trip.status, reason, customerId);
  }

  private async cancelExistingTrip(
    id: string,
    status: string,
    reason: string,
    customerId?: string,
  ) {
    if (status === "cancelled") {
      throw new ApiError("Trip is already cancelled.", 409, {
        code: "TRIP_ALREADY_CANCELLED",
      });
    }

    if (status === "completed") {
      throw new ApiError("A completed trip cannot be cancelled.", 409, {
        code: "COMPLETED_TRIP_CANNOT_BE_CANCELLED",
      });
    }

    const updates: UpdateTripInput = {
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason.trim(),
    };

    const updated = customerId
      ? await tripRepository.updateForCustomer(id, customerId, updates)
      : await tripRepository.updateById(id, updates);

    if (!updated) {
      throw new ApiError("Trip could not be cancelled.", 404, {
        code: "TRIP_CANCELLATION_FAILED",
      });
    }

    return updated;
  }

  async deleteTrip(id: string) {
    ensureObjectId(id, "trip ID");

    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    if (trip.status === "in_progress" || trip.status === "completed") {
      throw new ApiError(
        "Trips that are in progress or completed cannot be deleted.",
        409,
        { code: "TRIP_CANNOT_BE_DELETED" },
      );
    }

    const deleted = await tripRepository.deleteById(id);

    if (!deleted) {
      throw new ApiError("Trip could not be deleted.", 404, {
        code: "TRIP_DELETE_FAILED",
      });
    }

    return deleted;
  }

  async deleteCustomerTrip(id: string, customerId: string) {
    ensureObjectId(id, "trip ID");
    ensureObjectId(customerId, "customer ID");

    const trip = await tripRepository.findByIdForCustomer(
      id,
      customerId,
    );

    if (!trip) {
      throw new ApiError("Trip not found.", 404, {
        code: "TRIP_NOT_FOUND",
      });
    }

    if (trip.status === "in_progress" || trip.status === "completed") {
      throw new ApiError(
        "Trips that are in progress or completed cannot be deleted.",
        409,
        { code: "TRIP_CANNOT_BE_DELETED" },
      );
    }

    const deleted = await tripRepository.deleteForCustomer(
      id,
      customerId,
    );

    if (!deleted) {
      throw new ApiError("Trip could not be deleted.", 404, {
        code: "TRIP_DELETE_FAILED",
      });
    }

    return deleted;
  }

  async getTripCounts(filters: TripFilters = {}) {
    return tripRepository.getCounts(filters);
  }

  async countTrips(filters: TripFilters = {}) {
    return tripRepository.count(filters);
  }

  async getUpcomingCustomerTrips(customerId: string, limit = 5) {
    ensureObjectId(customerId, "customer ID");

    const now = new Date();

    return tripRepository.findMany(
      {
        customer: customerId,
        departureFrom: now,
        status: "planned",
      },
      {
        page: 1,
        limit: Math.min(100, Math.max(1, limit)),
        sortBy: "departureDate",
        sortOrder: "asc",
      },
    );
  }

  private ensureTripCanBeModified(status: string) {
    if (status === "cancelled") {
      throw new ApiError("Cancelled trips cannot be modified.", 409, {
        code: "CANCELLED_TRIP_CANNOT_BE_MODIFIED",
      });
    }

    if (status === "completed" || status === "in_progress") {
      throw new ApiError(
        "Trips that are in progress or completed cannot be modified.",
        409,
        { code: "TRIP_CANNOT_BE_MODIFIED" },
      );
    }

    if (!(TRIP_STATUSES as readonly string[]).includes(status)) {
      throw new ApiError("Trip status is invalid.", 400, {
        code: "INVALID_TRIP_STATUS",
      });
    }
  }

  private async isValidObjectId(value: string): Promise<boolean> {
    return Types.ObjectId.isValid(value);
  }
}

export const tripService = new TripService();
