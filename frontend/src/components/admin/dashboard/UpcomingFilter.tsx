"use client";

import { motion } from "framer-motion";
import { CalendarDays, Check } from "lucide-react";

import type {
UpcomingFilterOption,
} from "./admin-dashboard-data/AdminDashboardData";

interface UpcomingFilterProps {
filters: UpcomingFilterOption[];
selectedFilter: UpcomingFilterOption["value"];
onFilterChange: (
value: UpcomingFilterOption["value"],
) => void;
}

export default function UpcomingFilter({
filters,
selectedFilter,
onFilterChange,
}: UpcomingFilterProps) {
return ( <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <CalendarDays className="h-4 w-4" /> </div>


    <div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Upcoming Flights
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Monitor the next scheduled departures.
      </p>
    </div>
  </div>

  <div
    className="flex w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/70 sm:w-auto"
    role="tablist"
    aria-label="Upcoming flight filters"
  >
    {filters.map((filter) => {
      const isSelected =
        selectedFilter === filter.value;

      return (
        <button
          key={filter.id}
          type="button"
          role="tab"
          aria-selected={isSelected}
          onClick={() => onFilterChange(filter.value)}
          className={`relative inline-flex min-w-fit items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            isSelected
              ? "text-sky-700 dark:text-sky-300"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {isSelected && (
            <motion.span
              layoutId="upcoming-filter-active"
              className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}

          <span className="relative z-10 flex items-center gap-1.5">
            {isSelected && (
              <Check className="h-3.5 w-3.5" />
            )}

            {filter.label}
          </span>
        </button>
      );
    })}
  </div>
</div>


);
}
