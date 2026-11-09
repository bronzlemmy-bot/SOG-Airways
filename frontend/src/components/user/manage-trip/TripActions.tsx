"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarClock,
ChevronRight,
FileText,
Luggage,
Plane,
UserRound,
} from "lucide-react";
import Link from "next/link";

interface TripActionProps {
onChangeFlight?: () => void;
onChangePassenger?: () => void;
onChangeSeat?: () => void;
onManageBaggage?: () => void;
}

const actions = [
{
key: "flight",
label: "Change Flight",
description: "Update your travel date or flight option.",
icon: Plane,
},
{
key: "passenger",
label: "Change Passenger",
description: "Update passenger information for this trip.",
icon: UserRound,
},
{
key: "seat",
label: "Change Seat",
description: "Choose a different available seat.",
icon: CalendarClock,
},
{
key: "baggage",
label: "Manage Baggage",
description: "Review or add baggage to your booking.",
icon: Luggage,
},
];

export default function TripAction({
onChangeFlight,
onChangePassenger,
onChangeSeat,
onManageBaggage,
}: TripActionProps) {
const callbacks: Record<string, (() => void) | undefined> = {
flight: onChangeFlight,
passenger: onChangePassenger,
seat: onChangeSeat,
baggage: onManageBaggage,
};

return (
<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, delay: 0.2 }}
className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6"> <div> <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
Trip Actions </p>


      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Manage your booking
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        Make changes to your trip before departure. Some changes may
        require additional fees.
      </p>
    </div>
  </div>

  <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
    {actions.map((action, index) => {
      const Icon = action.icon;
      const callback = callbacks[action.key];

      return (
        <motion.button
          key={action.key}
          type="button"
          onClick={callback}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.25 + index * 0.05,
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-slate-900">
            <Icon className="h-5 w-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-bold text-slate-900 dark:text-white">
              {action.label}
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
              {action.description}
            </span>
          </span>

          <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
        </motion.button>
      );
    })}
  </div>

  <div className="border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/users/booking-details/SOG-BOOKING-001"
        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <FileText className="h-4 w-4" />
        Booking Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href="/users/bookings"
        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Back to Bookings
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
</motion.section>


);
}
