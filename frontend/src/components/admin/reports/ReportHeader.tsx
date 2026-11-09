"use client";

import { BarChart3, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";

import ReportExport from "./ReportExport";
import type { AdminReportRecord } from "./admin-reports-data/ReportsData";

interface ReportHeaderProps {
  totalReports: number;
  reports: AdminReportRecord[];
}

export default function ReportHeader({
  totalReports,
  reports,
}: ReportHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-sky-950 p-6 shadow-xl dark:border-slate-800 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-300 ring-1 ring-white/10">
            <BarChart3 className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Reports
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 ring-1 ring-white/10">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                {totalReports}{" "}
                {totalReports === 1 ? "Report" : "Reports"}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Review SOG Airways performance across revenue, bookings,
              passengers, flights, and payments.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <ReportExport
            reports={reports}
            label="Export Reports"
          />
        </div>
      </div>
    </motion.section>
  );
}