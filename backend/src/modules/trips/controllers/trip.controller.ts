
import type { Request, Response } from "express";
import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { customerService } from "../../customers/services/customer.service.js";
import { tripService } from "../services/trip.service.js";
import type {
  CreateTripValidatedInput,
  UpdateTripValidatedInput,
  TripIdParams,
  TripReferenceParams,
  TripBookingParams,
  TripListValidatedQuery,
  TripCountValidatedQuery,
  CancelTripValidatedInput,
} from "../validations/trip.validation.js";

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

const getValidatedData = <T>(
  res: Response,
  key: keyof ValidatedRequestData,
): T => {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  const value = validated?.[key];

  if (value === undefined) {
    throw new ApiError(
      `Validated ${key} data is missing.`,
      500,
      { code: "VALIDATED_DATA_MISSING" },
    );
  }

  return value as T;
};

const getAuthenticatedCustomerId = async (res: Response): Promise<string> => {
  const user = res.locals.authenticatedUser as
    | { id?: string; role?: string }
    | undefined;

  if (!user?.id) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  if (user.role !== "customer") {
    throw new ApiError("A customer account is required.", 403, {
      code: "CUSTOMER_ACCOUNT_REQUIRED",
    });
  }

  return customerService.getProfileIdForUser(user.id);
};

class TripController {
  createTrip = asyncHandler(async (_req: Request, res: Response) => {
    const input = getValidatedData<CreateTripValidatedInput>(
      res,
      "body",
    );

    const trip = await tripService.createTrip(input);

    res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      data: trip,
    });
  });

  getTrips = asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<TripListValidatedQuery>(
      res,
      "query",
    );

    const {
      page,
      limit,
      sortBy,
      sortOrder,
      ...filters
    } = query;

    const result = await tripService.getTrips(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      message: "Trips retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  });

  getMyTrips = asyncHandler(async (_req: Request, res: Response) => {
      const customerId = await getAuthenticatedCustomerId(res);
      const query = getValidatedData<TripListValidatedQuery>(
        res,
        "query",
      );
      const { page, limit, sortBy, sortOrder, ...filters } = query;
      const result = await tripService.getCustomerTrips(
        customerId,
        filters,
        { page, limit, sortBy, sortOrder },
      );

      res.status(200).json({
        success: true,
        message: "Customer trips retrieved successfully.",
        data: result.items,
        pagination: result.pagination,
      });
  });

  getMyTripByBooking = asyncHandler(
    async (_req: Request, res: Response) => {
      const customerId = await getAuthenticatedCustomerId(res);
      const { bookingId } = getValidatedData<TripBookingParams>(
        res,
        "params",
      );
      const result = await tripService.getCustomerTrips(
        customerId,
        { booking: bookingId },
        { page: 1, limit: 1, sortBy: "departureDate", sortOrder: "desc" },
      );

      res.status(200).json({
        success: true,
        message: "Customer booking trip retrieved successfully.",
        data: result.items[0] ?? null,
      });
    },
  );

  getTripById = asyncHandler(async (_req: Request, res: Response) => {
    const { tripId } = getValidatedData<TripIdParams>(
      res,
      "params",
    );

    const trip = await tripService.getTripById(tripId);

    res.status(200).json({
      success: true,
      message: "Trip retrieved successfully.",
      data: trip,
    });
  });

  getTripByReference = asyncHandler(
    async (_req: Request, res: Response) => {
      const { tripReference } =
        getValidatedData<TripReferenceParams>(res, "params");

      const trip = await tripService.getTripByReference(tripReference);

      res.status(200).json({
        success: true,
        message: "Trip retrieved successfully.",
        data: trip,
      });
    },
  );

  getTripsByBooking = asyncHandler(
    async (req: Request, res: Response) => {
      const bookingId = req.params.bookingId;

      if (typeof bookingId !== "string") {
        throw new ApiError("A booking ID is required.", 400, {
          code: "BOOKING_ID_REQUIRED",
        });
      }

      const trips = await tripService.getTripsByBooking(bookingId);

      res.status(200).json({
        success: true,
        message: "Booking trips retrieved successfully.",
        data: trips,
      });
    },
  );

  updateTrip = asyncHandler(async (_req: Request, res: Response) => {
    const { tripId } = getValidatedData<TripIdParams>(
      res,
      "params",
    );

    const input = getValidatedData<UpdateTripValidatedInput>(
      res,
      "body",
    );

    const trip = await tripService.updateTrip(tripId, input);

    res.status(200).json({
      success: true,
      message: "Trip updated successfully.",
      data: trip,
    });
  });

  cancelTrip = asyncHandler(async (_req: Request, res: Response) => {
    const { tripId } = getValidatedData<TripIdParams>(
      res,
      "params",
    );

    const { reason } = getValidatedData<CancelTripValidatedInput>(
      res,
      "body",
    );

    const trip = await tripService.cancelTrip(tripId, reason);

    res.status(200).json({
      success: true,
      message: "Trip cancelled successfully.",
      data: trip,
    });
  });

  deleteTrip = asyncHandler(async (_req: Request, res: Response) => {
    const { tripId } = getValidatedData<TripIdParams>(
      res,
      "params",
    );

    const trip = await tripService.deleteTrip(tripId);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully.",
      data: trip,
    });
  });

  getTripCounts = asyncHandler(
    async (_req: Request, res: Response) => {
      const filters = getValidatedData<TripCountValidatedQuery>(
        res,
        "query",
      );

      const counts = await tripService.getTripCounts(filters);

      res.status(200).json({
        success: true,
        message: "Trip statistics retrieved successfully.",
        data: counts,
      });
    },
  );

  countTrips = asyncHandler(
    async (_req: Request, res: Response) => {
      const filters = getValidatedData<TripCountValidatedQuery>(
        res,
        "query",
      );

      const total = await tripService.countTrips(filters);

      res.status(200).json({
        success: true,
        message: "Trip count retrieved successfully.",
        data: { total },
      });
    },
  );
}

export const tripController = new TripController();
