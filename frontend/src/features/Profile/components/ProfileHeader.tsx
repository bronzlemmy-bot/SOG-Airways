
"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export type ProfileAccountStatus = "active" | "pending" | "inactive";

interface ProfileHeaderProps {
  name?: string;
  title?: string;
  description?: string;
  accountStatus?: ProfileAccountStatus;
  memberSince?: string;
}

const statusStyles: Record<
  ProfileAccountStatus,
  { label: string; className: string; dotClassName: string }
> = {
  active: {
    label: "Active Account",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },
  pending: {
    label: "Pending Verification",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    dotClassName: "bg-amber-500",
  },
  inactive: {
    label: "Inactive Account",
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    dotClassName: "bg-slate-400",
  },
};

function formatMemberSince(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ProfileHeader({
  name,
  title = "My Profile",
  description = "Manage your personal information and keep your SOG Airways account up to date.",
  accountStatus = "active",
  memberSince,
}: ProfileHeaderProps) {
  const status = statusStyles[accountStatus];
  const formattedMemberSince = formatMemberSince(memberSince);
  const displayName = name?.trim();

  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            SOG AIRWAYS · ACCOUNT CENTER
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner backdrop-blur-sm sm:flex">
              <UserRound className="h-7 w-7 text-sky-200" />
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {displayName && (
                <p className="mt-2 break-words text-base font-semibold text-sky-200 sm:text-lg">
                  Welcome, {displayName}
                </p>
              )}

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${status.className}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${status.dotClassName}`}
            />
            {status.label}
          </span>

          {formattedMemberSince && (
            <div className="inline-flex items-center gap-2 text-sm text-blue-100/80">
              <CalendarDays className="h-4 w-4 shrink-0 text-sky-300" />
              <span>Member since {formattedMemberSince}</span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-100/70">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            Your account, your journey
          </div>
        </div>
      </div>
    </motion.header>
  );
}
