
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { airportService } from "../services/airport.service.js";

import type {
  CreateAirportRequest,
  UpdateAirportRequest,
  AirportIdParam,
  AirportCodeParam,
  AirportProfileQuery,
} from "../validations/airport.validation.js";

export const createAirport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated?.body as
      | CreateAirportRequest
      | undefined;

    if (!input) {
      throw new ApiError("Validated request body is missing.", 400, {
        code: "VALIDATED_BODY_MISSING",
      });
    }

    const airport = await airportService.createAirport(input);

    res.status(201).json({
      success: true,
      message: "Airport created successfully.",
      data: airport,
    });
  },
);

export const getAirportById = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const params = res.locals.validated?.params as
      | AirportIdParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    const airport = await airportService.getAirportById(params.airportId);

    res.status(200).json({
      success: true,
      message: "Airport retrieved successfully.",
      data: airport,
    });
  },
);

export const getAirportByCode = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const params = res.locals.validated?.params as
      | AirportCodeParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    const airport = await airportService.getAirportByCode(
      params.airportCode,
    );

    res.status(200).json({
      success: true,
      message: "Airport retrieved successfully.",
      data: airport,
    });
  },
);

export const updateAirport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const params = res.locals.validated?.params as
      | AirportIdParam
      | undefined;

    const input = res.locals.validated?.body as
      | UpdateAirportRequest
      | undefined;

    if (!params || !input) {
      throw new ApiError("Validated request data is missing.", 400, {
        code: "VALIDATED_REQUEST_DATA_MISSING",
      });
    }

    const airport = await airportService.updateAirport(
      params.airportId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Airport updated successfully.",
      data: airport,
    });
  },
);

export const listAirports = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const query = res.locals.validated?.query as
      | AirportProfileQuery
      | undefined;

    if (!query) {
      throw new ApiError("Validated query parameters are missing.", 400, {
        code: "VALIDATED_QUERY_MISSING",
      });
    }

    const { page, limit, ...filters } = query;

    const result = await airportService.listAirports(filters, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Airports retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const deleteAirport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const params = res.locals.validated?.params as
      | AirportIdParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    await airportService.deleteAirport(params.airportId);

    res.status(200).json({
      success: true,
      message: "Airport deleted successfully.",
    });
  },
);

export const countAirports = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const total = await airportService.countAirports();

    res.status(200).json({
      success: true,
      message: "Airport count retrieved successfully.",
      data: { total },
    });
  },
);
