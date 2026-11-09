"use client";

import {
CheckCircle2,
Clock3,
Wrench,
} from "lucide-react";

import type { AircraftStatus } from "./aircraft-data/AircraftData";

interface AircraftStatusBadgeProps {
status: AircraftStatus;
}

export default function AircraftStatusBadge({
status,
}: AircraftStatusBadgeProps) {
if (status === "active") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/50"> <CheckCircle2 className="h-3.5 w-3.5" />
Active </span>
);
}

if (status === "maintenance") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/50"> <Wrench className="h-3.5 w-3.5" />
Maintenance </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"> <Clock3 className="h-3.5 w-3.5" />
Inactive </span>
);
}
