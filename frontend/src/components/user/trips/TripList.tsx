"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Trip, TripFilter } from "./trips-data/TripsData";
import TripCard from "./TripCard";
import TripEmptyState from "./TripEmptyState";



interface TripListProps {
trips: Trip[];
selectedFilter: TripFilter;
onSelectTrip: (tripId: string) => void;
onResetFilter: () => void;
}

export default function TripList({
trips,
selectedFilter,
onSelectTrip,
onResetFilter,
}: TripListProps) {
if (trips.length === 0) {
return ( <TripEmptyState
     filter={selectedFilter}
     onReset={onResetFilter}
   />
);
}

return ( <section aria-label="Your trips"> <div className="mb-4 flex items-center justify-between gap-3"> <div> <h2 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
{selectedFilter === "all"
? "All Trips"
: selectedFilter === "upcoming"
? "Upcoming Trips"
: selectedFilter === "completed"
? "Completed Trips"
: "Cancelled Trips"} </h2>


      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {trips.length} {trips.length === 1 ? "trip" : "trips"} found
      </p>
    </div>
  </div>

  <motion.div
    layout
    className="space-y-4"
  >
    <AnimatePresence mode="popLayout">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onSelect={onSelectTrip}
        />
      ))}
    </AnimatePresence>
  </motion.div>
</section>


);
}
