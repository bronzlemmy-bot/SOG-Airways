"use client";

import { motion } from "framer-motion";
import { CalendarX2, RotateCcw } from "lucide-react";
import type { TripFilter } from "./trips-data/TripsData";

interface TripEmptyStateProps {
filter: TripFilter;
onReset: () => void;
}

interface EmptyStateContent {
title: string;
description: string;
}

const emptyStateContent: Record<TripFilter, EmptyStateContent> = {
all: {
title: "No trips yet",
description:
"Your booked journeys will appear here once you make a reservation with SOG Airways.",
},

upcoming: {
title: "No upcoming trips",
description:
"You currently have no upcoming journeys. Your next booked trip will appear here.",
},

completed: {
title: "No completed trips",
description:
"You have not completed any trips yet. Your travel history will appear here after your journey.",
},

cancelled: {
title: "No cancelled trips",
description:
"You currently have no cancelled trips in your travel history.",
},
};

export default function TripEmptyState({
filter,
onReset,
}: TripEmptyStateProps) {
const content = emptyStateContent[filter];

return (
<motion.section
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-8 sm:py-16"
> <div className="mx-auto flex max-w-lg flex-col items-center">
<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.35, delay: 0.1 }}
className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
> <CalendarX2 className="h-8 w-8" />
</motion.div>


    <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
      {content.title}
    </h2>

    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
      {content.description}
    </p>

    {filter !== "all" && (
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        <RotateCcw className="h-4 w-4" />
        View All Trips
      </motion.button>
    )}
  </div>
</motion.section>


);
}
