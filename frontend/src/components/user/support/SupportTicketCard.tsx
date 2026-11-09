"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
CalendarDays,
ChevronRight,
Clock3,
Hash,
MessageSquare,
} from "lucide-react";

import type { SupportTicket } from "./support-data/SupportData";

interface SupportTicketCardProps {
ticket: SupportTicket;
isSelected?: boolean;
onSelect: (ticketId: string) => void;
}

type StatusKey = "open" | "resolved";
type PriorityKey = "low" | "normal" | "high";

const statusLabels: Record<StatusKey, string> = {
open: "Open",
resolved: "Resolved",
};

const priorityLabels: Record<PriorityKey, string> = {
low: "Low",
normal: "Normal",
high: "High",
};

export default function SupportTicketCard({
ticket,
isSelected = false,
onSelect,
}: SupportTicketCardProps) {
const status = ticket.status as StatusKey;
const priority = ticket.priority as PriorityKey;

const statusClass =
status === "open"
? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20"
: "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20";

const priorityClass =
priority === "high"
? "text-orange-600 dark:text-orange-400"
: priority === "normal"
? "text-amber-600 dark:text-amber-400"
: "text-slate-500 dark:text-slate-400";

const cardClass = isSelected
? "border-slate-900 bg-slate-50 shadow-md dark:border-white dark:bg-slate-900/80"
: "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700";

const iconClass = isSelected
? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

return (
<motion.button
type="button"
whileHover={{ y: -2 }}
whileTap={{ scale: 0.995 }}
onClick={() => onSelect(ticket.id)}
aria-pressed={isSelected}
className={
"w-full rounded-2xl border p-4 text-left transition-all sm:p-5 " +
cardClass
}
> <div className="flex items-start justify-between gap-4"> <div className="min-w-0 flex-1"> <div className="flex flex-wrap items-center gap-2">
<span
className={
"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset " +
statusClass
}
>
{statusLabels[status] ?? "Open"} </span>


        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {ticket.category}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
        {ticket.subject}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {ticket.message}
      </p>
    </div>

    <div
      className={
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors " +
        iconClass
      }
    >
      <ChevronRight className="h-4 w-4" />
    </div>
  </div>

  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
    <TicketMeta
      icon={<Hash className="h-3.5 w-3.5" />}
      label="Ticket"
      value={ticket.id}
    />

    <TicketMeta
      icon={<CalendarDays className="h-3.5 w-3.5" />}
      label="Created"
      value={formatDate(ticket.createdAt)}
    />

    <TicketMeta
      icon={<MessageSquare className="h-3.5 w-3.5" />}
      label="Booking"
      value={ticket.bookingReference || "Not provided"}
    />

    <TicketMeta
      icon={<Clock3 className="h-3.5 w-3.5" />}
      label="Priority"
      value={priorityLabels[priority] ?? "Normal"}
      valueClassName={priorityClass}
    />
  </div>
</motion.button>


);
}

interface TicketMetaProps {
icon: ReactNode;
label: string;
value: string;
valueClassName?: string;
}

function TicketMeta({
icon,
label,
value,
valueClassName = "text-slate-700 dark:text-slate-300",
}: TicketMetaProps) {
return ( <div className="flex min-w-0 items-center gap-2"> <span className="shrink-0 text-slate-400">
{icon} </span>

  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p
      className={
        "mt-0.5 truncate text-xs font-medium " +
        valueClassName
      }
    >
      {value}
    </p>
  </div>
</div>


);
}

function formatDate(value: string): string {
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en", {
month: "short",
day: "numeric",
year: "numeric",
}).format(date);
}
