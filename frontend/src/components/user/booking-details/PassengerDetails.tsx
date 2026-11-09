"use client";

import { motion } from "framer-motion";
import { Mail, Phone, UserRound, Users } from "lucide-react";

export interface PassengerDetailsData {
id?: string;
title?: string;
firstName?: string;
lastName?: string;
email?: string;
phone?: string;
passengerType?: string;
seatNumber?: string;
}

interface PassengerDetailsProps {
passengers: PassengerDetailsData[];
}

export default function PassengerDetails({
passengers,
}: PassengerDetailsProps) {
return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <Users className="h-5 w-5" /> </div>

```
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Passenger Details
        </h2>

        <p className="text-sm text-slate-500">
          Passengers included in this booking
        </p>
      </div>
    </div>
  </div>

  {passengers.length === 0 ? (
    <div className="px-5 py-10 text-center sm:px-6">
      <UserRound className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-3 text-sm font-medium text-slate-700">
        No passenger information available
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Passenger details will appear here when available.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-slate-100">
      {passengers.map((passenger, index) => {
        const fullName = [
          passenger.title,
          passenger.firstName,
          passenger.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <motion.div
            key={passenger.id || index}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: Math.min(index * 0.06, 0.3),
            }}
            className="px-5 py-5 sm:px-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <UserRound className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {fullName || "Passenger"}
                    </h3>

                    {passenger.passengerType && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        {passenger.passengerType}
                      </span>
                    )}
                  </div>

                  {passenger.seatNumber && (
                    <p className="mt-1 text-xs text-slate-500">
                      Seat{" "}
                      <span className="font-medium text-slate-700">
                        {passenger.seatNumber}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-500 sm:text-right">
                {passenger.email && (
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                    <span className="break-all">
                      {passenger.email}
                    </span>
                  </div>
                )}

                {passenger.phone && (
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                    <span>
                      {passenger.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  )}
</motion.section>


);
}
