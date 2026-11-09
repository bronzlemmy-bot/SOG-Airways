"use client";

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

interface StaffTableProps {
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

export default function StaffTable({
  staff,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <UserRound className="h-7 w-7 text-slate-500 dark:text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No staff members found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          No staff members match your current search and filter criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Mobile scroll hint */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 lg:hidden">
        <MapPin className="h-3.5 w-3.5" />
        Swipe horizontally to view all staff information.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-300 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <th className="w-62.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Staff
              </th>

              <th className="w-47.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Role
              </th>

              <th className="w-47.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Department
              </th>

              <th className="w-37.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Location
              </th>

              <th className="w-35 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Status
              </th>

              <th className="w-37.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Joined
              </th>

              <th className="w-32.5 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Last Active
              </th>

              <th className="w-47.5 px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {staff.map((member, index) => {
              const fullName = getStaffFullName(member);

              return (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.03, 0.2),
                  }}
                  className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {/* Staff */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      {member.avatar ? (
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            {member.firstName.charAt(0)}
                            {member.lastName.charAt(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {fullName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {member.staffId}
                        </p>

                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {member.email}
                          </span>
                        </div>

                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {getStaffRoleLabel(member.role)}
                      </span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0 text-slate-400" />

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {member.department}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {member.location}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 align-middle">
                    <StaffStatusBadge
                      status={member.status}
                      size="sm"
                      showIcon
                    />
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {formatDate(member.joinedDate)}
                      </span>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {formatDate(member.lastActive)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right align-middle">
                    <div className="flex justify-end">
                      <StaffActions
                        staff={member}
                        onView={onView}
                        onEdit={onEdit}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {staff.length}
          </span>{" "}
          staff member{staff.length === 1 ? "" : "s"}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <UserRound className="h-3.5 w-3.5" />
          Staff Management
        </div>
      </div>
    </div>
  );
}