
import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";

import { trackingService } from "../services/tracking.service.js";

import type {
  CreateFlightTrackingInput,
  TrackingFlightLookup,
  TrackingListQuery,
  UpdateFlightPositionInput,
  UpdateFlightTrackingStatusInput,
} from "../types/tracking.types.js";

type ValidatedRequest = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

function getValidatedData<T>(res: Response): T {
  const validated = res.locals.validated as
    | ValidatedRequest
    | undefined;

  if (!validated) {
    throw new ApiError(
      "Validated request data is missing.",
      500,
    );
  }

  return validated as T;
}

export class TrackingController {
  createTracking = asyncHandler(
    async (_req: Request, res: Response) => {
      const { body } =
        getValidatedData<{ body: CreateFlightTrackingInput }>(res);

      const tracking = await trackingService.createTracking(body);

      res.status(201).json({
        success: true,
        message: "Flight tracking record created successfully.",
        data: tracking,
      });
    },
  );

  getTracking = asyncHandler(
    async (_req: Request, res: Response) => {
      const { params } =
        getValidatedData<{ params: TrackingFlightLookup }>(res);

      const tracking = await trackingService.getTracking(params);

      res.status(200).json({
        success: true,
        data: tracking,
      });
    },
  );

  updatePosition = asyncHandler(
    async (_req: Request, res: Response) => {
      const { params, body } = getValidatedData<{
        params: { flightId: string };
        body: UpdateFlightPositionInput;
      }>(res);

      const tracking = await trackingService.updatePosition(
        params.flightId,
        body,
      );

      res.status(200).json({
        success: true,
        message: "Flight position updated successfully.",
        data: tracking,
      });
    },
  );

  updateStatus = asyncHandler(
    async (_req: Request, res: Response) => {
      const { params, body } = getValidatedData<{
        params: { flightId: string };
        body: UpdateFlightTrackingStatusInput;
      }>(res);

      const tracking = await trackingService.updateStatus(
        params.flightId,
        body,
      );

      res.status(200).json({
        success: true,
        message: "Flight tracking status updated successfully.",
        data: tracking,
      });
    },
  );

  listTracking = asyncHandler(
    async (_req: Request, res: Response) => {
      const { query } =
        getValidatedData<{ query: TrackingListQuery }>(res);

      const result = await trackingService.listTracking(query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  getTrackingHistory = asyncHandler(
    async (_req: Request, res: Response) => {
      const { params } =
        getValidatedData<{ params: { flightId: string } }>(res);

      const history = await trackingService.getTrackingHistory(
        params.flightId,
      );

      res.status(200).json({
        success: true,
        data: {
          flightId: history.flightId,
          flightNumber: history.flightNumber,
          currentPosition: {
            latitude: history.latitude,
            longitude: history.longitude,
            altitude: history.altitude,
            speed: history.speed,
            heading: history.heading,
            recordedAt: history.recordedAt,
            source: history.source,
          },
          status: history.status,
          events: history.events,
          lastUpdated: history.lastUpdated,
        },
      });
    },
  );

  deleteTracking = asyncHandler(
    async (_req: Request, res: Response) => {
      const { params } =
        getValidatedData<{ params: { flightId: string } }>(res);

      await trackingService.deleteTracking(params.flightId);

      res.status(200).json({
        success: true,
        message: "Flight tracking record deleted successfully.",
      });
    },
  );
}

export const trackingController = new TrackingController();
