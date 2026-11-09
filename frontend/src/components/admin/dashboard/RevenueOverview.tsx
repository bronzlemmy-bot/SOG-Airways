"use client";

import { motion } from "framer-motion";
import {
ArrowDownRight,
ArrowUpRight,
BarChart3,
CalendarDays,
TrendingUp,
} from "lucide-react";

import type { RevenuePoint } from "./admin-dashboard-data/AdminDashboardData";

interface RevenueOverviewProps {
revenue: RevenuePoint[];
}

export default function RevenueOverview({
revenue,
}: RevenueOverviewProps) {
const totalRevenue = revenue.reduce(
(total, item) => total + item.revenue,
0,
);

const totalBookings = revenue.reduce(
(total, item) => total + item.bookings,
0,
);

const averageRevenue =
revenue.length > 0 ? totalRevenue / revenue.length : 0;

const currentPeriod =
revenue.length > 0 ? revenue[revenue.length - 1] : null;

const previousPeriod =
revenue.length > 1 ? revenue[revenue.length - 2] : null;

const revenueChange =
currentPeriod && previousPeriod && previousPeriod.revenue > 0
? ((currentPeriod.revenue - previousPeriod.revenue) /
previousPeriod.revenue) *
100
: 0;

const maxRevenue = Math.max(
...revenue.map((item) => item.revenue),
1,
);

return ( <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
{/* Header */} <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800"> <div> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <BarChart3 className="h-4 w-4" /> </div>


        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
            Revenue Overview
          </h2>

          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Revenue and booking performance over time.
          </p>
        </div>
      </div>
    </div>

    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
      <CalendarDays className="h-4 w-4" />
      <span>Last 6 periods</span>
    </div>
  </div>

  {revenue.length === 0 ? (
    <EmptyRevenueState />
  ) : (
    <div className="p-5 sm:p-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <RevenueSummaryCard
          label="Total Revenue"
          value={formatNaira(totalRevenue)}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <RevenueSummaryCard
          label="Total Bookings"
          value={totalBookings.toLocaleString("en-NG")}
          icon={<BarChart3 className="h-4 w-4" />}
        />

        <RevenueSummaryCard
          label="Average Period Revenue"
          value={formatNaira(averageRevenue)}
          icon={<CalendarDays className="h-4 w-4" />}
        />
      </div>

      {/* Current Period */}
      {currentPeriod && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/30">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Latest Period
            </p>

            <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              {currentPeriod.period}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Revenue
              </p>

              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatNaira(currentPeriod.revenue)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bookings
              </p>

              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {currentPeriod.bookings.toLocaleString("en-NG")}
              </p>
            </div>

            <RevenueChange value={revenueChange} />
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue Trend
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Revenue generated during each reporting period.
            </p>
          </div>

          <span className="hidden text-xs font-medium text-slate-400 sm:block">
            NGN
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-160">
            {/* Chart Area */}
            <div className="relative h-72">
              {/* Horizontal guide lines */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-slate-200 dark:border-slate-800"
                  />
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around gap-3 px-3 pb-8 pt-4">
                {revenue.map((item, index) => {
                  const heightPercentage =
                    (item.revenue / maxRevenue) * 100;

                  return (
                    <div
                      key={item.id}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="mb-2 text-center">
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs">
                          {formatCompactNaira(item.revenue)}
                        </p>
                      </div>

                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: `${Math.max(
                            heightPercentage,
                            4,
                          )}%`,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.65,
                          delay: index * 0.08,
                          ease: "easeOut",
                        }}
                        className="group relative w-full max-w-14 rounded-t-xl bg-sky-500/90 transition-colors hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
                      >
                        <div className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-600 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-sky-300" />

                        <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block dark:bg-white dark:text-slate-900">
                          {formatNaira(item.revenue)}
                          <span className="ml-2 text-slate-300 dark:text-slate-500">
                            {item.bookings.toLocaleString("en-NG")} bookings
                          </span>
                        </div>
                      </motion.div>

                      <p className="mt-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs">
                        {item.period}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Performance */}
      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Booking Performance
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Number of bookings recorded for each period.
          </p>
        </div>

        <div className="space-y-4">
          {revenue.map((item, index) => {
            const maxBookings = Math.max(
              ...revenue.map((point) => point.bookings),
              1,
            );

            const width =
              (item.bookings / maxBookings) * 100;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.period}
                  </span>

                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.bookings.toLocaleString("en-NG")}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-sky-500"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  )}
</section>


);
}

interface RevenueSummaryCardProps {
label: string;
value: string;
icon: React.ReactNode;
}

function RevenueSummaryCard({
label,
value,
icon,
}: RevenueSummaryCardProps) {
return ( <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/30"> <div className="flex items-center gap-2 text-slate-400">
{icon}


    <span className="text-xs font-semibold uppercase tracking-wider">
      {label}
    </span>
  </div>

  <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
    {value}
  </p>
</div>


);
}

function RevenueChange({
value,
}: {
value: number;
}) {
if (value > 0) {
return ( <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"> <ArrowUpRight className="h-3.5 w-3.5" />
{value.toFixed(1)}% </span>
);
}

if (value < 0) {
return ( <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300"> <ArrowDownRight className="h-3.5 w-3.5" />
{Math.abs(value).toFixed(1)}% </span>
);
}

return ( <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
0.0% </span>
);
}

function EmptyRevenueState() {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="flex flex-col items-center justify-center px-6 py-14 text-center"
> <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"> <BarChart3 className="h-5 w-5" /> </div>


  <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
    No revenue data
  </h3>

  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
    Revenue performance will appear here once reporting data is available.
  </p>
</motion.div>


);
}

function formatNaira(value: number): string {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}).format(value);
}

function formatCompactNaira(value: number): string {
if (value >= 1_000_000_000) {
return `₦${(value / 1_000_000_000).toFixed(1)}B`;
}

if (value >= 1_000_000) {
return `₦${(value / 1_000_000).toFixed(1)}M`;
}

if (value >= 1_000) {
return `₦${(value / 1_000).toFixed(1)}K`;
}

return `₦${value.toLocaleString("en-NG")}`;
}
