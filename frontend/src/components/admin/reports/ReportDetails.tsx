"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  Plane,
  Route,
  Users,
  Wallet,
  X,
} from "lucide-react";

import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  getReportStatusLabel,
  getReportTypeLabel,
  type AdminReportRecord,
} from "./admin-reports-data/ReportsData";

interface ReportDetailsProps {
  report: AdminReportRecord;
  onClose?: () => void;
}

export default function ReportDetails({
  report,
  onClose,
}: ReportDetailsProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 via-white to-sky-50 p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {getReportTypeLabel(report.reportType)}
                </span>

                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {getReportStatusLabel(report.status)}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {report.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {report.description}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close report details"
              title="Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Report Date"
            value={formatReportDate(report.date)}
          />

          <SummaryItem
            icon={<Users className="h-4 w-4" />}
            label="Passengers"
            value={formatReportNumber(report.passengers)}
          />

          <SummaryItem
            icon={<Plane className="h-4 w-4" />}
            label="Flights"
            value={formatReportNumber(report.flights)}
          />

          <SummaryItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Payments"
            value={formatReportNumber(report.payments)}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:p-5">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Revenue
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatReportCurrency(report.revenue, report.currency)}
          </p>
        </div>

        {report.route && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Route
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                <Route className="h-5 w-5" />
              </div>

              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {report.route}
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <DetailItem
            label="Report ID"
            value={report.id}
          />

          <DetailItem
            label="Report Type"
            value={getReportTypeLabel(report.reportType)}
          />

          <DetailItem
            label="Bookings"
            value={formatReportNumber(report.bookings)}
          />

          <DetailItem
            label="Currency"
            value={report.currency}
          />

          {report.paymentMethod && (
            <DetailItem
              label="Payment Method"
              value={report.paymentMethod}
            />
          )}

          <DetailItem
            label="Status"
            value={getReportStatusLabel(report.status)}
          />
        </div>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string | number;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}