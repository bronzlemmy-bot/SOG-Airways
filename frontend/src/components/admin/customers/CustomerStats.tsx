"use client";

import { motion } from "framer-motion";
import {
Ban,
CircleDollarSign,
Users,
UserCheck,
UserX,
} from "lucide-react";

import type { AdminCustomerSummary } from "./admin-customers-data/AdminCustomersData";

interface CustomerStatsProps {
summaries: AdminCustomerSummary[];
}

function getSummaryIcon(
type: AdminCustomerSummary["type"],
) {
if (type === "total") {
return Users;
}

if (type === "active") {
return UserCheck;
}

if (type === "inactive") {
return UserX;
}

if (type === "suspended") {
return Ban;
}

return CircleDollarSign;
}

function getSummaryStyle(
type: AdminCustomerSummary["type"],
) {
if (type === "total") {
return "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400";
}

if (type === "active") {
return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400";
}

if (type === "inactive") {
return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

if (type === "suspended") {
return "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400";
}

return "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400";
}

export default function CustomerStats({
summaries,
}: CustomerStatsProps) {
return ( <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
{summaries.map((summary, index) => {
const Icon = getSummaryIcon(summary.type);


    return (
      <motion.article
        key={summary.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          delay: index * 0.05,
        }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {summary.label}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {summary.value}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getSummaryStyle(
              summary.type,
            )}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {summary.description}
        </p>
      </motion.article>
    );
  })}
</section>


);
}
