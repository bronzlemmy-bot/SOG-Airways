"use client";

import { motion } from "framer-motion";
import {
Armchair,
CheckCircle2,
Luggage,
Plane,
UserRound,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface CheckInSummaryPassenger {
id: string;
firstName: string;
lastName: string;
title?: string;
passengerType?: string;
}

export interface CheckInSummarySeat {
id: string;
label: string;
cabinClass?: string;
}

export interface CheckInSummaryBaggage {
baggageId: string;
name: string;
quantity: number;
weight?: number;
weightUnit?: string;
}

interface CheckInSummaryProps {
passenger?: CheckInSummaryPassenger;
seat?: CheckInSummarySeat;
baggage?: CheckInSummaryBaggage[];
bookingReference?: string;
flightNumber?: string;
originCode?: string;
destinationCode?: string;
isReady?: boolean;
}

export default function CheckInSummary({
passenger,
seat,
baggage = [],
bookingReference,
flightNumber,
originCode,
destinationCode,
isReady = false,
}: CheckInSummaryProps) {
const totalBaggageItems = baggage.reduce(
(total, item) => total + item.quantity,
0
);

return (
<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="space-y-5"
> <div> <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
Check-In Summary </h2> <p className="mt-1 text-sm text-slate-500">
Review your selections before completing online check-in. </p> </div>

```
  <Card className="overflow-hidden">
    <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Booking
          </p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {bookingReference || "—"}
          </p>
        </div>

        {isReady ? (
          <Badge variant="success">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Ready to check in
            </span>
          </Badge>
        ) : (
          <Badge variant="warning">Review required</Badge>
        )}
      </div>
    </div>

    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <Plane className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Flight
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {flightNumber || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {originCode || "—"} → {destinationCode || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <UserRound className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Passenger
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {passenger
                ? `${passenger.title ? `${passenger.title} ` : ""}${passenger.firstName} ${passenger.lastName}`
                : "—"}
            </p>
            {passenger?.passengerType && (
              <p className="mt-1 text-sm text-slate-500">
                {passenger.passengerType}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <Armchair className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Seat
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {seat?.label || "Not selected"}
            </p>
            {seat?.cabinClass && (
              <p className="mt-1 text-sm text-slate-500">
                {seat.cabinClass}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2">
            <Luggage className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Baggage
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {totalBaggageItems > 0
                ? `${totalBaggageItems} item${totalBaggageItems === 1 ? "" : "s"}`
                : "No additional baggage"}
            </p>
          </div>
        </div>
      </div>
    </div>

    {baggage.length > 0 && (
      <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Selected baggage
        </h3>

        <div className="mt-3 space-y-2">
          {baggage.map((item) => (
            <div
              key={item.baggageId}
              className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-medium text-slate-700">
                {item.name} × {item.quantity}
              </span>

              {item.weight !== undefined && (
                <span className="text-sm text-slate-500">
                  {item.weight} {item.weightUnit || "kg"} each
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </Card>
</motion.section>


);
}
