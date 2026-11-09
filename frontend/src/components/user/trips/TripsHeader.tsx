"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
MapPin,
Plane,
Ticket,
} from "lucide-react";

interface TripHeaderProps {
totalTrips: number;
upcomingTrips: number;
completedTrips: number;
}

export default function TripHeader({
totalTrips,
upcomingTrips,
completedTrips,
}: TripHeaderProps) {
return (
<motion.header
initial={{ opacity: 0, y: -16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-slate-100/80 blur-3xl dark:bg-slate-800/60" />


  <div className="absolute -bottom-28 -left-20 h-52 w-52 rounded-full bg-slate-100/70 blur-3xl dark:bg-slate-800/50" />

  <div className="relative px-5 py-7 sm:px-7 sm:py-8 lg:px-9">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Plane className="h-3.5 w-3.5" />
          Your Travel
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
          My Trips
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          View and manage your upcoming journeys, previous trips,
          bookings, and travel details in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-107.5">
        <TripStat
          icon={<Ticket className="h-4 w-4" />}
          label="Total Trips"
          value={totalTrips}
        />

        <TripStat
          icon={<CalendarDays className="h-4 w-4" />}
          label="Upcoming"
          value={upcomingTrips}
        />

        <TripStat
          icon={<MapPin className="h-4 w-4" />}
          label="Completed"
          value={completedTrips}
        />
      </div>
    </div>
  </div>
</motion.header>


);
}

interface TripStatProps {
icon: React.ReactNode;
label: string;
value: number;
}

function TripStat({
icon,
label,
value,
}: TripStatProps) {
return (
<motion.div
whileHover={{ y: -2 }}
transition={{ duration: 0.2 }}
className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
> <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400"> <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
{icon} </span>


    <span className="text-xs font-medium">
      {label}
    </span>
  </div>

  <p className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
    {value}
  </p>
</motion.div>


);
}
