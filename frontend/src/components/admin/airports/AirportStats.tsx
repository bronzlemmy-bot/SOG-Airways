"use client";

import { motion } from "framer-motion";
import {
Building2,
CheckCircle2,
CircleOff,
Clock3,
} from "lucide-react";

import type { AirportSummary } from "./airports-data/AirportsData";

interface AirportStatsProps {
summaries: AirportSummary[];
}

export default function AirportStats({
summaries,
}: AirportStatsProps) {
return ( <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
{summaries.map((summary, index) => {
const config = getSummaryConfig(summary.type);


    return (
      <motion.article
        key={summary.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.05,
        }}
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconBackground} ${config.iconColor}`}
          >
            {config.icon}
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.badgeBackground} ${config.badgeColor}`}
          >
            {summary.type === "total"
              ? "All"
              : summary.type === "operational"
                ? "Active"
                : summary.type === "limited"
                  ? "Limited"
                  : "Unavailable"}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {summary.label}
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {summary.value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {summary.description}
          </p>
        </div>
      </motion.article>
    );
  })}
</section>


);
}

function getSummaryConfig(type: AirportSummary["type"]) {
switch (type) {
case "operational":
return {
icon: <CheckCircle2 className="h-5 w-5" />,
iconBackground:
"bg-emerald-50 dark:bg-emerald-950/40",
iconColor:
"text-emerald-600 dark:text-emerald-400",
badgeBackground:
"bg-emerald-50 dark:bg-emerald-950/40",
badgeColor:
"text-emerald-700 dark:text-emerald-300",
};


case "limited":
  return {
    icon: <Clock3 className="h-5 w-5" />,
    iconBackground:
      "bg-amber-50 dark:bg-amber-950/40",
    iconColor:
      "text-amber-600 dark:text-amber-400",
    badgeBackground:
      "bg-amber-50 dark:bg-amber-950/40",
    badgeColor:
      "text-amber-700 dark:text-amber-300",
  };

case "closed":
  return {
    icon: <CircleOff className="h-5 w-5" />,
    iconBackground:
      "bg-red-50 dark:bg-red-950/40",
    iconColor:
      "text-red-600 dark:text-red-400",
    badgeBackground:
      "bg-red-50 dark:bg-red-950/40",
    badgeColor:
      "text-red-700 dark:text-red-300",
  };

case "total":
default:
  return {
    icon: <Building2 className="h-5 w-5" />,
    iconBackground:
      "bg-blue-50 dark:bg-blue-950/40",
    iconColor:
      "text-blue-600 dark:text-blue-400",
    badgeBackground:
      "bg-blue-50 dark:bg-blue-950/40",
    badgeColor:
      "text-blue-700 dark:text-blue-300",
  };


}
}
