"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  Users,
  WalletCards,
} from "lucide-react";

const dashboardStats = [
  {
    title: "Total Bookings",
    value: "2,847",
    change: "+12.5%",
    description: "Compared with last month",
    icon: CalendarDays,
    href: "/admin/bookings",
  },
  {
    title: "Passengers",
    value: "8,492",
    change: "+8.2%",
    description: "Registered passengers",
    icon: Users,
    href: "/admin/passengers",
  },
  {
    title: "Revenue",
    value: "₦48.6M",
    change: "+15.8%",
    description: "This month's revenue",
    icon: WalletCards,
    href: "/admin/payments",
  },
  {
    title: "Active Flights",
    value: "64",
    change: "+4.3%",
    description: "Flights currently scheduled",
    icon: Plane,
    href: "/admin/flights",
  },
];

const recentBookings = [
  {
    id: "SOG-48291",
    passenger: "Adebayo Johnson",
    route: "Lagos → London",
    date: "Sep 30, 2026",
    amount: "₦1,245,000",
    status: "Confirmed",
  },
  {
    id: "SOG-48290",
    passenger: "Sarah Williams",
    route: "Abuja → Dubai",
    date: "Sep 30, 2026",
    amount: "₦986,500",
    status: "Confirmed",
  },
  {
    id: "SOG-48289",
    passenger: "Chinedu Okafor",
    route: "Lagos → Accra",
    date: "Sep 29, 2026",
    amount: "₦425,000",
    status: "Pending",
  },
  {
    id: "SOG-48288",
    passenger: "Fatima Bello",
    route: "Port Harcourt → Lagos",
    date: "Sep 29, 2026",
    amount: "₦185,000",
    status: "Confirmed",
  },
  {
    id: "SOG-48287",
    passenger: "Michael Adekunle",
    route: "Lagos → Johannesburg",
    date: "Sep 28, 2026",
    amount: "₦765,000",
    status: "Cancelled",
  },
];

const upcomingFlights = [
  {
    flight: "SOG 101",
    route: "Lagos → London",
    departure: "08:30",
    gate: "A12",
    passengers: 186,
    status: "Boarding",
  },
  {
    flight: "SOG 204",
    route: "Abuja → Dubai",
    departure: "11:45",
    gate: "B07",
    passengers: 214,
    status: "Scheduled",
  },
  {
    flight: "SOG 315",
    route: "Lagos → Accra",
    departure: "14:20",
    gate: "A08",
    passengers: 142,
    status: "Scheduled",
  },
  {
    flight: "SOG 422",
    route: "Port Harcourt → Lagos",
    departure: "17:10",
    gate: "C03",
    passengers: 128,
    status: "Scheduled",
  },
];

const activityData = [
  { day: "Mon", bookings: 42 },
  { day: "Tue", bookings: 58 },
  { day: "Wed", bookings: 51 },
  { day: "Thu", bookings: 73 },
  { day: "Fri", bookings: 66 },
  { day: "Sat", bookings: 84 },
  { day: "Sun", bookings: 69 },
];

const quickActions = [
  {
    title: "Manage Bookings",
    description: "View and manage passenger bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    title: "Manage Flights",
    description: "Create and manage scheduled flights",
    href: "/admin/flights",
    icon: Plane,
  },
  {
    title: "View Passengers",
    description: "Review passenger information",
    href: "/admin/passengers",
    icon: Users,
  },
  {
    title: "View Reports",
    description: "Analyze airline performance",
    href: "/admin/Reports",
    icon: BarChart3,
  },
];

const statusStyles: Record<string, string> = {
  Confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  Boarding:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Scheduled:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function AdminDashboardPage() {
  const maxBookings = Math.max(
    ...activityData.map((item) => item.bookings),
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 p-6 text-white shadow-xl sm:p-8"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-sky-100 backdrop-blur">
                <Plane className="h-4 w-4" />
                SOG Airways Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back, Administrator
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Monitor bookings, flights, passengers, payments, and airline
                operations from one central dashboard.
              </p>
            </div>

            <Link
              href="/admin/Reports"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              View Reports
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={stat.href}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-sky-500" />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </h2>

                      <span className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {stat.change}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </section>

        {/* Activity + Operational Summary */}
        <section className="grid gap-6 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Booking Activity
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Bookings received over the last seven days
                </p>
              </div>

              <Link
                href="/admin/bookings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                View bookings
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex h-64 items-end justify-between gap-2 sm:gap-4">
              {activityData.map((item) => {
                const height = Math.max(
                  12,
                  (item.bookings / maxBookings) * 100,
                );

                return (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex w-full flex-1 items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-12 rounded-t-xl bg-linear-to-t from-sky-600 to-cyan-400"
                        title={`${item.bookings} bookings`}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Operational Summary
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current airline activity
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Flights Today
                  </span>
                  <Plane className="h-4 w-4 text-sky-500" />
                </div>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  24
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Passengers Today
                  </span>
                  <Users className="h-4 w-4 text-sky-500" />
                </div>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  3,842
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    On-Time Rate
                  </span>
                  <Clock3 className="h-4 w-4 text-emerald-500" />
                </div>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  94.6%
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quickly access the main administration areas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={action.href}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-sky-500" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Bookings
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Latest booking activity across SOG Airways.
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-190">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-950/40">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Booking
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Passenger
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Route
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/bookings?booking=${booking.id}`}
                        className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                      >
                        {booking.id}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {booking.passenger}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {booking.route}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {booking.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {booking.amount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Upcoming Flights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Flights
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Today&apos;s scheduled departures.
              </p>
            </div>

            <Link
              href="/admin/flights"
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              Manage flights
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {upcomingFlights.map((flight) => (
              <div
                key={flight.flight}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <Plane className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {flight.flight}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {flight.route}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[flight.status]}`}
                  >
                    {flight.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Departure</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {flight.departure}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Gate</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {flight.gate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Passengers</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {flight.passengers}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* System Status */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Flight Operations
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
                Operating normally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Payment Processing
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
                Processing normally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Booking System
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
                Operating normally
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}