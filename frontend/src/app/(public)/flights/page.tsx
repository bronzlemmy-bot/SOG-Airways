"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Luggage,
  Plane,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { airportService } from "@/services/airportService";
import { flightService } from "@/services/flightService";
import type {
  CheckoutAirport,
  CheckoutCabinClass,
  CheckoutFlight,
} from "@/types";

type TripType = "Round trip" | "One way" | "Multi-city";
type SortOption =
  | "Recommended"
  | "Lowest price"
  | "Highest price"
  | "Shortest duration";

type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  departure: string;
  arrival: string;
  departureDate: string;
  duration: string;
  stops: number;
  stopLabel: string;
  price: number;
  currency: string;
  cabin: string;
  baggage: string;
  recommended?: boolean;
};

const popularRoutes = [
  {
    from: "Lagos",
    fromCode: "LOS",
    to: "London",
    toCode: "LHR",
  },
  {
    from: "Lagos",
    fromCode: "LOS",
    to: "Dubai",
    toCode: "DXB",
  },
  {
    from: "Lagos",
    fromCode: "LOS",
    to: "New York",
    toCode: "JFK",
  },
  {
    from: "Lagos",
    fromCode: "LOS",
    to: "Cape Town",
    toCode: "CPT",
  },
];

const cabinOptions = ["Economy", "Premium Economy", "Business", "First"];

function getCheckoutCabin(cabin: string): CheckoutCabinClass {
  switch (cabin) {
    case "Premium Economy":
      return "premium_economy";
    case "Business":
      return "business";
    case "First":
      return "first";
    default:
      return "economy";
  }
}

function formatAirportTime(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(value));
}

