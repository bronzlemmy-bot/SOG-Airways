"use client";

import { motion } from "framer-motion";
import { Armchair, Plane, UtensilsCrossed } from "lucide-react";
import type { ProfileData } from "./profile-data/ProfileData";

interface TravelPreferenceProps {
profile: ProfileData;
isEditing: boolean;
onChange: (
field: keyof ProfileData["travel"],
value: string
) => void;
}

export default function TravelPreference({
profile,
isEditing,
onChange,
}: TravelPreferenceProps) {
return (
<motion.section
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: 0.1 }}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
> <div className="mb-6 flex items-start gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"> <Plane className="h-5 w-5" /> </div>

```
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Travel Preferences
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Save your preferred travel options to make future bookings easier.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div className="md:col-span-2">
      <label
        htmlFor="preferredAirport"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Preferred Airport
      </label>

      <div className="relative">
        <Plane className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          id="preferredAirport"
          value={profile.travel.preferredAirport}
          disabled={!isEditing}
          onChange={(event) =>
            onChange("preferredAirport", event.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        >
          <option value="">Select airport</option>
          <option value="Murtala Muhammed International Airport">
            Murtala Muhammed International Airport
          </option>
          <option value="Nnamdi Azikiwe International Airport">
            Nnamdi Azikiwe International Airport
          </option>
          <option value="Port Harcourt International Airport">
            Port Harcourt International Airport
          </option>
          <option value="Akanu Ibiam International Airport">
            Akanu Ibiam International Airport
          </option>
        </select>
      </div>
    </div>

    <div>
      <label
        htmlFor="preferredSeat"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Preferred Seat
      </label>

      <div className="relative">
        <Armchair className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          id="preferredSeat"
          value={profile.travel.preferredSeat}
          disabled={!isEditing}
          onChange={(event) =>
            onChange("preferredSeat", event.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        >
          <option value="">Select seat preference</option>
          <option value="Window">Window</option>
          <option value="Aisle">Aisle</option>
          <option value="Middle">Middle</option>
        </select>
      </div>
    </div>

    <div>
      <label
        htmlFor="preferredMeal"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Preferred Meal
      </label>

      <div className="relative">
        <UtensilsCrossed className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          id="preferredMeal"
          value={profile.travel.preferredMeal}
          disabled={!isEditing}
          onChange={(event) =>
            onChange("preferredMeal", event.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
        >
          <option value="">Select meal preference</option>
          <option value="Standard">Standard</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Halal">Halal</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>
      </div>
    </div>

    <div className="md:col-span-2">
      <label
        htmlFor="frequentFlyerNumber"
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        Frequent Flyer Number
      </label>

      <input
        id="frequentFlyerNumber"
        type="text"
        value={profile.travel.frequentFlyerNumber}
        disabled={!isEditing}
        onChange={(event) =>
          onChange("frequentFlyerNumber", event.target.value)
        }
        placeholder="Enter your frequent flyer number"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
      />
    </div>
  </div>
</motion.section>


);
}
