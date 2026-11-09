"use client";

import { motion } from "framer-motion";
import {
Bell,
CalendarCheck,
CreditCard,
Filter,
Plane,
WalletCards,
} from "lucide-react";

export type NotificationFilter =
| "all"
| "unread"
| "booking"
| "flight"
| "payment"
| "travel";

interface NotificationsFiltersProps {
activeFilter: NotificationFilter;
onFilterChange: (filter: NotificationFilter) => void;
}

const filters = [
{
id: "all" as const,
label: "All",
icon: Bell,
},
{
id: "unread" as const,
label: "Unread",
icon: Filter,
},
{
id: "booking" as const,
label: "Bookings",
icon: CalendarCheck,
},
{
id: "flight" as const,
label: "Flights",
icon: Plane,
},
{
id: "payment" as const,
label: "Payments",
icon: CreditCard,
},
{
id: "travel" as const,
label: "Travel Alerts",
icon: WalletCards,
},
];

export default function NotificationsFilters({
activeFilter,
onFilterChange,
}: NotificationsFiltersProps) {
return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: 0.1 }}
className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4"
> <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
{filters.map((filter) => {
const Icon = filter.icon;
const isActive = activeFilter === filter.id;


      return (
        <motion.button
          key={filter.id}
          type="button"
          onClick={() => onFilterChange(filter.id)}
          whileTap={{ scale: 0.97 }}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            isActive
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{filter.label}</span>
        </motion.button>
      );
    })}
  </div>
</motion.div>


);
}
