"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  formatReportDate,
  formatReportNumber,
  type PaymentReportItem,
} from "./admin-reports-data/ReportsData";

interface PaymentReportProps {
  data: PaymentReportItem[];
}

export default function PaymentReport({ data }: PaymentReportProps) {
  const totals = data.reduce(
    (accumulator, item) => ({
      total: accumulator.total + item.total,
      completed: accumulator.completed + item.completed,
      pending: accumulator.pending + item.pending,
      failed: accumulator.failed + item.failed,
      refunded: accumulator.refunded + item.refunded,
    }),
    {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    },
  );

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Payment Report
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Payment activity and transaction status across the report period.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950/30">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Total Payments
          </p>

          <p className="mt-0.5 text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {formatReportNumber(totals.total)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PaymentMetric
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Completed"
          value={totals.completed}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        />

        <PaymentMetric
          icon={<Clock3 className="h-4 w-4" />}
          label="Pending"
          value={totals.pending}
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
        />

        <PaymentMetric
          icon={<XCircle className="h-4 w-4" />}
          label="Failed"
          value={totals.failed}
          iconClass="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
        />

        <PaymentMetric
          icon={<RotateCcw className="h-4 w-4" />}
          label="Refunded"
          value={totals.refunded}
          iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-180">
          <div className="grid grid-cols-[1.2fr_repeat(5,minmax(90px,1fr))] gap-3 border-b border-slate-200 px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800">
            <span>Date</span>
            <span className="text-right">Total</span>
            <span className="text-right">Completed</span>
            <span className="text-right">Pending</span>
            <span className="text-right">Failed</span>
            <span className="text-right">Refunded</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                className="grid grid-cols-[1.2fr_repeat(5,minmax(90px,1fr))] items-center gap-3 px-3 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />

                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatReportDate(item.date)}
                  </span>
                </div>

                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  {formatReportNumber(item.total)}
                </span>

                <span className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {formatReportNumber(item.completed)}
                </span>

                <span className="text-right font-medium text-amber-600 dark:text-amber-400">
                  {formatReportNumber(item.pending)}
                </span>

                <span className="text-right font-medium text-rose-600 dark:text-rose-400">
                  {formatReportNumber(item.failed)}
                </span>

                <span className="text-right font-medium text-violet-600 dark:text-violet-400">
                  {formatReportNumber(item.refunded)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface PaymentMetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconClass: string;
}

function PaymentMetric({
  icon,
  label,
  value,
  iconClass,
}: PaymentMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
          {formatReportNumber(value)}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <CreditCard className="mx-auto h-8 w-8 text-slate-400" />

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        No payment report data is available.
      </p>
    </div>
  );
}