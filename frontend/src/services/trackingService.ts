import { apiService } from "./api";

import type { FlightTrackingLookupResponse } from "@/types";

export const trackingService = {
  async getFlightTracking(
    flightNumber: string,
  ): Promise<FlightTrackingLookupResponse> {
    return apiService.get<FlightTrackingLookupResponse>(
      `/tracking/flight/${encodeURIComponent(flightNumber)}`,
    );
  },
};
