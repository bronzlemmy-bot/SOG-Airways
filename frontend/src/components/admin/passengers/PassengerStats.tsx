"use client";

import { motion } from "framer-motion";
import {
Activity,
Ban,
Clock3,
UserCheck,
Users,
} from "lucide-react";

import type { AdminPassenger } from "./admin-passengers-data/AdminPassengersData";

interface PassengerStatsProps {
passengers: AdminPassenger[];
}

interface StatCard {
label: string;
value: number;
description: string;
icon: typeof Users;
iconClassName: string;
iconBackground: string;
}

export default function PassengerStats({
passengers,
}: PassengerStatsProps) {
const totalPassengers = passengers.length;

const activePassengers = passengers.filter(
(passenger) => passenger.status === "active",
).length;

const pendingPassengers = passengers.filter(
(passenger) => passenger.status === "pending",
).length;

const suspendedPassengers = passengers.filter(
(passenger) => passenger.status === "suspended",
).length;

const totalBookings = passengers.reduce(
(total, passenger) => total + passenger.totalBookings,
0,
);

const stats: StatCard[] = [
{
label: "Total Passengers",
value: totalPassengers,
description: "Registered passenger accounts",
icon: Users,
iconClassName: "text-sky-600 dark:text-sky-400",
iconBackground: "bg-sky-500/10",
},
{
label: "Active Passengers",
value: activePassengers,
description: "Currently active accounts",
icon: UserCheck,
iconClassName: "text-emerald-600 dark:text-emerald-400",
iconBackground: "bg-emerald-500/10",
},
{
label: "Pending",
value: pendingPassengers,
description: "Accounts awaiting review",
icon: Clock3,
iconClassName: "text-amber-600 dark:text-amber-400",
iconBackground: "bg-amber-500/10",
},
{
label: "Suspended",
value: suspendedPassengers,
description: "Currently restricted accounts",
icon: Ban,
iconClassName: "text-red-600 dark:text-red-400",
iconBackground: "bg-red-500/10",
},
{
label: "Total Bookings",
value: totalBookings,
description: "Bookings across all passengers",
icon: Activity,
iconClassName: "text-violet-600 dark:text-violet-400",
iconBackground: "bg-violet-500/10",
},
];

return ( <section
   aria-label="Passenger statistics"
   className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
 >
{stats.map((stat, index) => {
const Icon = stat.icon;


    return (
      <motion.article
        key={stat.label}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.06,
        }}
        whileHover={{ y: -2 }}
        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-500/5 blur-2xl transition-transform duration-300 group-hover:scale-125" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBackground}`}
            >
              <Icon className={`h-5 w-5 ${stat.iconClassName}`} />
            </div>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              SOG Airways
            </span>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stat.value.toLocaleString()}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
              {stat.description}
            </p>
          </div>
        </div>
      </motion.article>
    );
  })}
</section>


);
}
