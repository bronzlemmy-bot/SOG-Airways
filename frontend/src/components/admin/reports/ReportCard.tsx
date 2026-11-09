"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  Plane,
  Users,
  Wallet,
} from "lucide-react";

import ReportActions from "./ReportActions";
import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  getReportStatusLabel,
  getReportTypeLabel,
  type AdminReportRecord,
} from "./admin-reports-data/ReportsData";

interface ReportCardProps {
  reports: AdminReportRecord[];
  onView: (report: AdminReportRecord) => void;
  onExport: (report: AdminReportRecord) => void;
}

export default function ReportCard({
  reports,
  onView,
  onExport,
}: ReportCardProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <CalendarDays className="h-7 w-7 text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No reports found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your report filters or search terms to find the
          report you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <motion.article
          key={report.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: index * 0.04,
            ease: "easeOut",
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                    {getReportTypeLabel(report.reportType)}
                  </span>

                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {getReportStatusLabel(report.status)}
                  </span>
                </div>

                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {report.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                  {report.description}
                </p>
              </div>

              <ReportActions
                report={report}
                onView={onView}
                onExport={onExport}
              />
            </div>

            {report.route && (
              <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {report.route}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    Date
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatReportDate(report.date)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    Passengers
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatReportNumber(report.passengers)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Plane className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    Flights
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatReportNumber(report.flights)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    Payments
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatReportNumber(report.payments)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Revenue
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatReportCurrency(report.revenue, report.currency)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Bookings
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {formatReportNumber(report.bookings)}
                </p>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}