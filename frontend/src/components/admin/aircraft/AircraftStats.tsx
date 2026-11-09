"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
Plane,
Wrench,
XCircle,
} from "lucide-react";

import type {
AircraftSummary,
} from "./aircraft-data/AircraftData";

interface AircraftStatsProps {
summaries: AircraftSummary[];
}

function getSummaryConfig(type: AircraftSummary["type"]) {
if (type === "total") {
return {
icon: Plane,
iconWrapper:
"bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
valueColor: "text-slate-900 dark:text-white",
};
}

if (type === "active") {
return {
icon: CheckCircle2,
iconWrapper:
"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
valueColor: "text-emerald-700 dark:text-emerald-400",
};
}

if (type === "maintenance") {
return {
icon: Wrench,
iconWrapper:
"bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
valueColor: "text-amber-700 dark:text-amber-400",
};
}

return {
icon: XCircle,
iconWrapper:
"bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
valueColor: "text-slate-700 dark:text-slate-300",
};
}

export default function AircraftStats({
summaries,
}: AircraftStatsProps) {
return ( <section
   aria-label="Aircraft fleet statistics"
   className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
 >
{summaries.map((summary, index) => {
const config = getSummaryConfig(summary.type);
const Icon = config.icon;


    return (
      <motion.article
        key={summary.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.06,
        }}
        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {summary.label}
            </p>

            <p
              className={`mt-2 text-2xl font-bold tracking-tight ${config.valueColor}`}
            >
              {summary.value}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconWrapper}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {summary.description}
        </p>
      </motion.article>
    );
  })}
</section>


);
}
