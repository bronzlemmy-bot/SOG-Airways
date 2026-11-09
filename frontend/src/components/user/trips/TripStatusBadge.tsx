"use client";

import { motion } from "framer-motion";
import {
CalendarClock,
CheckCircle2,
XCircle,
type LucideIcon,
} from "lucide-react";
import type { TripStatus } from "./trips-data/TripsData";

interface TripStatusBadgeProps {
status: TripStatus;
}

interface StatusConfig {
label: string;
icon: LucideIcon;
className: string;
}

const statusConfig: Record<TripStatus, StatusConfig> = {
upcoming: {
label: "Upcoming",
icon: CalendarClock,
className:
"bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900",
},

completed: {
label: "Completed",
icon: CheckCircle2,
className:
"bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
},

cancelled: {
label: "Cancelled",
icon: XCircle,
className:
"bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
},
};

export default function TripStatusBadge({
status,
}: TripStatusBadgeProps) {
const config = statusConfig[status];
const Icon = config.icon;

return (
<motion.span
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.2 }}
className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
> <Icon className="h-3.5 w-3.5" />
{config.label}
</motion.span>
);
}
