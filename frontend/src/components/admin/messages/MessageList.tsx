"use client";

import { motion } from "framer-motion";
import {
Archive,
CheckCheck,
Mail,
MailOpen,
Search,
} from "lucide-react";

import type {
AdminMessage,
AdminMessageStatus,
} from "./admin-messages-data/AdminMessagesData";

interface MessageListProps {
messages: AdminMessage[];
selectedMessageId: string | null;
searchQuery: string;
statusFilter: AdminMessageStatus | "all";
onSearchChange: (value: string) => void;
onStatusChange: (
value: AdminMessageStatus | "all",
) => void;
onSelectMessage: (message: AdminMessage) => void;
}

function formatMessageTime(dateString: string) {
const date = new Date(dateString);

if (Number.isNaN(date.getTime())) {
return "";
}

return new Intl.DateTimeFormat("en-NG", {
month: "short",
day: "numeric",
hour: "numeric",
minute: "2-digit",
}).format(date);
}

function getTypeLabel(type: AdminMessage["type"]) {
switch (type) {
case "booking":
return "Booking";
case "flight":
return "Flight";
case "payment":
return "Payment";
case "support":
return "Support";
case "complaint":
return "Complaint";
default:
return "General";
}
}

function getPriorityStyle(
priority: AdminMessage["priority"],
) {
switch (priority) {
case "urgent":
return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";


case "high":
  return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";

case "low":
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

default:
  return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400";


}
}

export default function MessageList({
messages,
selectedMessageId,
searchQuery,
statusFilter,
onSearchChange,
onStatusChange,
onSelectMessage,
}: MessageListProps) {
const statusOptions = [
{
value: "all" as const,
label: "All",
},
{
value: "unread" as const,
label: "Unread",
},
{
value: "read" as const,
label: "Read",
},
{
value: "archived" as const,
label: "Archived",
},
];

return ( <section className="flex min-h-150 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="border-b border-slate-200 p-4 dark:border-slate-800"> <div className="relative"> <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />


      <input
        type="search"
        value={searchQuery}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search messages..."
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
      />
    </div>

    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
      {statusOptions.map((option) => {
        const isActive =
          statusFilter === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onStatusChange(option.value)
            }
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>

  <div className="flex-1 overflow-y-auto">
    {messages.length === 0 ? (
      <div className="flex min-h-105 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Mail className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
          No messages found
        </h3>

        <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
          Try changing your search or message
          status filter.
        </p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {messages.map((message, index) => {
          const isSelected =
            selectedMessageId === message.id;

          const isUnread =
            message.status === "unread";

          const initials = message.senderName
            .split(" ")
            .map((part) =>
              part.charAt(0),
            )
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <motion.button
              key={message.id}
              type="button"
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.2,
                delay: index * 0.025,
              }}
              onClick={() =>
                onSelectMessage(message)
              }
              className={`block w-full border-l-2 p-4 text-left transition ${
                isSelected
                  ? "border-l-sky-500 bg-sky-50/80 dark:bg-sky-500/10"
                  : "border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isUnread
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`truncate text-sm ${
                        isUnread
                          ? "font-bold text-slate-900 dark:text-white"
                          : "font-semibold text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {message.senderName}
                    </p>

                    <span className="shrink-0 text-[11px] text-slate-400">
                      {formatMessageTime(
                        message.createdAt,
                      )}
                    </span>
                  </div>

                  <p
                    className={`mt-1 truncate text-sm ${
                      isUnread
                        ? "font-semibold text-slate-800 dark:text-slate-200"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {message.subject}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {message.message}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {getTypeLabel(
                        message.type,
                      )}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${getPriorityStyle(
                        message.priority,
                      )}`}
                    >
                      {message.priority
                        .charAt(0)
                        .toUpperCase() +
                        message.priority.slice(1)}
                    </span>

                    <span className="ml-auto text-slate-400">
                      {message.status ===
                      "archived" ? (
                        <Archive className="h-3.5 w-3.5" />
                      ) : message.status ===
                        "unread" ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : (
                        <MailOpen className="h-3.5 w-3.5" />
                      )}
                    </span>

                    {message.status ===
                      "read" && (
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    )}
  </div>
</section>


);
}
