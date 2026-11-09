"use client";

import {
AlertTriangle,
CheckCircle2,
CircleX,
Clock3,
Plane,
Radio,
} from "lucide-react";

import type {
AdminFlightStatus,
} from "./admin-flights-data/AdminFlightsData";

interface FlightStatusBadgeProps {
status: AdminFlightStatus;
}

export default function FlightStatusBadge({
status,
}: FlightStatusBadgeProps) {
if (status === "scheduled") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"> <Clock3 className="h-3.5 w-3.5" />
Scheduled </span>
);
}

if (status === "boarding") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"> <Radio className="h-3.5 w-3.5" />
Boarding </span>
);
}

if (status === "departed") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-400"> <Plane className="h-3.5 w-3.5" />
Departed </span>
);
}

if (status === "arrived") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"> <CheckCircle2 className="h-3.5 w-3.5" />
Arrived </span>
);
}

if (status === "delayed") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"> <AlertTriangle className="h-3.5 w-3.5" />
Delayed </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-400"> <CircleX className="h-3.5 w-3.5" />
Cancelled </span>
);
}
