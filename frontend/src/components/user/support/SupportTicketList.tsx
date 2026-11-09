"use client";

import { motion } from "framer-motion";
import { Inbox, Ticket } from "lucide-react";

import SupportTicketCard from "./SupportTicketCard";

import type { SupportTicket } from "./support-data/SupportData";

interface SupportTicketListProps {
tickets: readonly SupportTicket[];
selectedTicketId?: string | null;
onSelectTicket: (ticketId: string) => void;
}

export default function SupportTicketList({
tickets,
selectedTicketId = null,
onSelectTicket,
}: SupportTicketListProps) {
return ( <section className="space-y-4"> <div className="flex items-center justify-between gap-4"> <div> <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
Your Support Tickets </h2>


      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        View your support requests and continue a conversation with SOG
        Airways Support.
      </p>
    </div>

    {tickets.length > 0 && (
      <div className="hidden shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:flex">
        <Ticket className="h-3.5 w-3.5" />
        {tickets.length}{" "}
        {tickets.length === 1 ? "ticket" : "tickets"}
      </div>
    )}
  </div>

  {tickets.length === 0 ? (
    <EmptyTickets />
  ) : (
    <div className="space-y-3">
      {tickets.map((ticket, index) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        >
          <SupportTicketCard
            ticket={ticket}
            isSelected={selectedTicketId === ticket.id}
            onSelect={onSelectTicket}
          />
        </motion.div>
      ))}
    </div>
  )}
</section>


);
}

function EmptyTickets() {
return (
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-950/40"
> <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"> <Inbox className="h-5 w-5" /> </div>

```
  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
    No support tickets yet
  </h3>

  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
    When you contact SOG Airways Support, your support requests will
    appear here so you can follow their progress.
  </p>
</motion.div>


);
}
