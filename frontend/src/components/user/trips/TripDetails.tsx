"use client";

import { motion } from "framer-motion";
import {
ArrowDown,
ArrowRight,
CalendarDays,
Clock3,
Luggage,
MapPin,
Plane,
Users,
} from "lucide-react";
import type { Trip } from "./trips-data/TripsData";
import TripAction from "./TripActions";
import TripStatusBadge from "./TripStatusBadge";

interface TripDetailsProps {
trip: Trip;
onBack: () => void;
onManageBooking: () => void;
onCheckIn: () => void;
onTrackFlight: () => void;
}

function formatDate(date: string) {
const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
}

function formatPrice(price: number, currency: string) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(price);
}

export default function TripDetails({
trip,
onBack,
onManageBooking,
onCheckIn,
onTrackFlight,
}: TripDetailsProps) {
return (
<motion.section
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="space-y-5"
>
{/* Header */} <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-7"> <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"> <div className="flex items-start gap-3">
<motion.button
type="button"
whileHover={{ x: -2 }}
whileTap={{ scale: 0.97 }}
onClick={onBack}
aria-label="Back to trips"
className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
> <ArrowRight className="h-4 w-4 rotate-180" />
</motion.button>

```
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Trip Details
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {trip.bookingReference}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {trip.tripType} · {trip.cabinClass}
          </p>
        </div>
      </div>

      <TripStatusBadge status={trip.status} />
    </div>
  </div>

  {/* Outbound flight */}
  <FlightSection
    title="Outbound Flight"
    flight={trip.outbound}
    accent="departure"
  />

  {/* Return flight */}
  {trip.return && (
    <FlightSection
      title="Return Flight"
      flight={trip.return}
      accent="return"
    />
  )}

  {/* Trip information */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <InfoCard
      icon={<Users className="h-5 w-5" />}
      label="Passengers"
      value={String(trip.passengers)}
    />

    <InfoCard
      icon={<Luggage className="h-5 w-5" />}
      label="Baggage"
      value={trip.baggage}
    />

    <InfoCard
      icon={<Plane className="h-5 w-5" />}
      label="Seat"
      value={trip.seat}
    />

    <InfoCard
      icon={<CalendarDays className="h-5 w-5" />}
      label="Booked"
      value={formatDate(trip.createdAt)}
    />
  </div>

  {/* Fare */}
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Trip Fare
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          {formatPrice(trip.price, trip.currency)}
        </p>
      </div>

      <div className="text-left sm:text-right">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Booking reference
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {trip.bookingReference}
        </p>
      </div>
    </div>
  </div>

  {/* Actions */}
  <TripAction
    trip={trip}
    onViewDetails={() => undefined}
    onManageBooking={onManageBooking}
    onCheckIn={onCheckIn}
    onTrackFlight={onTrackFlight}
  />
</motion.section>


);
}

interface FlightSectionProps {
title: string;
flight: Trip["outbound"];
accent: "departure" | "return";
}

function FlightSection({
title,
flight,
accent,
}: FlightSectionProps) {
return ( <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6"> <div> <h2 className="text-base font-bold text-slate-950 dark:text-white">
{title} </h2> <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
{flight.flightNumber} </p> </div>

```
    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {flight.duration}
    </span>
  </div>

  <div className="p-5 sm:p-6">
    <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
      <AirportDetails
        label="Departure"
        airport={flight.departureAirport}
        city={flight.departureCity}
        country={flight.departureCountry}
        date={flight.departureDate}
        time={flight.departureTime}
      />

      <div className="flex items-center justify-center md:flex-col md:gap-2">
        <div className="hidden h-px w-full bg-slate-200 dark:bg-slate-700 md:block md:w-24" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Plane
            className={`h-5 w-5 ${
              accent === "return" ? "-rotate-90" : "rotate-90"
            }`}
          />
        </div>

        <div className="hidden h-px w-full bg-slate-200 dark:bg-slate-700 md:block md:w-24" />

        <ArrowDown className="h-4 w-4 text-slate-400 md:hidden" />
      </div>

      <AirportDetails
        label="Arrival"
        airport={flight.arrivalAirport}
        city={flight.arrivalCity}
        country={flight.arrivalCountry}
        date={flight.arrivalDate}
        time={flight.arrivalTime}
        align="right"
      />
    </div>
  </div>
</div>


);
}

interface AirportDetailsProps {
label: string;
airport: string;
city: string;
country: string;
date: string;
time: string;
align?: "left" | "right";
}

function AirportDetails({
label,
airport,
city,
country,
date,
time,
align = "left",
}: AirportDetailsProps) {
const isRight = align === "right";

return (
<div className={isRight ? "md:text-right" : ""}>
<div
className={`flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 ${
          isRight ? "md:justify-end" : ""
        }`}
> <MapPin className="h-3.5 w-3.5" />
{label} </div>


  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
    {airport}
  </p>

  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
    {city}, {country}
  </p>

  <div
    className={`mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 ${
      isRight ? "md:justify-end" : ""
    }`}
  >
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays className="h-3.5 w-3.5" />
      {formatDate(date)}
    </span>

    <span className="inline-flex items-center gap-1.5">
      <Clock3 className="h-3.5 w-3.5" />
      {time}
    </span>
  </div>
</div>


);
}

interface InfoCardProps {
icon: React.ReactNode;
label: string;
value: string;
}

function InfoCard({
icon,
label,
value,
}: InfoCardProps) {
return ( <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
{icon} </div>


  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
    {label}
  </p>

  <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
    {value}
  </p>
</div>


);
}
