"use client";

import { motion } from "framer-motion";
import { CalendarDays, UserRound } from "lucide-react";
import type { ProfileData } from "./profile-data/ProfileData";

interface PersonalInformationProps {
profile: ProfileData;
isEditing: boolean;
onChange: (field: keyof ProfileData["personal"], value: string) => void;
}

export default function PersonalInformation({
profile,
isEditing,
onChange,
}: PersonalInformationProps) {
return (
<motion.section
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
> <div className="mb-6 flex items-start gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"> <UserRound className="h-5 w-5" /> </div>


    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Personal Information
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Keep your personal details up to date for a smoother travel
        experience.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div>
      <label
        htmlFor="firstName"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        First Name
      </label>

      <input
        id="firstName"
        type="text"
        value={profile.personal.firstName}
        disabled={!isEditing}
        onChange={(event) => onChange("firstName", event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      />
    </div>

    <div>
      <label
        htmlFor="lastName"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Last Name
      </label>

      <input
        id="lastName"
        type="text"
        value={profile.personal.lastName}
        disabled={!isEditing}
        onChange={(event) => onChange("lastName", event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      />
    </div>

    <div>
      <label
        htmlFor="dateOfBirth"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Date of Birth
      </label>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="dateOfBirth"
          type="date"
          value={profile.personal.dateOfBirth}
          disabled={!isEditing}
          onChange={(event) =>
            onChange("dateOfBirth", event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
      </div>
    </div>

    <div>
      <label
        htmlFor="gender"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Gender
      </label>

      <select
        id="gender"
        value={profile.personal.gender}
        disabled={!isEditing}
        onChange={(event) => onChange("gender", event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    </div>
  </div>
</motion.section>


);
}
