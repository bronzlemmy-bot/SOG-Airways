
"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Globe2,
  Hash,
  Mail,
  MapPin,
  Phone,
  UserRound,
  VenusAndMars,
} from "lucide-react";

import type { ProfileFormValues } from "./ProfileEditForm";

interface ProfileInformationProps {
  values: ProfileFormValues;
  title?: string;
  description?: string;
}

interface InformationItemProps {
  label: string;
  value?: string | null;
  icon: React.ElementType;
  className?: string;
  multiline?: boolean;
}

function InformationItem({
  label,
  value,
  icon: Icon,
  className = "",
  multiline = false,
}: InformationItemProps) {
  const displayValue = value?.trim();

  return (
    <div
      className={`group flex min-w-0 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-blue-100 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-900 dark:hover:bg-blue-950/20 ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-blue-400">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1.5 break-words text-sm font-semibold text-slate-900 dark:text-white ${
            multiline ? "whitespace-pre-line leading-6" : ""
          }`}
        >
          {displayValue || (
            <span className="font-normal italic text-slate-400 dark:text-slate-500">
              Not provided
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "";

  // Preserve date-only values without introducing a timezone shift.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
}

function formatGender(value?: string) {
  if (!value) return "";

  const labels: Record<string, string> = {
    female: "Female",
    male: "Male",
    "non-binary": "Non-binary",
    "prefer-not-to-say": "Prefer not to say",
  };

  return labels[value.toLowerCase()] ?? value;
}

function InformationSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export default function ProfileInformation({
  values,
  title = "Profile Information",
  description = "Review the personal information associated with your account.",
}: ProfileInformationProps) {
  const fullName = [values.firstName, values.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const formattedBirthDate = formatDate(values.dateOfBirth);

  const completeFields = [
    values.firstName,
    values.lastName,
    values.email,
    values.phone,
    values.address,
    values.city,
    values.country,
  ];

  const completionPercentage = Math.round(
    (completeFields.filter((field) => field.trim().length > 0).length /
      completeFields.length) *
      100,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-100 px-5 py-6 dark:border-slate-800 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <span className="text-xs font-black">
                {completionPercentage}%
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Profile completion
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {completionPercentage === 100
                  ? "All key fields filled"
                  : "Keep your details up to date"}
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercentage}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        <InformationSection
          title="Personal Details"
          description="Your identifying and personal information."
        >
          <InformationItem
            label="Full Name"
            value={fullName}
            icon={UserRound}
          />

          <InformationItem
            label="Date of Birth"
            value={formattedBirthDate}
            icon={CalendarDays}
          />

          <InformationItem
            label="Gender"
            value={formatGender(values.gender)}
            icon={VenusAndMars}
          />
        </InformationSection>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <InformationSection
          title="Contact Details"
          description="The contact information associated with your account."
        >
          <InformationItem
            label="Email Address"
            value={values.email}
            icon={Mail}
          />

          <InformationItem
            label="Phone Number"
            value={values.phone}
            icon={Phone}
          />
        </InformationSection>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <InformationSection
          title="Address Details"
          description="Your residential or mailing address."
        >
          <InformationItem
            label="Street Address"
            value={values.address}
            icon={MapPin}
            multiline
            className="sm:col-span-2"
          />

          <InformationItem
            label="City"
            value={values.city}
            icon={Building2Icon}
          />

          <InformationItem
            label="Country"
            value={values.country}
            icon={Globe2}
          />

          <InformationItem
            label="Postal Code"
            value={values.postalCode}
            icon={Hash}
          />
        </InformationSection>

        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Keep your information current
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700/90 dark:text-emerald-400/90">
              Accurate contact details help you receive important account
              updates and travel-related notifications.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Building2Icon(props: React.ComponentProps<typeof MapPin>) {
  return <MapPin {...props} />;
}
