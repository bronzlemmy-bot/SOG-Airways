"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CheckCircle2,
Plane,
TicketCheck,
} from "lucide-react";

interface TripConfarmationProps {
bookingReference: string;
title: string;
description: string;
onDone?: () => void;
onViewTrip?: () => void;
}

export default function TripConfarmation({
bookingReference,
title,
description,
onDone,
onViewTrip,
}: TripConfarmationProps) {
return (
<motion.div
initial={{ opacity: 0, y: 24, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.3 }}
className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="relative overflow-hidden bg-slate-950 px-6 py-10 text-center text-white sm:px-8"> <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

    <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-white/5" />

    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl"
    >
      <CheckCircle2 className="h-10 w-10" />
    </motion.div>

    <div className="relative mt-6">
      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <TicketCheck className="h-4 w-4" />
        SOG Airways
      </div>

      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">
        {description}
      </p>
    </div>
  </div>

  <div className="space-y-6 p-6 sm:p-8">
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          <Plane className="h-5 w-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Booking reference
          </p>

          <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
            {bookingReference}
          </p>
        </div>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onViewTrip}
        className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        View Trip

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <button
        type="button"
        onClick={onDone}
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Done
      </button>
    </div>
  </div>
</motion.div>


);
}
