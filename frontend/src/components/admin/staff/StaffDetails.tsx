"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import StaffStatusBadge from "./StaffStatusBadge";

import {
  AdminStaff,
  getStaffFullName,
  getStaffRoleLabel,
} from "./admin-staff-data/StaffData";

interface StaffDetailsProps {
  staff: AdminStaff;
  onClose?: () => void;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(staff: AdminStaff) {
  return `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();
}

function getPermissionLabel(
  permission: AdminStaff["permissions"][number],
) {
  const labels: Record<
    AdminStaff["permissions"][number],
    string
  > = {
    dashboard: "Dashboard",
    bookings: "Bookings",
    passengers: "Passengers",
    flights: "Flights",
    payments: "Payments",
    reports: "Reports",
    staff: "Staff Management",
    settings: "Settings",
    support: "Support",
  };

  return labels[permission];
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function StaffDetails({
  staff,
  onClose,
}: StaffDetailsProps) {
  const fullName = getStaffFullName(staff);
  const initials = getInitials(staff);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-6 sm:px-7">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close staff details"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          {staff.avatar ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-white/20">
              <Image
                src={staff.avatar}
                alt={fullName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-900">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {fullName}
              </h2>

              <StaffStatusBadge
                status={staff.status}
                size="sm"
                showIcon
              />
            </div>

            <p className="mt-1 text-sm text-slate-300">
              {staff.staffId} · {getStaffRoleLabel(staff.role)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <Building2 className="h-3.5 w-3.5" />
                {staff.department}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <MapPin className="h-3.5 w-3.5" />
                {staff.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-5 sm:p-7">
        {/* Contact Information */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
              <UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff contact and location details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem
              icon={Mail}
              label="Email"
              value={staff.email}
            />

            <DetailItem
              icon={Phone}
              label="Phone"
              value={staff.phone}
            />

            <DetailItem
              icon={MapPin}
              label="Location"
              value={staff.location}
            />

            <DetailItem
              icon={Building2}
              label="Department"
              value={staff.department}
            />
          </div>
        </section>

        {/* Employment Information */}
        <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/50">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Employment Information
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Role, status, and employment timeline
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem
              icon={ShieldCheck}
              label="Role"
              value={getStaffRoleLabel(staff.role)}
            />

            <DetailItem
              icon={CheckCircle2}
              label="Status"
              value={
                staff.status.charAt(0).toUpperCase() +
                staff.status.slice(1)
              }
            />

            <DetailItem
              icon={CalendarDays}
              label="Joined"
              value={formatDate(staff.joinedDate)}
            />

            <DetailItem
              icon={Clock3}
              label="Last Active"
              value={formatDateTime(staff.lastActive)}
            />
          </div>
        </section>

        {/* Permissions */}
        <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Access Permissions
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Areas this staff member can access
              </p>
            </div>
          </div>

          {staff.permissions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {staff.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {getPermissionLabel(permission)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No permissions assigned.
            </div>
          )}
        </section>

        {/* Staff Identifier */}
        <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Staff Identifier
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {staff.staffId}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <UserRound className="h-3.5 w-3.5" />
                SOG Airways Staff
              </span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}