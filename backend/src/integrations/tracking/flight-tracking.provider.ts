export type FlightTrackingStatus =
  | "scheduled"
  | "delayed"
  | "in_air"
  | "landed"
  | "cancelled"
  | "unknown"
  | "unavailable";

export interface FlightTrackingQuery {
  airlineCode?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: Date | string;
  scheduledArrival?: Date | string;
}

export interface FlightTrackingSnapshot {
  airlineCode?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: Date;
  scheduledArrival?: Date;
  status: FlightTrackingStatus;
  lastUpdated: Date;
  source: "disabled" | "external";
  message?: string;
}

export interface FlightTrackingResponse {
  success: boolean;
  provider: "disabled";
  status: "unavailable";
  message: string;
  flight?: FlightTrackingSnapshot;
}

export interface FlightTrackingProvider {
  readonly isEnabled: boolean;
  getFlightStatus(
    query: FlightTrackingQuery,
  ): Promise<FlightTrackingResponse>;
}

export class DisabledFlightTrackingProvider
  implements FlightTrackingProvider
{
  readonly isEnabled = false;

  async getFlightStatus(
    query: FlightTrackingQuery,
  ): Promise<FlightTrackingResponse> {
    return {
      success: false,
      provider: "disabled",
      status: "unavailable",
      message:
        `No external flight tracking provider is configured for ${query.flightNumber ?? "the requested flight"}.`,
      flight: {
        airlineCode: query.airlineCode,
        flightNumber: query.flightNumber,
        departureAirport: query.departureAirport,
        arrivalAirport: query.arrivalAirport,
        scheduledDeparture:
          query.scheduledDeparture !== undefined
            ? new Date(query.scheduledDeparture)
            : undefined,
        scheduledArrival:
          query.scheduledArrival !== undefined
            ? new Date(query.scheduledArrival)
            : undefined,
        status: "unavailable",
        lastUpdated: new Date(),
        source: "disabled",
        message:
          "Flight tracking is disabled until a provider is configured.",
      },
    };
  }
}

export const flightTrackingProvider: FlightTrackingProvider =
  new DisabledFlightTrackingProvider();

export default flightTrackingProvider;
