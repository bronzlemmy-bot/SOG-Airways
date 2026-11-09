"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ProfileData } from "./profile-data/ProfileData";

interface ContactInformationProps {
profile: ProfileData;
isEditing: boolean;
onChange: (field: keyof ProfileData["contact"], value: string) => void;
}

export default function ContactInformation({
profile,
isEditing,
onChange,
}: ContactInformationProps) {
return (
<motion.section
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: 0.05 }}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
> <div className="mb-6 flex items-start gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"> <MapPin className="h-5 w-5" /> </div>

```
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Contact Information
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Keep your contact details current so SOG Airways can reach you when
        needed.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div>
      <label
        htmlFor="email"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Email Address
      </label>

      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="email"
          type="email"
          value={profile.contact.email}
          disabled={!isEditing}
          onChange={(event) => onChange("email", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
      </div>
    </div>

    <div>
      <label
        htmlFor="phone"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Phone Number
      </label>

      <div className="relative">
        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="phone"
          type="tel"
          value={profile.contact.phone}
          disabled={!isEditing}
          onChange={(event) => onChange("phone", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
      </div>
    </div>

    <div className="md:col-span-2">
      <label
        htmlFor="address"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Address
      </label>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="address"
          type="text"
          value={profile.contact.address}
          disabled={!isEditing}
          onChange={(event) => onChange("address", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
      </div>
    </div>

    <div>
      <label
        htmlFor="city"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        City
      </label>

      <input
        id="city"
        type="text"
        value={profile.contact.city}
        disabled={!isEditing}
        onChange={(event) => onChange("city", event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      />
    </div>

    <div>
      <label
        htmlFor="country"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Country
      </label>

      <input
        id="country"
        type="text"
        value={profile.contact.country}
        disabled={!isEditing}
        onChange={(event) => onChange("country", event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      />
    </div>
  </div>
</motion.section>


);
}
