"use client";

import { motion } from "framer-motion";
import {
ArrowDownRight,
ArrowUpRight,
BarChart3,
Plane,
Ticket,
Users,
} from "lucide-react";
import type { DashboardStat } from "./admin-dashboard-data/AdminDashboardData";

interface DashboardStatsProps {
stats: DashboardStat[];
}

const statIcons = [Ticket, Users, BarChart3, Plane];

export default function DashboardStats({
stats,
}: DashboardStatsProps) {
return ( <section aria-label="Dashboard statistics"> <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
{stats.map((stat, index) => {
const Icon = statIcons[index % statIcons.length];


      return (
        <motion.article
          key={stat.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.08,
          }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/80 blur-2xl transition-transform duration-300 group-hover:scale-125 dark:bg-slate-800/70" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon className="h-5 w-5" />
              </div>

              <ChangeIndicator
                change={stat.change}
                changeType={stat.changeType}
              />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {stat.value}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
              {stat.description}
            </p>
          </div>
        </motion.article>
      );
    })}
  </div>
</section>


);
}

interface ChangeIndicatorProps {
change: string;
changeType: DashboardStat["changeType"];
}

function ChangeIndicator({
change,
changeType,
}: ChangeIndicatorProps) {
if (changeType === "neutral") {
return ( <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
{change} </span>
);
}

const isPositive = changeType === "positive";

return (
<span
className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
      }`}
>
{isPositive ? ( <ArrowUpRight className="h-3.5 w-3.5" />
) : ( <ArrowDownRight className="h-3.5 w-3.5" />
)}


  {change}
</span>


);
}
