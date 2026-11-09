"use client";

import {
Ban,
CheckCircle2,
CircleOff,
} from "lucide-react";

import type { AdminCustomerStatus } from "./admin-customers-data/AdminCustomersData";

interface CustomerStatusBadgeProps {
status: AdminCustomerStatus;
}

export default function CustomerStatusBadge({
status,
}: CustomerStatusBadgeProps) {
if (status === "active") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"> <CheckCircle2 className="h-3.5 w-3.5" />
Active </span>
);
}

if (status === "inactive") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"> <CircleOff className="h-3.5 w-3.5" />
Inactive </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-400"> <Ban className="h-3.5 w-3.5" />
Suspended </span>
);
}
