"use client";

import { motion } from "framer-motion";
import {
Bell,
CalendarCheck,
CheckCircle2,
CreditCard,
Plane,
UserCheck,
XCircle,
} from "lucide-react";

import type {
BookingActivityItem,
} from "./admin-dashboard-data/AdminDashboardData";

interface BookingActivityProps {
activities: BookingActivityItem[];
}

export default function BookingActivity({
activities,
}: BookingActivityProps) {
return ( <section
   aria-label="Booking activity"
   className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
 > <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6"> <div> <div className="flex items-center gap-2"> <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
Booking Activity </h2>


        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="h-2 w-2 rounded-full bg-emerald-500"
          aria-hidden="true"
        />
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Recent activity across your airline operations.
      </p>
    </div>

    <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 sm:flex">
      <Bell className="h-4 w-4" />
      Latest updates
    </div>
  </div>

  {activities.length > 0 ? (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {activities.map((activity, index) => (
        <ActivityRow
          key={activity.id}
          activity={activity}
          index={index}
        />
      ))}
    </div>
  ) : (
    <EmptyActivityState />
  )}
</section>


);
}

interface ActivityRowProps {
activity: BookingActivityItem;
index: number;
}

function ActivityRow({
activity,
index,
}: ActivityRowProps) {
const config = getActivityConfig(activity.type);
const Icon = config.icon;

return (
<motion.article
initial={{ opacity: 0, x: -12 }}
animate={{ opacity: 1, x: 0 }}
transition={{
duration: 0.35,
delay: index * 0.06,
}}
className="group px-5 py-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 sm:px-6"
> <div className="flex gap-3.5">
<div
className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
> <Icon className="h-4 w-4" /> </div>


    <div className="min-w-0 flex-1">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {activity.title}
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
            >
              {config.label}
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {activity.description}
          </p>

          {(activity.customerName ||
            activity.bookingReference) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              {activity.customerName && (
                <span>{activity.customerName}</span>
              )}

              {activity.bookingReference && (
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {activity.bookingReference}
                </span>
              )}
            </div>
          )}
        </div>

        <time className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
          {activity.time}
        </time>
      </div>
    </div>
  </div>
</motion.article>


);
}

function getActivityConfig(type: BookingActivityItem["type"]) {
switch (type) {
case "booking":
return {
icon: CalendarCheck,
label: "Booking",
className:
"bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
};


case "payment":
  return {
    icon: CreditCard,
    label: "Payment",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };

case "check-in":
  return {
    icon: UserCheck,
    label: "Check-in",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  };

case "cancellation":
  return {
    icon: XCircle,
    label: "Cancellation",
    className:
      "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  };

case "flight":
  return {
    icon: Plane,
    label: "Flight",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  };

default:
  return {
    icon: Bell,
    label: "Activity",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };


}
}

function EmptyActivityState() {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="flex flex-col items-center justify-center px-6 py-12 text-center"
> <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"> <Bell className="h-5 w-5" /> </div>


  <div className="mt-4 flex items-center gap-2">
    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
      No recent activity
    </p>
  </div>

  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
    New booking and operational activity will appear here.
  </p>
</motion.div>


);
}
