
"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Globe2,
  Map,
  MapPin,
  Plane,
  Route,
  Star,
  Trophy,
} from "lucide-react";
import {
  travelSummary,
  travelSummaryBreakdown,
} from "./dashboard-data/DashboardDta";

const summaryItems = [
  {
    label: "Total trips",
    value: travelSummary.totalTrips,
    icon: Plane,
    description: "Trips completed",
  },
  {
    label: "Countries visited",
    value: travelSummary.countriesVisited,
    icon: Globe2,
    description: "Countries explored",
  },
  {
    label: "Cities visited",
    value: travelSummary.citiesVisited,
    icon: MapPin,
    description: "Cities discovered",
  },
  {
    label: "Miles traveled",
    value: travelSummary.totalMiles.toLocaleString(),
    icon: Route,
    description: "Miles in the air",
  },
];

const internationalBreakdown =
  travelSummaryBreakdown.find(
    (item) => item.id === "international",
  )?.value ?? 0;

const domesticBreakdown =
  travelSummaryBreakdown.find(
    (item) => item.id === "domestic",
  )?.value ?? 0;

export default function TravelSummary() {
  return (
    <section className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
          Your journey
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Travel summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          A snapshot of your travel history and achievements.
        </p>
      </div>

      {/* Main summary card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          {/* Statistics */}
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 gap-4">
              {summaryItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-200 hover:border-sky-100 hover:bg-sky-50/50 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                        <Icon size={19} />
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="text-slate-300"
                      />
                    </div>

                    <p className="mt-4 text-2xl font-bold text-slate-950 sm:text-3xl">
                      {item.value}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Travel points */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="mt-4 flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <Trophy size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                    Travel points
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {travelSummary.travelPoints.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">
                  Keep traveling to earn more
                </p>

                <button
                  type="button"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                >
                  Explore rewards
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Destination + breakdown */}
          <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            {/* Favorite destination */}
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Star size={19} />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Favorite
                </span>
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-wider text-white/50">
                Most visited destination
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                {travelSummary.favoriteDestination.city}
              </h3>

              <p className="mt-1 text-sm text-white/60">
                {travelSummary.favoriteDestination.country}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
                <MapPin size={15} />

                <span>
                  {travelSummary.favoriteDestination.visits} visits
                </span>
              </div>
            </div>

            {/* Trip breakdown */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Trip breakdown
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    International vs domestic
                  </p>
                </div>

                <Map size={19} className="text-slate-400" />
              </div>

              <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${internationalBreakdown}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-sky-500"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />

                      <span className="text-xs font-semibold text-slate-600">
                        International
                      </span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {internationalBreakdown}%
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                      <span className="text-xs font-semibold text-slate-600">
                        Domestic
                      </span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {domesticBreakdown}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

