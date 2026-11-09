"use client";

import { motion } from "framer-motion";
import { Check, Filter } from "lucide-react";
import {
tripFilters,
type TripFilter as TripFilterType,
} from "./trips-data/TripsData";

interface TripFilterProps {
selectedFilter: TripFilterType;
onFilterChange: (filter: TripFilterType) => void;
}

export default function TripFilter({
selectedFilter,
onFilterChange,
}: TripFilterProps) {
return (
<motion.section
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: 0.1 }}
className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
> <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"> <div className="flex items-center gap-3"> <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"> <Filter className="h-5 w-5" /> </span>


      <div>
        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
          Trip History
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Filter your journeys by status
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
      {tripFilters.map((filter) => {
        const isSelected = selectedFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={isSelected}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
              isSelected
                ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            {isSelected && <Check className="h-4 w-4" />}
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  </div>
</motion.section>


);
}
