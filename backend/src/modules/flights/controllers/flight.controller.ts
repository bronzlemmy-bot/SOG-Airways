
import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler.js";

import { FlightService } from "../services/flight.service.js";

import type {
  CreateFlightInput,
  FlightFilters,
  FlightPaginationOptions,
  UpdateFlightInput,
} from "../types/flight.types.js";

const flightService = new FlightService();

export class FlightController {
  createFlight = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const input = res.locals.validated.body as CreateFlightInput;

      const flight = await flightService.createFlight(input);

      res.status(201).json({
        success: true,
        message: "Flight created successfully.",
        data: flight,
      });
    },
  );

  getFlightById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const flightId = String(req.params.id);

      const flight = await flightService.getFlightById(flightId);

      res.status(200).json({
        success: true,
        message: "Flight retrieved successfully.",
        data: flight,
      });
    },
  );

  getFlightByNumber = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const flightNumber = String(req.params.flightNumber);

      const flight = await flightService.getFlightByNumber(flightNumber);

      res.status(200).json({
        success: true,
        message: "Flight retrieved successfully.",
        data: flight,
      });
    },
  );

  listFlights = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = (res.locals.validated?.query ??
        req.query) as Record<string, unknown>;

      const filters: FlightFilters = {
        search:
          typeof query.search === "string" ? query.search : undefined,
        flightNumber:
          typeof query.flightNumber === "string"
            ? query.flightNumber
            : undefined,
        aircraft:
          typeof query.aircraft === "string"
            ? query.aircraft
            : undefined,
        departureAirport:
          typeof query.departureAirport === "string"
            ? query.departureAirport
            : undefined,
        arrivalAirport:
          typeof query.arrivalAirport === "string"
            ? query.arrivalAirport
            : undefined,
        status: query.status as FlightFilters["status"],
        departureFrom:
          query.departureFrom === undefined
            ? undefined
            : new Date(String(query.departureFrom)),
        departureTo:
          query.departureTo === undefined
            ? undefined
            : new Date(String(query.departureTo)),
        arrivalFrom:
          query.arrivalFrom === undefined
            ? undefined
            : new Date(String(query.arrivalFrom)),
        arrivalTo:
          query.arrivalTo === undefined
            ? undefined
            : new Date(String(query.arrivalTo)),
      };

      const pagination: FlightPaginationOptions = {
        page: Number(query.page ?? 1),
        limit: Number(query.limit ?? 10),
        sortBy:
          query.sortBy as FlightPaginationOptions["sortBy"],
        sortOrder:
          query.sortOrder as FlightPaginationOptions["sortOrder"],
      };

      const result = await flightService.listFlights(
        filters,
        pagination,
      );

      res.status(200).json({
        success: true,
        message: "Flights retrieved successfully.",
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  updateFlight = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const flightId = String(req.params.id);

      const input = res.locals.validated.body as UpdateFlightInput;

      const flight = await flightService.updateFlight(flightId, input);

      res.status(200).json({
        success: true,
        message: "Flight updated successfully.",
        data: flight,
      });
    },
  );

  deleteFlight = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const flightId = String(req.params.id);

      await flightService.deleteFlight(flightId);

      res.status(200).json({
        success: true,
        message: "Flight deleted successfully.",
      });
    },
  );

  countFlights = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = (res.locals.validated?.query ??
        req.query) as Record<string, unknown>;

      const filters: FlightFilters = {
        status: query.status as FlightFilters["status"],
        departureFrom:
          query.departureFrom === undefined
            ? undefined
            : new Date(String(query.departureFrom)),
        departureTo:
          query.departureTo === undefined
            ? undefined
            : new Date(String(query.departureTo)),
      };

      const total = await flightService.countFlights(filters);

      res.status(200).json({
        success: true,
        message: "Flight count retrieved successfully.",
        data: { total },
      });
    },
  );

  getFlightStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics = await flightService.getFlightStatistics();

      res.status(200).json({
        success: true,
        message: "Flight statistics retrieved successfully.",
        data: statistics,
      });
    },
  );

  getFlightRouteStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics =
        await flightService.getFlightRouteStatistics();

      res.status(200).json({
        success: true,
        message: "Flight route statistics retrieved successfully.",
        data: statistics,
      });
    },
  );
}

export const flightController = new FlightController();
