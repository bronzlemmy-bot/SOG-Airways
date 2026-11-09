"use client";

import { motion } from "framer-motion";
import {
BriefcaseBusiness,
ChevronRight,
Luggage,
Plus,
Scale,
} from "lucide-react";

import type { ManageTripBaggage } from "./manage-trip-data/ManageTripData";

interface BaggageManagmentProps {
baggage: ManageTripBaggage;
onManageBaggage?: () => void;
}

export default function BaggageManagment({
baggage,
onManageBaggage,
}: BaggageManagmentProps) {
return (
<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, delay: 0.15 }}
className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
Baggage </p>


        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Manage your baggage
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <Luggage className="h-5 w-5" />
      </div>
    </div>
  </div>

  <div className="p-5 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-3">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Checked Bags
        </p>

        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          {baggage.checkedBags}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bags included in your booking
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Scale className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Checked Weight
        </p>

        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          {baggage.totalWeight}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Total checked baggage allowance
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Luggage className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Carry-On
        </p>

        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          {baggage.carryOn}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Cabin baggage allowance
        </p>
      </motion.div>
    </div>

    <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          Need additional baggage?
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add extra baggage to your trip before your departure.
        </p>
      </div>

      <button
        type="button"
        onClick={onManageBaggage}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Manage Baggage
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
</motion.section>


);
}
