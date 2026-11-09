"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
Circle,
Clock3,
Plane,
} from "lucide-react";

export interface BookingTimelineItem {
id?: string;
title: string;
description?: string;
date?: string;
time?: string;
status?: string;
completed?: boolean;
}

interface BookingTimelineProps {
timeline: BookingTimelineItem[];
}

const formatDate = (value?: string) => {
if (!value) {
return "";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(date);
};

export default function BookingTimeline({
timeline,
}: BookingTimelineProps) {
return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <Clock3 className="h-5 w-5" /> </div>

```
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Booking Timeline
        </h2>

        <p className="text-sm text-slate-500">
          Important updates for this booking
        </p>
      </div>
    </div>
  </div>

  {timeline.length === 0 ? (
    <div className="px-5 py-10 text-center sm:px-6">
      <Plane className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-3 text-sm font-medium text-slate-700">
        No timeline information available
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Booking updates will appear here when available.
      </p>
    </div>
  ) : (
    <div className="p-5 sm:p-6">
      <div className="relative">
        {timeline.map((item, index) => {
          const normalizedStatus = item.status
            ?.trim()
            .toLowerCase();

          const isCompleted =
            item.completed === true ||
            normalizedStatus === "completed";

          const isLast =
            index === timeline.length - 1;

          return (
            <motion.div
              key={item.id ?? `${item.title}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
              }}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {!isLast && (
                <div
                  className={`absolute left-2.75 top-6 h-[calc(100%-8px)] w-px ${
                    isCompleted
                      ? "bg-emerald-200"
                      : "bg-slate-200"
                  }`}
                />
              )}

              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : index === 0 ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900">
                    <Circle className="h-2.5 w-2.5 fill-white text-white" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-slate-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {(item.date || item.time) && (
                    <div className="shrink-0 text-left sm:text-right">
                      {item.date && (
                        <p className="text-xs font-medium text-slate-600">
                          {formatDate(item.date)}
                        </p>
                      )}

                      {item.time && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.time}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {item.status && (
                  <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {item.status}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )}
</motion.section>


);
}
