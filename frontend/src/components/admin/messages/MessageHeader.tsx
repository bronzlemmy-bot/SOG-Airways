"use client";

import {
Inbox,
Mail,
Plus,
} from "lucide-react";

import type {
AdminMessageSummary,
} from "./admin-messages-data/AdminMessagesData";

interface MessageHeaderProps {
summaries: AdminMessageSummary[];
onCompose: () => void;
}

function getSummaryIcon(
type: AdminMessageSummary["type"],
) {
if (type === "unread") {
return Mail;
}

if (type === "urgent") {
return Inbox;
}

return Mail;
}

function getSummaryStyle(
type: AdminMessageSummary["type"],
) {
if (type === "unread") {
return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400";
}

if (type === "urgent") {
return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
}

if (type === "read") {
return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
}

return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function MessageHeader({
summaries,
onCompose,
}: MessageHeaderProps) {
return ( <header className="space-y-5"> <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"> <div> <div className="flex items-center gap-2"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400"> <Inbox className="h-5 w-5" /> </div>

```
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Messages
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage customer conversations and
            respond to their requests.
          </p>
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={onCompose}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 sm:w-auto"
    >
      <Plus className="h-4 w-4" />
      New Message
    </button>
  </div>

  {summaries.length > 0 && (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {summaries.map((summary) => {
        const Icon = getSummaryIcon(
          summary.type,
        );

        return (
          <div
            key={summary.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${getSummaryStyle(
                  summary.type,
                )}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {summary.value}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {summary.label}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {summary.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )}
</header>


);
}
