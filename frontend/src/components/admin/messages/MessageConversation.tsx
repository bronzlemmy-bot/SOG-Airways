"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
Archive,
ArrowLeft,
CalendarDays,
Check,
Clock3,
Mail,
Plane,
Reply,
User,
} from "lucide-react";

import type {
AdminMessageConversation,
} from "./admin-messages-data/AdminMessagesData";

interface MessageConversationProps {
conversation: AdminMessageConversation | null;
onBack: () => void;
onMarkAsRead: () => void;
onArchive: () => void;
}

function formatMessageDate(dateString: string) {
const date = new Date(dateString);

if (Number.isNaN(date.getTime())) {
return "";
}

return new Intl.DateTimeFormat("en-NG", {
month: "short",
day: "numeric",
year: "numeric",
hour: "numeric",
minute: "2-digit",
}).format(date);
}

function getInitials(name: string) {
return name
.split(" ")
.map((part) => part.charAt(0))
.slice(0, 2)
.join("")
.toUpperCase();
}

function getPriorityStyle(
priority: AdminMessageConversation["priority"],
) {
if (priority === "urgent") {
return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
}

if (priority === "high") {
return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
}

if (priority === "low") {
return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
}

return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400";
}

function getTypeLabel(
type: AdminMessageConversation["type"],
) {
if (type === "booking") {
return "Booking";
}

if (type === "flight") {
return "Flight";
}

if (type === "payment") {
return "Payment";
}

if (type === "support") {
return "Support";
}

if (type === "complaint") {
return "Complaint";
}

return "General";
}

export default function MessageConversation({
conversation,
onBack,
onMarkAsRead,
onArchive,
}: MessageConversationProps) {
if (!conversation) {
return ( <section className="flex min-h-150 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="max-w-sm text-center"> <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800"> <Mail className="h-6 w-6" /> </div>

```
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        Select a conversation
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Select a message from the list to view the
        full conversation and customer details.
      </p>
    </div>
  </section>
);


}

const customerInitials = getInitials(
conversation.customerName,
);

return ( <section className="flex min-h-150 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="border-b border-slate-200 dark:border-slate-800"> <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"> <button
         type="button"
         onClick={onBack}
         className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
       > <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">
Back </span> </button>


      <div className="flex items-center gap-2">
        {conversation.status === "unread" && (
          <button
            type="button"
            onClick={onMarkAsRead}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Check className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              Mark as read
            </span>
          </button>
        )}

        {conversation.status !== "archived" && (
          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Archive className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              Archive
            </span>
          </button>
        )}
      </div>
    </div>

    <div className="px-4 pb-4 sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
          {customerInitials}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">
            {conversation.subject}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {conversation.customerName}
            </span>

            <span className="hidden sm:inline">
              •
            </span>

            <span>
              {conversation.customerEmail}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {getTypeLabel(conversation.type)}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityStyle(
            conversation.priority,
          )}`}
        >
          {conversation.priority
            .charAt(0)
            .toUpperCase() +
            conversation.priority.slice(1)}
        </span>

        {conversation.bookingReference && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
            Booking:{" "}
            {conversation.bookingReference}
          </span>
        )}

        {conversation.flightNumber && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            Flight: {conversation.flightNumber}
          </span>
        )}
      </div>
    </div>
  </div>

  <div className="flex-1 overflow-y-auto bg-slate-50/70 px-4 py-5 dark:bg-slate-950/40 sm:px-6">
    <div className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        Started{" "}
        {formatMessageDate(
          conversation.createdAt,
        )}
      </span>

      <span className="hidden sm:inline">
        •
      </span>

      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5" />
        Updated{" "}
        {formatMessageDate(
          conversation.updatedAt,
        )}
      </span>
    </div>

    <div className="space-y-5">
      <AnimatePresence initial={false}>
        {conversation.messages.map(
          (message, index) => {
            const isAdmin =
              message.senderRole === "admin";

            return (
              <motion.div
                key={message.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.04,
                }}
                className={`flex ${
                  isAdmin
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[88%] gap-2.5 sm:max-w-[75%] ${
                    isAdmin
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isAdmin
                        ? "bg-sky-600 text-white"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {getInitials(
                      message.senderName,
                    )}
                  </div>

                  <div
                    className={`min-w-0 ${
                      isAdmin
                        ? "items-end"
                        : "items-start"
                    } flex flex-col`}
                  >
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {message.senderName}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {formatMessageDate(
                          message.createdAt,
                        )}
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        isAdmin
                          ? "rounded-tr-md bg-sky-600 text-white"
                          : "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                    >
                      {message.message}
                    </div>

                    {message.read && isAdmin && (
                      <span className="mt-1 inline-flex items-center gap-1 px-1 text-[10px] text-slate-400">
                        <Check className="h-3 w-3" />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          },
        )}
      </AnimatePresence>
    </div>
  </div>

  <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5">
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <Reply className="h-3.5 w-3.5" />

      <span>
        Reply to {conversation.customerName}
      </span>

      {conversation.flightNumber && (
        <>
          <span>•</span>
          <Plane className="h-3.5 w-3.5" />
          <span>{conversation.flightNumber}</span>
        </>
      )}
    </div>
  </div>
</section>


);
}
