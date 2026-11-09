
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { customerService } from "../../customers/services/customer.service.js";

import { passengerService } from "../services/passenger.service.js";

import type {
  PassengerFilters,
  PassengerPaginationOptions,
  CreatePassengerInput,
  UpdatePassengerInput,
} from "../types/passenger.types.js";

import type {
  PassengerListValidatedQuery,
} from "../validations/passenger.validation.js";

export class PassengerController {
  createPassenger = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const input = res.locals.validated.body as Omit<
        CreatePassengerInput,
        "customer"
      > & { customer?: string };
      const user = res.locals.authenticatedUser;

      if (!user) {
        throw new ApiError("Authentication is required.", 401, {
          code: "UNAUTHENTICATED",
        });
      }

      const customerId =
        user.role === "admin" || user.role === "super_admin"
          ? input.customer
          : await customerService.getProfileIdForUser(user.id);

      if (!customerId) {
        throw new ApiError("A customer profile is required.", 403, {
          code: "CUSTOMER_PROFILE_REQUIRED",
        });
      }

      if (input.customer && input.customer !== customerId) {
        throw new ApiError(
          "Passengers can only be created for the authenticated customer.",
          403,
          { code: "CUSTOMER_OWNERSHIP_REQUIRED" },
        );
      }

      const passenger = await passengerService.createPassenger({
        ...input,
        customer: customerId,
      });

      res.status(201).json({
        success: true,
        message: "Passenger created successfully.",
        data: passenger,
      });
    },
  );

  getPassengerById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const passengerId = String(req.params.id);
      const user = res.locals.authenticatedUser;

      if (!user) {
        throw new ApiError("Authentication is required.", 401, {
          code: "UNAUTHENTICATED",
        });
      }

      if (user.role !== "admin" && user.role !== "super_admin") {
        const customerId = await customerService.getProfileIdForUser(
          user.id,
        );

        const passenger =
          await passengerService.getPassengerById(passengerId);

        if (passenger.customer !== customerId) {
          throw new ApiError("Passenger not found.", 404, {
            code: "PASSENGER_NOT_FOUND",
          });
        }

        res.status(200).json({
          success: true,
          message: "Passenger retrieved successfully.",
          data: passenger,
        });
        return;
      }

      const passenger =
        await passengerService.getPassengerById(passengerId);

      res.status(200).json({
        success: true,
        message: "Passenger retrieved successfully.",
        data: passenger,
      });
    },
  );

  listPassengers = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const query = res.locals.validated.query as PassengerListValidatedQuery;

      const filters: PassengerFilters = {
        search: query.search,
        customer: query.customer,
        firstName: query.firstName,
        lastName: query.lastName,
        email: query.email,
        nationality: query.nationality,
        gender: query.gender,
        status: query.status,
        documentType: query.documentType,
        specialAssistanceRequired:
          query.specialAssistanceRequired,
        dateOfBirthFrom: query.dateOfBirthFrom,
        dateOfBirthTo: query.dateOfBirthTo,
        createdFrom: query.createdFrom,
        createdTo: query.createdTo,
      };

      const pagination: PassengerPaginationOptions = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      };

      const result = await passengerService.listPassengers(
        filters,
        pagination,
      );

      res.status(200).json({
        success: true,
        message: "Passengers retrieved successfully.",
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  updatePassenger = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const passengerId = String(req.params.id);

      const input = res.locals.validated.body as UpdatePassengerInput;

      const passenger = await passengerService.updatePassenger(
        passengerId,
        input,
      );

      res.status(200).json({
        success: true,
        message: "Passenger updated successfully.",
        data: passenger,
      });
    },
  );

  deletePassenger = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const passengerId = String(req.params.id);

      await passengerService.deletePassenger(passengerId);

      res.status(200).json({
        success: true,
        message: "Passenger deleted successfully.",
      });
    },
  );

  getPassengersByCustomer = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const requestedCustomerId = String(req.params.customerId);
      const user = res.locals.authenticatedUser;

      if (!user) {
        throw new ApiError("Authentication is required.", 401, {
          code: "UNAUTHENTICATED",
        });
      }

      const customerId =
        user.role === "admin" || user.role === "super_admin"
          ? requestedCustomerId
          : await customerService.getProfileIdForUser(user.id);

      if (requestedCustomerId !== customerId) {
        throw new ApiError("Customer profile not found.", 404, {
          code: "CUSTOMER_PROFILE_NOT_FOUND",
        });
      }

      const passengers =
        await passengerService.getPassengersByCustomer(customerId);

      res.status(200).json({
        success: true,
        message: "Customer passengers retrieved successfully.",
        data: passengers,
      });
    },
  );

  countPassengers = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const query = res.locals.validated.query as {
        customer?: string;
        status?: PassengerFilters["status"];
      };

      const total = await passengerService.countPassengers({
        customer: query.customer,
        status: query.status,
      });

      res.status(200).json({
        success: true,
        message: "Passenger count retrieved successfully.",
        data: { total },
      });
    },
  );

  getPassengerStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics =
        await passengerService.getPassengerStatistics();

      res.status(200).json({
        success: true,
        message: "Passenger statistics retrieved successfully.",
        data: statistics,
      });
    },
  );

  getPassengerCountsByCustomer = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const counts =
        await passengerService.getPassengerCountsByCustomer();

      res.status(200).json({
        success: true,
        message: "Passenger counts by customer retrieved successfully.",
        data: counts,
      });
    },
  );
}

export const passengerController = new PassengerController();
