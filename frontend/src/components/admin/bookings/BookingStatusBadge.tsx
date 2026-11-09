"use client";

import {
CheckCircle2,
CircleCheck,
Clock3,
XCircle,
} from "lucide-react";

import type { AdminBookingStatus } from "./admin-bookings-data/AdminBookingsData";

interface BookingStatusBadgeProps {
status: AdminBookingStatus;
}

export default function BookingStatusBadge({
status,
}: BookingStatusBadgeProps) {
if (status === "confirmed") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"> <CheckCircle2 className="h-3.5 w-3.5" />
Confirmed </span>
);
}

if (status === "pending") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"> <Clock3 className="h-3.5 w-3.5" />
Pending </span>
);
}

if (status === "cancelled") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-400"> <XCircle className="h-3.5 w-3.5" />
Cancelled </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"> <CircleCheck className="h-3.5 w-3.5" />
Completed </span>
);
}
