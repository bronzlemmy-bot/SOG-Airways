"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, type FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { trackingService } from "@/services/trackingService";
import type {
  FlightTrackingLookupResponse,
  FlightTrackingStatus,
  FlightTrackingUnavailableResponse,
} from "@/types";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  HelpCircle,
  Luggage,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  XCircle,
} from "lucide-react";

type FlightStatus =
  | "Scheduled"
  | "Boarding"
  | "Departed"
  | "In Flight"
  | "Landed"
  | "Delayed"
  | "Cancelled"
  | "Diverted"
  | "Unavailable";

type TrackedFlight = {
  flightNumber: string;
  route: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  terminal?: string;
  gate?: string;
  status: FlightStatus;
  progress: number;
  duration: string;
  aircraft: string;
  passenger?: string;
  estimatedArrival?: string;
  isInternational?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  trackingSource?: string;
  lastUpdated?: string;
  unavailableMessage?: string;
};

type FlightTimelineItem = {
  title: string;
  description: string;
  time: string;
  completed: boolean;
};

function displayTrackingStatus(status: FlightTrackingStatus): FlightStatus {
  const displayStatuses: Record<FlightTrackingStatus, FlightStatus> = {
    scheduled: "Scheduled",
    boarding: "Boarding",
    departed: "Departed",
    in_flight: "In Flight",
    landed: "Landed",
    delayed: "Delayed",
    cancelled: "Cancelled",
    diverted: "Diverted",
  };
  return displayStatuses[status];
}

function isUnavailableTrackingResponse(
  response: FlightTrackingLookupResponse,
): response is FlightTrackingUnavailableResponse {
  return "provider" in response && response.provider === "disabled";
}

function formatTrackingTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDuration(departure: string, arrival: string): string {
  const durationMinutes =
    (new Date(arrival).getTime() - new Date(departure).getTime()) / 60_000;

  if (!Number.isFinite(durationMinutes) || durationMinutes < 0) {
    return "Duration unavailable";
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = Math.round(durationMinutes % 60);
  return `${hours}h ${minutes}m`;
}

function TrackFlightContent() {
  const searchParams = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";
  const demoFromCode = searchParams.get("from")?.toUpperCase() || "LOS";
  const demoToCode = searchParams.get("to")?.toUpperCase() || "LHR";
  const demoDepartureTime = searchParams.get("departureTime") || "10:45";
  const demoArrivalTime = searchParams.get("arrivalTime") || "17:20";
  const demoDuration = searchParams.get("duration") || "8h 35m";
  const demoBookingReference = searchParams.get("bookingReference");
  const trackingReference = searchParams.get("trackingReference");
  const [searchValue, setSearchValue] = useState(
    searchParams.get("flight") ?? "",
  );
  const [flight, setFlight] = useState<TrackedFlight | null>(null);
  const [timeline, setTimeline] = useState<FlightTimelineItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrackFlight = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedFlightNumber = searchValue
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    if (!normalizedFlightNumber) {
      setFlight(null);
      setTimeline([]);
      setSearched(true);
      setErrorMessage("Please enter a flight number.");
      return;
    }

    setIsLoading(true);
    setSearched(false);
    setFlight(null);
    setTimeline([]);
    setErrorMessage("");

    try {
      if (demoMode) {
        const cities: Record<string, string> = {
          LOS: "Lagos",
          LHR: "London",
          DXB: "Dubai",
          JFK: "New York",
          NRT: "Tokyo",
          CDG: "Paris",
        };
        const from = cities[demoFromCode] ?? demoFromCode;
        const to = cities[demoToCode] ?? demoToCode;

        setFlight({
          flightNumber: normalizedFlightNumber,
          route: `${from} to ${to}`,
          from,
          fromCode: demoFromCode,
          to,
          toCode: demoToCode,
          departure: demoDepartureTime,
          arrival: demoArrivalTime,
          terminal: "Demo terminal",
          gate: "Demo gate",
          status: "Scheduled",
          progress: 0,
          duration: demoDuration,
          aircraft: "Simulated aircraft record",
          isInternational: true,
        });
        setTimeline([
          {
            title: "Demo tracking preview",
            description:
              "This status is generated locally for demonstration and is not live flight information.",
            time: "Demo only",
            completed: true,
          },
          {
            title: "Operational tracking unavailable",
            description:
              "Connect a verified flight-status service to show real operational updates.",
            time: "Not live",
            completed: false,
          },
        ]);
        setSearched(true);
        return;
      }

      const record: FlightTrackingLookupResponse =
        await trackingService.getFlightTracking(
        normalizedFlightNumber,
      );
      if (isUnavailableTrackingResponse(record)) {
        const snapshot = record.flight;
        const fromCode = snapshot?.departureAirport ?? "Unavailable";
        const toCode = snapshot?.arrivalAirport ?? "Unavailable";
        const scheduledDeparture = snapshot?.scheduledDeparture;

        setFlight({
          flightNumber: snapshot?.flightNumber ?? normalizedFlightNumber,
          route: `${fromCode} to ${toCode}`,
          from: fromCode,
          fromCode,
          to: toCode,
          toCode,
          departure: scheduledDeparture
            ? formatTrackingTime(scheduledDeparture)
            : "Unavailable",
          arrival: snapshot?.scheduledArrival
            ? formatTrackingTime(snapshot.scheduledArrival)
            : "Unavailable",
          status: "Unavailable",
          progress: 0,
          duration:
            snapshot?.scheduledDeparture && snapshot.scheduledArrival
              ? formatDuration(
                  snapshot.scheduledDeparture,
                  snapshot.scheduledArrival,
                )
              : "Unavailable",
          aircraft: "Aircraft details unavailable",
          latitude: null,
          longitude: null,
          trackingSource: snapshot?.source ?? record.provider,
          lastUpdated:
            snapshot?.source === "disabled"
              ? undefined
              : snapshot?.lastUpdated,
          unavailableMessage: record.message,
        });
        setTimeline([]);
      } else {
        const fromCode = record.departureAirport;
        const toCode = record.arrivalAirport;

        setFlight({
          flightNumber: record.flightNumber,
          route: `${fromCode} to ${toCode}`,
          from: fromCode,
          fromCode,
          to: toCode,
          toCode,
          departure: formatTrackingTime(record.scheduledDeparture),
          arrival: formatTrackingTime(record.scheduledArrival),
          status: displayTrackingStatus(record.status),
          progress: 0,
          duration: formatDuration(
            record.scheduledDeparture,
            record.scheduledArrival,
          ),
          aircraft: "Aircraft details unavailable",
          estimatedArrival: record.estimatedArrival
            ? formatTrackingTime(record.estimatedArrival)
            : undefined,
          latitude: record.latitude,
          longitude: record.longitude,
          trackingSource: record.source,
          lastUpdated: record.lastUpdated,
        });
        setTimeline(
          record.events.map((item) => ({
            title: displayTrackingStatus(item.status),
            description: item.description,
            time: formatTrackingTime(item.timestamp),
            completed: true,
          })),
        );
      }
      setSearched(true);
    } catch (error) {
      setFlight(null);
      setTimeline([]);
      setSearched(true);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Unable to retrieve flight information right now.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchValue("");
    setFlight(null);
    setTimeline([]);
    setSearched(false);
    setErrorMessage("");
  };

  const getStatusClasses = (status: FlightStatus) => {
    switch (status) {
      case "Landed":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";

      case "Delayed":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";

      case "Cancelled":
        return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";

      case "Diverted":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";

      case "In Flight":
      case "Departed":
      case "Boarding":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* HERO */}
      <section className="relative min-h-155 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85"
          alt="Aircraft flying above the clouds"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/35 to-slate-950/80" />

        <div className="relative z-10 mx-auto flex min-h-155 max-w-7xl items-center px-5 pb-16 pt-36 sm:px-8 lg:px-10">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                <Globe2 className="h-4 w-4 text-sky-300" />
                Flight information
              </div>

              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Track your flight
                <span className="block text-sky-300">
                  with confidence.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
                Check stored flight status and scheduled departure and arrival
                details. Live aircraft positions are shown only when recorded.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#track-flight"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5"
                >
                  Track a flight
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/manage-booking"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  Manage booking
                </Link>
              </div>
            </motion.div>

            {/* TRACKING FORM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-4xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
              id="track-flight"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20">
                  <Search className="h-5 w-5 text-sky-300" />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Find your flight
                  </p>
                  <p className="text-sm text-white/60">
                    Enter your SOG flight number
                  </p>
                </div>
              </div>

              <form onSubmit={handleTrackFlight}>
                <label
                  htmlFor="flight-number"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Flight number
                </label>

                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="flight-number"
                    type="text"
                    value={searchValue}
                    onChange={(event) =>
                      setSearchValue(event.target.value)
                    }
                    placeholder="Enter flight number"
                    autoComplete="off"
                    className="w-full rounded-2xl border border-white/15 bg-white px-12 py-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-sky-950/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Track flight
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold leading-5 text-white/55">
                  {demoMode
                    ? `Demo tracking only. No live flight service is contacted.${
                        demoBookingReference
                          ? ` Demo booking: ${demoBookingReference}.`
                          : ""
                      }`
                    : "The matching stored tracking record is retrieved from the SOG Airways backend. A live aircraft position may not be available."}
                  {!demoMode && trackingReference
                    ? ` Tracking reference: ${trackingReference}.`
                    : ""}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULT */}
      <section className="relative z-20 -mt-10 px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {searched && flight && (
              <motion.div
                key={flight.flightNumber}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30"
              >
                <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                            flight.status,
                          )}`}
                        >
                          {flight.status}
                        </span>

                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {flight.flightNumber}
                        </span>
                      </div>

                      <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        {flight.route}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {flight.aircraft} · {flight.duration}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {demoMode
                            ? "Simulated flight data"
                            : flight.trackingSource === "disabled"
                              ? "Tracking unavailable"
                              : "Stored tracking record"}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {demoMode
                            ? "Demo only · not live operational data"
                            : flight.unavailableMessage
                              ? flight.unavailableMessage
                              : flight.latitude !== null &&
                                flight.latitude !== undefined &&
                                flight.longitude !== null &&
                                flight.longitude !== undefined
                              ? `Position recorded ${flight.lastUpdated ? `at ${formatTrackingTime(flight.lastUpdated)} UTC` : "by the tracking service"} · ${flight.trackingSource ?? "source unavailable"}`
                              : "No live aircraft position is currently available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_1.4fr_1fr]">
                  {/* DEPARTURE */}
                  <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8 lg:border-b-0 lg:border-r">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Departure
                    </p>

                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40">
                        <PlaneTakeoff className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>

                      <div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                          {flight.departure}
                        </p>

                        <p className="mt-1 font-bold text-slate-700 dark:text-slate-200">
                          {flight.fromCode}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {flight.from}
                        </p>
                        {!demoMode && (
                          <p className="mt-1 text-xs text-slate-400">
                            Scheduled time · UTC
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                      {flight.terminal && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {flight.terminal}
                        </p>
                      )}

                      {flight.gate && (
                        <p className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          {flight.gate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8 lg:border-b-0 lg:border-r">
                    {demoMode ? (
                      <>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span>Simulated journey progress</span>
                          <span>{flight.progress}%</span>
                        </div>

                        <div className="relative mt-8">
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  Math.max(flight.progress, 0),
                                  100,
                                )}%`,
                              }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full rounded-full bg-sky-500"
                            />
                          </div>

                          <div className="absolute -top-3 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg">
                            <PlaneTakeoff className="h-4 w-4" />
                          </div>

                          <div className="absolute -top-3 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                            <PlaneLanding className="h-4 w-4" />
                          </div>
                        </div>

                        <div className="mt-10 flex items-center justify-between">
                          <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {flight.fromCode}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {flight.from}
                            </p>
                          </div>

                          <div className="flex flex-1 items-center justify-center px-4">
                            <div className="flex w-full items-center">
                              <div className="h-px flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" />
                              <Plane className="mx-3 h-5 w-5 rotate-90 text-sky-500" />
                              <div className="h-px flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {flight.toCode}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {flight.to}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : flight.latitude !== null &&
                      flight.latitude !== undefined &&
                      flight.longitude !== null &&
                      flight.longitude !== undefined ? (
                      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Recorded aircraft coordinates
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Latitude {flight.latitude}, longitude {flight.longitude}
                        </p>
                        {flight.lastUpdated && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Last updated {formatTrackingTime(flight.lastUpdated)} UTC
                          </p>
                        )}
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          Source: {flight.trackingSource ?? "unavailable"}. Coordinates are the last saved record, not a guaranteed live position.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
                        <p className="font-bold text-amber-950 dark:text-amber-200">
                          Live aircraft position unavailable
                        </p>
                        <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-300">
                          The saved flight status and schedule are shown above.
                          No aircraft coordinates are available from the tracking
                          provider.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ARRIVAL */}
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Arrival
                    </p>

                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
                        <PlaneLanding className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>

                      <div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                          {flight.arrival}
                        </p>

                        <p className="mt-1 font-bold text-slate-700 dark:text-slate-200">
                          {flight.toCode}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {flight.to}
                        </p>
                        {!demoMode && (
                          <p className="mt-1 text-xs text-slate-400">
                            Scheduled time · UTC
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {flight.estimatedArrival
                          ? `Estimated arrival ${flight.estimatedArrival}`
                          : "Arrival information"}
                      </p>

                      <p className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4" />
                        {flight.isInternational
                          ? "International route"
                          : "Flight route"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {searched && !flight && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-4xl border border-red-100 bg-white p-8 shadow-2xl shadow-slate-900/10 transition-colors duration-300 dark:border-red-950/60 dark:bg-slate-900 dark:shadow-black/30"
              >
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
                    <XCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
                    Flight information unavailable
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {errorMessage ||
                      "We couldn't find a flight matching your search. Check the flight number and try again."}
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      Try again
                    </button>

                    <Link
                      href="/contact"
                      className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Contact support
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* TIMELINE */}
      {flight && timeline.length > 0 && (
        <section className="px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  <Sparkles className="h-4 w-4" />
                  Journey updates
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Follow every stage of your journey.
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-slate-500 dark:text-slate-400">
                  Stay informed from check-in through arrival with clear
                  flight information and journey milestones.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <Clock3 className="h-6 w-6 text-sky-600 dark:text-sky-400" />

                    <p className="mt-4 font-bold text-slate-900 dark:text-white">
                      Timely updates
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Check important departure and arrival information
                      before you travel.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />

                    <p className="mt-4 font-bold text-slate-900 dark:text-white">
                      Travel with confidence
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Keep your journey details accessible whenever you need
                      them.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Journey timeline
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {flight.flightNumber}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                      flight.status,
                    )}`}
                  >
                    {flight.status}
                  </span>
                </div>

                <div className="mt-8">
                  {timeline.map((item, index) => (
                    <div
                      key={`${item.title}-${item.time}-${index}`}
                      className="relative flex gap-5"
                    >
                      {index !== timeline.length - 1 && (
                        <div
                          className={`absolute left-4 top-9 h-[calc(100%-1rem)] w-px ${
                            item.completed
                              ? "bg-sky-300 dark:bg-sky-700"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          item.completed
                            ? "bg-sky-500 text-white"
                            : "border-2 border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600"
                        }`}
                      >
                        {item.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        )}
                      </div>

                      <div className="flex flex-1 justify-between gap-4 pb-9">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-slate-400">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* TRAVEL TOOLS */}
      <section className="bg-white px-5 py-24 transition-colors duration-300 dark:bg-slate-900 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Travel tools
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Everything you need for your journey.
            </h2>

            <p className="mt-5 leading-7 text-slate-500 dark:text-slate-400">
              Prepare for your flight, manage your booking and get help when
              you need it.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: UserRound,
                title: "Manage booking",
                description: "Review or manage your existing reservation.",
                href: "/manage-booking",
              },
              {
                icon: Ticket,
                title: "Check-in",
                description: "Get ready for your flight before arriving.",
                href: "/check-in",
              },
              {
                icon: Luggage,
                title: "Baggage",
                description: "Review allowances and baggage information.",
                href: "/baggage",
              },
              {
                icon: HelpCircle,
                title: "Travel help",
                description: "Find answers to common travel questions.",
                href: "/faq",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="group block h-full rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-900 dark:hover:bg-slate-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-6 font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-sm font-bold text-sky-600 dark:text-sky-400">
                      Explore
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-5 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-slate-950 px-6 py-16 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-sky-300">
                <Plane className="h-4 w-4" />
                Your journey starts here
              </div>

              <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ready for your next adventure?
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-white/60">
                Search flights, explore destinations and plan your next trip
                with SOG Airways.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/flights"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
              >
                Search flights
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function TrackFlightPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950" />
      }
    >
      <TrackFlightContent />
    </Suspense>
  );
}