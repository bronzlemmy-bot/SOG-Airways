
import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler.js";
import { AircraftService } from "../services/aircraft.service.js";

import type {
  AircraftFilters,
  AircraftPaginationOptions,
  CreateAircraftInput,
  UpdateAircraftInput,
} from "../types/aircraft.types.js";

const aircraftService = new AircraftService();

export class AircraftController {
  createAircraft = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const input = res.locals.validated.body as CreateAircraftInput;

      const aircraft = await aircraftService.createAircraft(input);

      res.status(201).json({
        success: true,
        message: "Aircraft created successfully.",
        data: aircraft,
      });
    },
  );

  getAircraftById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const aircraftId = String(req.params.id);
      const aircraft = await aircraftService.getAircraftById(aircraftId);

      res.status(200).json({
        success: true,
        message: "Aircraft retrieved successfully.",
        data: aircraft,
      });
    },
  );

  getAircraftByRegistrationNumber = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const registrationNumber = String(req.params.registrationNumber);

      const aircraft =
        await aircraftService.getAircraftByRegistrationNumber(
          registrationNumber,
        );

      res.status(200).json({
        success: true,
        message: "Aircraft retrieved successfully.",
        data: aircraft,
      });
    },
  );

  listAircraft = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = (res.locals.validated?.query ??
        req.query) as Record<string, unknown>;

      const filters: AircraftFilters = {
        search: typeof query.search === "string" ? query.search : undefined,
        manufacturer:
          typeof query.manufacturer === "string"
            ? query.manufacturer
            : undefined,
        aircraftType: query.aircraftType as AircraftFilters["aircraftType"],
        status: query.status as AircraftFilters["status"],
        manufactureYear:
          query.manufactureYear === undefined
            ? undefined
            : Number(query.manufactureYear),
        minRangeKilometers:
          query.minRangeKilometers === undefined
            ? undefined
            : Number(query.minRangeKilometers),
        maxRangeKilometers:
          query.maxRangeKilometers === undefined
            ? undefined
            : Number(query.maxRangeKilometers),
      };

      const pagination: AircraftPaginationOptions = {
        page: Number(query.page ?? 1),
        limit: Number(query.limit ?? 10),
        sortBy: query.sortBy as AircraftPaginationOptions["sortBy"],
        sortOrder:
          query.sortOrder as AircraftPaginationOptions["sortOrder"],
      };

      const result = await aircraftService.listAircraft(
        filters,
        pagination,
      );

      res.status(200).json({
        success: true,
        message: "Aircraft retrieved successfully.",
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  updateAircraft = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const aircraftId = String(req.params.id);
      const input = res.locals.validated.body as UpdateAircraftInput;

      const aircraft = await aircraftService.updateAircraft(
        aircraftId,
        input,
      );

      res.status(200).json({
        success: true,
        message: "Aircraft updated successfully.",
        data: aircraft,
      });
    },
  );

  deleteAircraft = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const aircraftId = String(req.params.id);

      await aircraftService.deleteAircraft(aircraftId);

      res.status(200).json({
        success: true,
        message: "Aircraft deleted successfully.",
      });
    },
  );

  countAircraft = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const total = await aircraftService.countAircraft();

      res.status(200).json({
        success: true,
        message: "Aircraft count retrieved successfully.",
        data: { total },
      });
    },
  );

  getAircraftStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics = await aircraftService.getAircraftStatistics();

      res.status(200).json({
        success: true,
        message: "Aircraft statistics retrieved successfully.",
        data: statistics,
      });
    },
  );

  getAircraftTypeStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics =
        await aircraftService.getAircraftTypeStatistics();

      res.status(200).json({
        success: true,
        message: "Aircraft type statistics retrieved successfully.",
        data: statistics,
      });
    },
  );
}

export const aircraftController = new AircraftController();
