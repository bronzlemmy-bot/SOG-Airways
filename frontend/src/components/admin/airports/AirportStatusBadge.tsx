"use client";

import { CheckCircle2, CircleOff, Clock3 } from "lucide-react";
import type { AirportStatus } from "./airports-data/AirportsData";

interface AirportStatusBadgeProps {
status: AirportStatus;
}

export default function AirportStatusBadge({
status,
}: AirportStatusBadgeProps) {
if (status === "operational") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"> <CheckCircle2 className="h-3.5 w-3.5" />
Operational </span>
);
}

if (status === "limited") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"> <Clock3 className="h-3.5 w-3.5" />
Limited </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-400"> <CircleOff className="h-3.5 w-3.5" />
Closed </span>
);
}
