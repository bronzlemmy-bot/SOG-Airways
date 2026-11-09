"use client";

import { FileText } from "lucide-react";
import { motion } from "framer-motion";

import ReportActions from "./ReportActions";
import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  getReportStatusLabel,
  getReportTypeLabel,
  type AdminReportRecord,
} from "./admin-reports-data/ReportsData";

interface ReportTableProps {
  reports: AdminReportRecord[];
  onView: (report: AdminReportRecord) => void;
  onExport: (report: AdminReportRecord) => void;
}

export default function ReportTable({
  reports,
  onView,
  onExport,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <FileText className="h-7 w-7 text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No reports found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          No reports match the current filters. Try changing your search or
          filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-287.5 w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Report
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Type
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Date
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Bookings
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Passengers
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Flights
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Payments
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Revenue
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Status
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="max-w-60 px-4 py-4">
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold text-slate-900 dark:text-white"
                      title={report.title}
                    >
                      {report.title}
                    </p>

                    <p
                      className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400"
                      title={report.description}
                    >
                      {report.description}
                    </p>

                    {report.route && (
                      <p className="mt-1 truncate text-xs font-medium text-sky-600 dark:text-sky-400">
                        {report.route}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex whitespace-nowrap rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                    {getReportTypeLabel(report.reportType)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {formatReportDate(report.date)}
                </td>

                <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  {formatReportNumber(report.bookings)}
                </td>

                <td className="px-4 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formatReportNumber(report.passengers)}
                </td>

                <td className="px-4 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formatReportNumber(report.flights)}
                </td>

                <td className="px-4 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formatReportNumber(report.payments)}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatReportCurrency(report.revenue, report.currency)}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={report.status} />
                </td>

                <td className="px-4 py-4">
                  <ReportActions
                    report={report}
                    onView={onView}
                    onExport={onExport}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {reports.length}
          </span>{" "}
          {reports.length === 1 ? "report" : "reports"}
        </p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: AdminReportRecord["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<AdminReportRecord["status"], string> = {
    completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    cancelled:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    failed:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    refunded:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {getReportStatusLabel(status)}
    </span>
  );
}