
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Headphones,
  Plane,
  type LucideIcon,
} from "lucide-react";

import { quickActions } from "./dashboard-data/DashboardDta";

const iconMap: Record<string, LucideIcon> = {
  plane: Plane,
  briefcase: Briefcase,
  "check-circle": CheckCircle2,
  headphones: Headphones,
};

const QuickActions = () => {
  return (
    <section aria-labelledby="quick-actions-heading">
      <div className="mb-5">
        <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
          Quick access
        </p>

        <h2
          id="quick-actions-heading"
          className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
        >
          What would you like to do?
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = iconMap[action.icon] ?? Plane;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={action.href}
                className="group relative flex h-full min-h-42.5 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-500/30"
              >
                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-500/5 transition-transform duration-500 group-hover:scale-[1.7]" />

                <div className="relative flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white dark:bg-sky-500/10 dark:text-sky-400 dark:group-hover:bg-sky-500 dark:group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-sky-50 group-hover:text-sky-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-sky-500/10 dark:group-hover:text-sky-400">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>

                <div className="relative mt-auto pt-7">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {action.title}
                  </h3>

                  <p className="mt-1.5 max-w-57.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
