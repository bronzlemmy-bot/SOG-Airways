"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
ChevronRight,
Mail,
Phone,
UserRound,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface CheckInPassenger {
id: string;
title?: string;
firstName: string;
lastName: string;
email?: string;
phone?: string;
passengerType?: string;
seatNumber?: string;
checkedIn?: boolean;
}

interface CheckInPassengerCardProps {
passenger: CheckInPassenger;
selected?: boolean;
onSelect?: (passenger: CheckInPassenger) => void;
}

export default function CheckInPassengerCard({
passenger,
selected = false,
onSelect,
}: CheckInPassengerCardProps) {
const fullName = [passenger.title, passenger.firstName, passenger.lastName]
.filter(Boolean)
.join(" ");

return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -2 }}
transition={{ duration: 0.3 }}
>
<Card
className={`overflow-hidden transition ${
          selected
            ? "border-sky-300 ring-2 ring-sky-100"
            : "border-slate-200"
        }`}
>
<button
type="button"
onClick={() => onSelect?.(passenger)}
className="w-full text-left"
aria-pressed={selected}
> <div className="p-5 sm:p-6"> <div className="flex items-start gap-4">
<div
className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  selected
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-500"
                }`}
> <UserRound className="h-5 w-5" /> </div>

```
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {fullName}
                  </h3>

                 {passenger.passengerType && ( <Badge variant="info">{passenger.passengerType}</Badge>
)}

                </div>

                {passenger.seatNumber && (
                  <p className="mt-1 text-sm text-slate-500">
                    Seat {passenger.seatNumber}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {passenger.checkedIn && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Checked In
                  </span>
                )}

                <ChevronRight
                  className={`h-5 w-5 transition ${
                    selected
                      ? "translate-x-0.5 text-sky-600"
                      : "text-slate-400"
                  }`}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {passenger.email && (
                <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Email
                    </p>
                    <p className="truncate text-sm font-medium text-slate-700">
                      {passenger.email}
                    </p>
                  </div>
                </div>
              )}

              {passenger.phone && (
                <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Phone
                    </p>
                    <p className="truncate text-sm font-medium text-slate-700">
                      {passenger.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  </Card>
</motion.div>


);
}