function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function formatFare(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function FlightsPage() {
  const [tripType, setTripType] = useState<TripType>("One way");
  const [from, setFrom] = useState("Lagos (LOS)");
  const [to, setTo] = useState("London (LHR)");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState("Economy");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [nonstopOnly, setNonstopOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [backendFlights, setBackendFlights] = useState<CheckoutFlight[]>([]);
  const [airports, setAirports] = useState<CheckoutAirport[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [flightLoadError, setFlightLoadError] = useState("");
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      flightService.getCheckoutFlights(),
      airportService.getCheckoutAirports(),
    ])
      .then(([nextFlights, nextAirports]) => {
        if (!active) return;
        setBackendFlights(nextFlights);
        setAirports(nextAirports);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setFlightLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load current flights.",
        );
      })
      .finally(() => {
        if (active) setLoadingFlights(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();

    const intervalId = window.setInterval(updateCurrentTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredFlights = useMemo(() => {
    const cabinKey = getCheckoutCabin(cabin);
    const results = backendFlights.flatMap((record) => {
      const fare = record.fareSchedule?.[cabinKey];
      const departureAirport = airports.find(
        (airport) => airport.id === record.departureAirport,
      );
      const arrivalAirport = airports.find(
        (airport) => airport.id === record.arrivalAirport,
      );
      if (
        !fare ||
        !departureAirport ||
        !arrivalAirport ||
        !["scheduled", "delayed"].includes(record.status) ||
        currentTime === null ||
        new Date(record.scheduledDeparture).getTime() <= currentTime
      ) {
        return [];
      }

      const scheduledDate = new Date(record.scheduledDeparture)
        .toISOString()
        .slice(0, 10);
      if (departureDate && scheduledDate !== departureDate) return [];

      const price = fare.baseFare + fare.taxes + fare.fees;
      const flight: Flight = {
        id: record.id,
        airline: "SOG Airways",
        flightNumber: record.flightNumber,
        from: departureAirport.airportCode,
        fromCity: departureAirport.city,
        to: arrivalAirport.airportCode,
        toCity: arrivalAirport.city,
        departure: formatAirportTime(
          record.scheduledDeparture,
          departureAirport.timezone,
        ),
        arrival: formatAirportTime(
          record.scheduledArrival,
          arrivalAirport.timezone,
        ),
        departureDate: new Date(record.scheduledDeparture)
          .toISOString()
          .slice(0, 10),
        duration: formatDurationMinutes(record.durationMinutes),
        stops: 0,
        stopLabel: "Single flight",
        price,
        currency: fare.currency,
        cabin,
        baggage: "Baggage details provided by the airline",
      };

      const priceMatch = flight.price <= maxPrice;
      const nonstopMatch = !nonstopOnly || flight.stops === 0;

      const fromMatch =
        from.toLowerCase().includes(flight.fromCity.toLowerCase()) ||
        from.toLowerCase().includes(flight.from.toLowerCase());

      const toMatch =
        to.toLowerCase().includes(flight.toCity.toLowerCase()) ||
        to.toLowerCase().includes(flight.to.toLowerCase());

      return priceMatch && nonstopMatch && fromMatch && toMatch
        ? [flight]
        : [];
    });

    return [...results].sort((a, b) => {
      if (sortBy === "Lowest price") {
        return a.price - b.price;
      }

      if (sortBy === "Highest price") {
        return b.price - a.price;
      }

      if (sortBy === "Shortest duration") {
        return parseDuration(a.duration) - parseDuration(b.duration);
      }

      return Number(Boolean(b.recommended)) - Number(Boolean(a.recommended));
    });
  }, [
    airports,
    backendFlights,
    cabin,
    currentTime,
    departureDate,
    from,
    maxPrice,
    nonstopOnly,
    sortBy,
    to,
  ]);

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  const bookingQuery = new URLSearchParams({
    from,
    to,
    trip: tripType,
    departure: departureDate,
    passengers: String(passengers),
    cabin,
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_85%_70%,rgba(37,99,235,0.22),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-36 pt-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200 backdrop-blur">
              <Globe2 className="h-4 w-4" />
              Fly around the world
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your next{" "}
              <span className="text-sky-400">flight.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Search destinations, compare flight options, and discover
              journeys designed to take you farther.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-10 max-w-6xl rounded-4xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
          >
            {/* Trip Type */}
            <div className="flex flex-wrap gap-2">
              {(["Round trip", "One way", "Multi-city"] as TripType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    disabled={type !== "One way"}
                    title={
                      type !== "One way"
                        ? "Only single-flight bookings are currently supported."
                        : undefined
                    }
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      tripType === type
                        ? "bg-white text-slate-950"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>

            {/* Main Search */}
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_1fr_1fr]">
              <SearchField
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Departure airport"
              />

              <button
                type="button"
                onClick={swapLocations}
                aria-label="Swap departure and destination"
                className="hidden h-14 w-14 self-end items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 lg:flex"
              >
                ⇄
              </button>

              <SearchField
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Arrival airport"
              />

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Departure
                </span>

                <div className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4">
                  <CalendarDays className="h-5 w-5 shrink-0 text-sky-600" />

                  <input
                    type="date"
                    value={departureDate}
                    onChange={(event) => setDepartureDate(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
              </label>

              <div className="hidden lg:block" />
            </div>

            {/* Bottom Controls */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <PassengerSelector
                passengers={passengers}
                onChange={setPassengers}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Cabin
                </span>

                <div className="relative">
                  <select
                    value={cabin}
                    onChange={(event) => setCabin(event.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl bg-white px-4 pr-10 text-sm font-semibold text-slate-900 outline-none"
                  >
                    {cabinOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </label>

              <div className="hidden sm:block" />

              <Link
                href="#flight-results"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-7 text-sm font-bold text-white transition hover:bg-sky-400"
              >
                <Search className="h-5 w-5" />
                Search flights
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Area */}
      <section
        id="flight-results"
        className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <p
          role="note"
          className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        >
          Flight schedules and fares shown here come from the airline&apos;s
          configured availability. Final availability and pricing are confirmed
          by the booking service.
        </p>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside
            className={`h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>

              <button
                type="button"
                onClick={() => {
                  setMaxPrice(1200);
                  setNonstopOnly(false);
                }}
                className="text-xs font-bold text-sky-600 hover:text-sky-500"
              >
                Reset
              </button>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Maximum price</p>

                <span className="text-sm font-bold text-sky-600">
                  ${maxPrice}
                </span>
              </div>

              <input
                type="range"
                min="300"
                max="1200"
                step="10"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="mt-4 w-full accent-sky-600"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>$300</span>
                <span>$1,200+</span>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">Nonstop flights</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Show direct flights only
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={nonstopOnly}
                  onChange={(event) => setNonstopOnly(event.target.checked)}
                  className="h-5 w-5 rounded accent-sky-600"
                />
              </label>
            </div>

            <div className="mt-7 rounded-2xl bg-sky-50 p-4 dark:bg-sky-950/40">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />

                <div>
                  <p className="text-sm font-bold text-sky-900 dark:text-sky-200">
                    Flexible travel?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-sky-700 dark:text-sky-300">
                    Adjust your dates to discover more flight options and
                    prices.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-bold text-sky-600">
                    Available flights
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {from.split(" (")[0]} to {to.split(" (")[0]}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {loadingFlights
                      ? "Loading available flights…"
                      : `${filteredFlights.length} flight${filteredFlights.length === 1 ? "" : "s"} found`}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowFilters((current) => !current)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as SortOption)
                      }
                      className="h-12 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <option>Recommended</option>
                      <option>Lowest price</option>
                      <option>Highest price</option>
                      <option>Shortest duration</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {flightLoadError ? (
              <p
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
              >
                {flightLoadError}
              </p>
            ) : loadingFlights ? (
              <p
                role="status"
                className="mt-5 rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900"
              >
                Loading backend flight availability and fares…
              </p>
            ) : filteredFlights.length > 0 ? (
              <div className="mt-5 space-y-4">
                {filteredFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    index={index}
                    bookingQuery={bookingQuery.toString()}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Plane className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No bookable flights found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Try changing your route, date, cabin, or maximum price.
                  Only flights and fares configured by SOG Airways are shown.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setMaxPrice(1200);
                    setNonstopOnly(false);
                  }}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                Popular routes
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Where are travelers going?
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                Explore some of the most popular routes from our network.
              </p>
            </div>

            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-500"
            >
              Explore destinations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularRoutes.map((route) => (
              <Link
                key={`${route.fromCode}-${route.toCode}`}
                href="/flights#flight-results"
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <Plane className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400">
                      Popular route
                    </p>

                    <p className="mt-1 font-bold">
                      {route.fromCode} → {route.toCode}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold">{route.from}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      to {route.to}
                    </p>
                  </div>

                  <p className="text-right text-xs text-slate-500">
                    Search live fares
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-sky-600">
                  Book route
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Fly with SOG
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              More than just a flight
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Designed around making every part of your journey simpler.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <BenefitCard
              icon={<Globe2 className="h-6 w-6" />}
              title="Global destinations"
              description="Connect with major cities and exciting destinations across the world."
            />

            <BenefitCard
              icon={<Luggage className="h-6 w-6" />}
              title="Baggage included"
              description="Selected fares include checked baggage so you can travel with confidence."
            />

            <BenefitCard
              icon={<Clock3 className="h-6 w-6" />}
              title="Simple travel"
              description="Search, compare, book, and manage your journey through one seamless experience."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-4xl bg-sky-600 p-8 sm:p-10 lg:p-14"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-950/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-sky-100">
                  Your journey starts here
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Ready to find your next flight?
                </h2>

                <p className="mt-4 leading-7 text-sky-100">
                  Search destinations, compare options, and book your next
                  journey with SOG Airways.
                </p>
              </div>

              <Link
                href="/destinations"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Explore destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function SearchField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
        {label}
      </span>

      <div className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4">
        <Plane className="h-5 w-5 shrink-0 text-sky-600" />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}

function PassengerSelector({
  passengers,
  onChange,
}: {
  passengers: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
        Passengers
      </span>

      <div className="flex h-14 items-center justify-between rounded-2xl bg-white px-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-sky-600" />

          <select
            aria-label="Passenger count"
            value={passengers}
            onChange={(event) => onChange(Number(event.target.value))}
            className="bg-transparent text-sm font-semibold text-slate-900 outline-none"
          >
            {Array.from({ length: 9 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>

      </div>
      <p className="mt-1 text-xs text-slate-400">
        Up to 9 passengers per booking.
      </p>
    </div>
  );
}

function FlightCard({
  flight,
  index,
  bookingQuery,
}: {
  flight: Flight;
  index: number;
  bookingQuery: string;
}) {
  const selectedFlightQuery = new URLSearchParams(bookingQuery);
  selectedFlightQuery.set("flight", flight.id);
  selectedFlightQuery.set("flightId", flight.id);
  selectedFlightQuery.set("flightNumber", flight.flightNumber);
  selectedFlightQuery.set("from", flight.from);
  selectedFlightQuery.set("to", flight.to);
  selectedFlightQuery.set("departureTime", flight.departure);
  selectedFlightQuery.set("arrivalTime", flight.arrival);
  selectedFlightQuery.set("duration", flight.duration);
  selectedFlightQuery.set("departure", new Date(
    `${flight.departureDate}T00:00:00`,
  ).toISOString().slice(0, 10));

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.3),
      }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:shadow-black/30"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Airline */}
          <div className="flex items-center gap-3 lg:w-40">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
              <Plane className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold">{flight.airline}</p>

              <p className="mt-1 text-xs text-slate-400">
                {flight.flightNumber}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">{flight.departure}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {flight.from}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center px-4">
                <p className="text-xs font-semibold text-slate-400">
                  {flight.duration}
                </p>

                <div className="relative mt-2 flex w-full items-center">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

                  <div className="mx-2 flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <Plane className="h-3.5 w-3.5 rotate-90" />
                  </div>

                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                <p
                  className={`mt-2 text-xs font-bold ${
                    flight.stops === 0
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {flight.stopLabel}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">{flight.arrival}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {flight.to}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-slate-200 pt-5 lg:w-44 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-slate-800">
            <p className="text-xs text-slate-400">{flight.cabin} fare</p>

            <p className="mt-1 text-3xl font-bold">
              {formatFare(flight.price, flight.currency)}
            </p>

            <p className="mt-1 text-xs text-slate-400">per passenger</p>

            <Link
              href={`/booking?${selectedFlightQuery.toString()}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-400"
            >
              Select flight
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" />
            {flight.baggage}
          </span>

          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-400" />
            Flexible booking
          </span>

          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-500" />
            {flight.cabin}
          </span>
        </div>
      </div>

      {flight.recommended && (
        <div className="flex items-center gap-2 bg-sky-50 px-5 py-2.5 text-xs font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
          <Sparkles className="h-3.5 w-3.5" />
          Recommended flight
        </div>
      )}
    </motion.article>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}

function parseDuration(duration: string) {
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  return hours * 60 + minutes;
}