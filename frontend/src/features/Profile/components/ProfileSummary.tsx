
"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  
} from "lucide-react";

import type { ProfileFormValues } from "./ProfileEditForm";
import type { ProfileAccountStatus } from "./ProfileHeader";

interface ProfileSummaryProps {
  values: ProfileFormValues;
  avatarUrl?: string | null;
  accountStatus?: ProfileAccountStatus;
  memberSince?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  onEdit?: () => void;
}

interface SummaryDetailProps {
  icon: LucideIcon;
  label: string;
  value?: string;
}

const accountStatusStyles: Record<
  ProfileAccountStatus,
  { label: string; className: string; dotClassName: string }
> = {
  active: {
    label: "Active",
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
    label: "Inactive",
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    dotClassName: "bg-slate-400",
  },
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value?: string) {
  if (!value) return "";

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function SummaryDetail({
  icon: Icon,
  label,
  value,
}: SummaryDetailProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
          {value?.trim() || (
            <span className="font-normal italic text-slate-400 dark:text-slate-500">
              Not provided
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default function ProfileSummary({
  values,
  avatarUrl,
  accountStatus = "active",
  memberSince,
  emailVerified = false,
  phoneVerified = false,
  onEdit,
}: ProfileSummaryProps) {
  const fullName = [values.firstName, values.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const email = values.email.trim();
  const phone = values.phone.trim();

  const cityCountry = [values.city, values.country]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  const status = accountStatusStyles[accountStatus];

  const completionFields = [
    values.firstName,
    values.lastName,
    values.email,
    values.phone,
    values.dateOfBirth,
    values.address,
    values.city,
    values.country,
    values.postalCode,
  ];

  const completedFields = completionFields.filter(
    (field) => field.trim().length > 0,
  ).length;

  const completion = Math.round(
    (completedFields / completionFields.length) * 100,
  );

  const verificationCount = [emailVerified, phoneVerified].filter(
    Boolean,
  ).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 -z-10 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 text-2xl font-black shadow-lg backdrop-blur-sm">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={`${fullName || "User"} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(fullName)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              SOG Airways Account
            </p>

            <h2 className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">
              {fullName || "Your Profile"}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${status.dotClassName}`}
                />
                {status.label}
              </span>

              {formatDate(memberSince) && (
                <span className="inline-flex items-center gap-1.5 text-xs text-blue-100/80">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Member since {formatDate(memberSince)}
                </span>
              )}
            </div>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:self-center"
            >
              Edit Profile
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Profile Completion
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {completedFields} of {completionFields.length} profile fields completed
              </p>
            </div>

            <span className="text-lg font-black tabular-nums text-blue-600 dark:text-blue-400">
              {completion}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Profile completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completion}
            className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <CircleUserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Account Details
          </h3>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SummaryDetail
              icon={Mail}
              label="Email Address"
              value={email}
            />

            <SummaryDetail
              icon={Phone}
              label="Phone Number"
              value={phone}
            />

            <SummaryDetail
              icon={MapPin}
              label="Location"
              value={cityCountry}
            />

            <SummaryDetail
              icon={Globe2}
              label="Country"
              value={values.country}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Contact Verification
                </h3>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {verificationCount}/2 verified
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Verified contact details help you receive important account and flight updates.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    emailVerified
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Email {emailVerified ? "verified" : "unverified"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    phoneVerified
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Phone {phoneVerified ? "verified" : "unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
