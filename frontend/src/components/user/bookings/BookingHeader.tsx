
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Plane,
  Search,
} from "lucide-react";

export default function BookingHeader() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Decorative Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-slate-900/40" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Your Travel
            </motion.div>

            {/* Heading */}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Manage Your Bookings
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              View your upcoming journeys, check your booking
              details, manage your trips, and keep everything
              you need for your travels in one place.
            </p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              {/* Book Flight */}
              <Link
                href="/flights"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Plane className="h-4 w-4" />

                <span>Book a Flight</span>

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Find Flight */}
              <Link
                href="/flights"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Search className="h-4 w-4" />
                Find a Flight
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="hidden lg:block"
          >
            <div className="relative w-64 overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Plane className="h-6 w-6" />
              </div>

              <p className="mt-5 text-sm font-medium text-white/70">
                Your journeys
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                All in one place
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Booking management
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
