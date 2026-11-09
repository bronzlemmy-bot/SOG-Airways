"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  Users,
  UserX,
} from "lucide-react";

import { AdminStaff } from "./admin-staff-data/StaffData";

interface StaffStatsProps {
  staff: AdminStaff[];
}

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  iconBackground: string;
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  iconBackground,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}>
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Staff
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function getUniqueCount(values: string[]) {
  return new Set(values).size;
}

export default function StaffStats({ staff }: StaffStatsProps) {
  const totalStaff = staff.length;

  const activeStaff = staff.filter(
    (member) => member.status === "active",
  ).length;

  const inactiveStaff = staff.filter(
    (member) => member.status === "inactive",
  ).length;

  const suspendedStaff = staff.filter(
    (member) => member.status === "suspended",
  ).length;

  const departmentCount = getUniqueCount(
    staff.map((member) => member.department),
  );

  const locationCount = getUniqueCount(
    staff.map((member) => member.location),
  );

  const stats: StatCardProps[] = [
    {
      label: "Total Staff",
      value: totalStaff,
      description: "All registered staff members",
      icon: Users,
      iconClassName: "text-blue-600 dark:text-blue-400",
      iconBackground: "bg-blue-100 dark:bg-blue-950/50",
    },
    {
      label: "Active Staff",
      value: activeStaff,
      description: "Currently active staff",
      icon: CheckCircle2,
      iconClassName: "text-emerald-600 dark:text-emerald-400",
      iconBackground: "bg-emerald-100 dark:bg-emerald-950/50",
    },
    {
      label: "Inactive Staff",
      value: inactiveStaff,
      description: "Currently inactive staff",
      icon: UserX,
      iconClassName: "text-amber-600 dark:text-amber-400",
      iconBackground: "bg-amber-100 dark:bg-amber-950/50",
    },
    {
      label: "Suspended Staff",
      value: suspendedStaff,
      description: "Staff with suspended access",
      icon: ShieldAlert,
      iconClassName: "text-red-600 dark:text-red-400",
      iconBackground: "bg-red-100 dark:bg-red-950/50",
    },
    {
      label: "Departments",
      value: departmentCount,
      description: "Departments represented",
      icon: Building2,
      iconClassName: "text-violet-600 dark:text-violet-400",
      iconBackground: "bg-violet-100 dark:bg-violet-950/50",
    },
    {
      label: "Locations",
      value: locationCount,
      description: "Staff locations represented",
      icon: MapPin,
      iconClassName: "text-cyan-600 dark:text-cyan-400",
      iconBackground: "bg-cyan-100 dark:bg-cyan-950/50",
    },
  ];

  return (
    <section aria-label="Staff statistics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.05, 0.25),
            }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}