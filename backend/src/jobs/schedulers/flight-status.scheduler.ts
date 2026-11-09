import {
  flightTrackingProvider,
  type FlightTrackingProvider,
} from "../../integrations/tracking/flight-tracking.provider.js";

export interface FlightStatusSchedulerConfig {
  enabled: boolean;
  intervalMinutes: number;
}

export interface FlightStatusSchedulerStatus {
  enabled: boolean;
  configured: boolean;
  operational: false;
  intervalMinutes: number;
  scheduleEngineAvailable: false;
  flightStatusQueueAvailable: false;
  trackingProviderAvailable: boolean;
  reason: string;
}

export interface FlightStatusSchedulerRunResult {
  status: "disabled" | "unavailable";
  reason: string;
}

export interface FlightStatusScheduler {
  getStatus(): FlightStatusSchedulerStatus;
  runOnce(): Promise<FlightStatusSchedulerRunResult>;
}

export const DEFAULT_FLIGHT_STATUS_SCHEDULER_CONFIG: Readonly<FlightStatusSchedulerConfig> =
  Object.freeze({
    enabled: false,
    intervalMinutes: 15,
  });

export class DisabledFlightStatusScheduler
  implements FlightStatusScheduler
{
  constructor(
    private readonly config: FlightStatusSchedulerConfig =
      DEFAULT_FLIGHT_STATUS_SCHEDULER_CONFIG,
    private readonly provider: FlightTrackingProvider =
      flightTrackingProvider,
  ) {
    if (
      !Number.isInteger(config.intervalMinutes) ||
      config.intervalMinutes < 1
    ) {
      throw new RangeError(
        "Flight status scheduler intervalMinutes must be a positive integer.",
      );
    }
  }

  getStatus(): FlightStatusSchedulerStatus {
    const blockers = [
      "No scheduling engine is configured.",
      "No supported queue exists for flight-status check jobs.",
      ...(!this.provider.isEnabled
        ? ["No external flight-tracking provider is configured."]
        : []),
    ];

    return {
      enabled: this.config.enabled,
      configured: false,
      operational: false,
      intervalMinutes: this.config.intervalMinutes,
      scheduleEngineAvailable: false,
      flightStatusQueueAvailable: false,
      trackingProviderAvailable: this.provider.isEnabled,
      reason: blockers.join(" "),
    };
  }

  async runOnce(): Promise<FlightStatusSchedulerRunResult> {
    const status = this.getStatus();

    if (!status.enabled) {
      return {
        status: "disabled",
        reason: "Flight-status scheduling is disabled.",
      };
    }

    return {
      status: "unavailable",
      reason: status.reason,
    };
  }
}

export const flightStatusScheduler: FlightStatusScheduler =
  new DisabledFlightStatusScheduler();

export default flightStatusScheduler;
