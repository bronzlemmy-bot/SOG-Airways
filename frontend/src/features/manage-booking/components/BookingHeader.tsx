"use client";

import OutlineButton from "@/components/buttons/OutlineButton";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Headphones,
  Plane,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";


interface BookingHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  className?: string;
}

export default function BookingHeader({
  title = "Manage your booking",
  description = "Your journey, your way. Retrieve your reservation to review your flight details, check your booking status, and explore the options available for your trip.",
  showBackButton = true,
  backHref = "/",
  className = "",
}: BookingHeaderProps) {
  const router = useRouter();

  return (
    <section
      className={`relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 text-white ${className}`}
      aria-labelledby="manage-booking-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:px-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {showBackButton && (
            <OutlineButton
              type="button"
              onClick={() => router.push(backHref)}
              className="mb-7 border-white/30 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </OutlineButton>
          )}

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
            <TicketCheck className="h-4 w-4" />
            Your trip at a glance
          </div>

          <h1
            id="manage-booking-heading"
            className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Secure booking lookup
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Plane className="h-4 w-4 text-sky-300" />
              Flight information
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
                  SOG Airways
                </p>
                <p className="mt-2 text-xl font-bold">Ready for takeoff?</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-sky-200">
                <Plane className="h-6 w-6 -rotate-12" />
              </div>
            </div>

            <div className="my-6 border-t border-dashed border-white/20" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <TicketCheck className="h-4 w-4 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Find your reservation</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Use your booking reference and passenger surname.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Headphones className="h-4 w-4 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Need assistance?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Contact our support team if you need help with your trip.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-2 -top-3 h-6 w-6 rounded-full border-4 border-slate-900 bg-sky-400"
          />
        </motion.div>
      </div>
    </section>
  );
}
