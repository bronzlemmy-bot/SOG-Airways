
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react";

import { dashboardUser } from "./dashboard-data/DashboardDta";

const DashboardHero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10 lg:py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-8 top-8 hidden opacity-10 sm:block"
        >
          <Plane className="h-40 w-40 rotate-12 lg:h-52 lg:w-52" />
        </motion.div>
      </div>

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            {dashboardUser.membership}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Welcome back,{" "}
            <span className="text-sky-300">{dashboardUser.firstName}</span>
            !
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Your next adventure is waiting. Manage your journeys, check your
            upcoming flights, and discover where your travels can take you
            next.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-xl"
            >
              <Plane className="h-4 w-4" />
              Book a Flight
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/users/manage-trips"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15"
            >
              <CalendarDays className="h-4 w-4" />
              Manage Trips
            </Link>
          </div>
        </motion.div>

        {/* Membership card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-sm lg:w-80"
        >
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Membership
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {dashboardUser.membershipLevel}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Travel status</p>
                <p className="truncate text-sm font-medium text-white">
                  Ready for your next journey
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardHero;
