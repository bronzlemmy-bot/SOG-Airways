"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import StaffActions from "./StaffActions";
import StaffStatusBadge from "./StaffStatusBadge";

import {
  AdminStaff,
  getStaffFullName,
  getStaffRoleLabel,
} from "./admin-staff-data/StaffData";

interface StaffCardProps {
  staff: AdminStaff[];
  onView: (staff: AdminStaff) => void;
  onEdit: (staff: AdminStaff) => void;
  onStatusChange: (
    staff: AdminStaff,
    status: AdminStaff["status"],
  ) => void;
  onDelete: (staff: AdminStaff) => void;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(staff: AdminStaff) {
  return `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();
}

export default function StaffCard({
  staff,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: StaffCardProps) {
  if (staff.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <UserRound className="h-7 w-7 text-slate-500 dark:text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No staff members found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters to find the staff member you
          are looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {staff.map((member, index) => {
        const fullName = getStaffFullName(member);
        const initials = getInitials(member);

        return (
          <motion.article
            key={member.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.04, 0.24),
            }}
            whileHover={{ y: -3 }}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-slate-200 bg-linear-to-br from-slate-50 via-white to-blue-50/60 p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {member.avatar ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-white dark:ring-slate-800">
                      <Image
                        src={member.avatar}
                        alt={fullName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                      {fullName}
                    </h3>

                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                      {member.staffId}
                    </p>
                  </div>
                </div>

                <StaffStatusBadge
                  status={member.status}
                  size="sm"
                  showIcon
                />
              </div>

              <div className="relative mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {getStaffRoleLabel(member.role)}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Building2 className="h-3.5 w-3.5" />
                  {member.department}
                </span>
              </div>
            </div>

            {/* Staff information */}
            <div className="space-y-3 p-5">
              <div className="grid grid-cols-1 gap-3">
                {/* Email */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                      {member.phone}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {member.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {formatDate(member.joinedDate)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <UserRound className="h-3.5 w-3.5" />
                    Last active
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {formatDate(member.lastActive)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                <StaffActions
                  staff={member}
                  onView={onView}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}