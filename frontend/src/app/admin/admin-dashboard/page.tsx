"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import BookingActivity from "@/components/admin/dashboard/BookingActivity";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import RecentBookings from "@/components/admin/dashboard/RecentBookings";
import RevenueOverview from "@/components/admin/dashboard/RevenueOverview";
import UpcomingFilter from "@/components/admin/dashboard/UpcomingFilter";

import {
adminDashboardData,
type UpcomingFilterOption,
} from "@/components/admin/dashboard/admin-dashboard-data/AdminDashboardData";

export default function AdminDashboardPage() {
const [selectedFilter, setSelectedFilter] =
useState<UpcomingFilterOption["value"]>(
adminDashboardData.selectedUpcomingFilter,
);

const filteredUpcomingFlights = useMemo(() => {
const flights = adminDashboardData.upcomingFlights;


if (selectedFilter === "today") {
  return flights.slice(0, 2);
}

if (selectedFilter === "tomorrow") {
  return flights.slice(2, 4);
}

return flights;


}, [selectedFilter]);

return ( <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl space-y-6">
{/* Header */}
<motion.div
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
> <DashboardHeader />
</motion.div>


    {/* Statistics */}
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.05,
      }}
    >
      <DashboardStats stats={adminDashboardData.stats} />
    </motion.div>

    {/* Revenue + Activity */}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: 0.1,
        }}
      >
        <RevenueOverview
          revenue={adminDashboardData.revenueOverview}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: 0.15,
        }}
      >
        <BookingActivity
          activities={adminDashboardData.bookingActivity}
        />
      </motion.div>
    </div>

    {/* Recent Bookings */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.2,
      }}
    >
      <RecentBookings
        bookings={adminDashboardData.recentBookings}
      />
    </motion.div>

    {/* Upcoming Flights */}
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.25,
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <UpcomingFilter
          filters={adminDashboardData.upcomingFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </div>

      {filteredUpcomingFlights.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No upcoming flights
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              There are no flights available for this filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredUpcomingFlights.map((flight) => (
            <UpcomingFlightRow
              key={flight.id}
              flight={flight}
            />
          ))}
        </div>
      )}
    </motion.section>
  </div>
</main>


);
}

interface UpcomingFlightRowProps {
flight: (typeof adminDashboardData.upcomingFlights)[number];
}

function UpcomingFlightRow({
flight,
}: UpcomingFlightRowProps) {
const occupancy =
flight.totalSeats > 0
? Math.round(
(flight.bookedSeats / flight.totalSeats) * 100,
)
: 0;

const statusStyles = getFlightStatusStyles(
flight.status,
);

return ( <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
{/* Flight information */} <div className="min-w-0 flex-1"> <div className="flex flex-wrap items-center gap-2"> <span className="text-sm font-extrabold text-slate-950 dark:text-white">
{flight.flightNumber} </span>


      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles}`}
      >
        {flight.status}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {flight.departureAirport}
      </span>

      <span className="text-slate-400">→</span>

      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {flight.arrivalAirport}
      </span>

      <span className="text-slate-400">
        {flight.route}
      </span>
    </div>

    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      {formatDate(flight.departureDate)} ·{" "}
      {flight.departureTime} – {flight.arrivalTime}
    </p>

    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {flight.aircraft}
    </p>
  </div>

  {/* Capacity */}
  <div className="w-full lg:max-w-xs">
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Seat occupancy
      </span>

      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
        {flight.bookedSeats}/{flight.totalSeats}
      </span>
    </div>

    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${occupancy}%` }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="h-full rounded-full bg-sky-500"
      />
    </div>

    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
      <span>{occupancy}% booked</span>

      <span>
        {flight.availableSeats} seats available
      </span>
    </div>
  </div>
</div>


);
}

function getFlightStatusStyles(
status: "boarding" | "scheduled" | "delayed",
): string {
if (status === "boarding") {
return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
}

if (status === "delayed") {
return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
}

function formatDate(value: string): string {
const date = new Date(`${value}T00:00:00`);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en-NG", {
day: "numeric",
month: "short",
year: "numeric",
}).format(date);
}
