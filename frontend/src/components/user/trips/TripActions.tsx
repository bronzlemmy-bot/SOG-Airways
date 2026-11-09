"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarCheck,
FileText,
MapPin,
Plane,
} from "lucide-react";
import type { Trip } from "./trips-data/TripsData";

interface TripActionProps {
trip: Trip;
onViewDetails: () => void;
onManageBooking: () => void;
onCheckIn: () => void;
onTrackFlight: () => void;
}

interface ActionButtonProps {
icon: React.ReactNode;
label: string;
onClick: () => void;
primary?: boolean;
}

export default function TripAction({
trip,
onViewDetails,
onManageBooking,
onCheckIn,
onTrackFlight,
}: TripActionProps) {
const isUpcoming = trip.status === "upcoming";
const isCancelled = trip.status === "cancelled";

return (
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
>
<ActionButton
icon={<FileText className="h-4 w-4" />}
label="View Details"
onClick={onViewDetails}
primary
/>


  {!isCancelled && (
    <ActionButton
      icon={<Plane className="h-4 w-4" />}
      label="Manage Booking"
      onClick={onManageBooking}
    />
  )}

  {isUpcoming && (
    <ActionButton
      icon={<CalendarCheck className="h-4 w-4" />}
      label="Check In"
      onClick={onCheckIn}
    />
  )}

  {!isCancelled && (
    <ActionButton
      icon={<MapPin className="h-4 w-4" />}
      label="Track Flight"
      onClick={onTrackFlight}
    />
  )}

  {isCancelled && (
    <ActionButton
      icon={<ArrowRight className="h-4 w-4" />}
      label="Book Again"
      onClick={onManageBooking}
    />
  )}
</motion.div>


);
}

function ActionButton({
icon,
label,
onClick,
primary = false,
}: ActionButtonProps) {
return (
<motion.button
type="button"
whileHover={{ y: -1 }}
whileTap={{ scale: 0.98 }}
onClick={onClick}
className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        primary
          ? "bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
>
{icon}
{label}
</motion.button>
);
}
