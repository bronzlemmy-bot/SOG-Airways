"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

interface StaffHeaderProps {
  totalStaff: number;
  activeStaff: number;
  onAddStaff: () => void;
}

export default function StaffHeader({
  totalStaff,
  activeStaff,
  onAddStaff,
}: StaffHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-7 shadow-xl sm:px-7 lg:px-8 lg:py-8"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administration
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Staff Management
              </h1>

              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Manage your SOG Airways team, roles, access, and staff status.
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Staff summary */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-blue-200" />

                <span className="text-xs font-medium text-slate-300">
                  Total Staff
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-white">
                {totalStaff}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-slate-300">
                  Active
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-white">
                {activeStaff}
              </p>
            </div>
          </div>

          {/* Add Staff */}
          <motion.button
            type="button"
            onClick={onAddStaff}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Plus className="h-4 w-4" />
            Add Staff
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}