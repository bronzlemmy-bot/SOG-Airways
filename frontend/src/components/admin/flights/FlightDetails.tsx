"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
CalendarDays,
Clock3,
Gauge,
Luggage,
MapPin,
Plane,
Users,
Wifi,
X,
} from "lucide-react";

import FlightStatusBadge from "./FlightStatusBadge";
import type { AdminFlight } from "./admin-flights-data/AdminFlightsData";

interface FlightDetailsProps {
flight: AdminFlight | null;
onClose: () => void;
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-US", {
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
}).format(new Date(date));
}

function formatCurrency(
amount: number,
currency: string,
) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

interface DetailItemProps {
label: string;
value: string;
icon?: React.ComponentType<{
className?: string;
}>;
}

function DetailItem({
label,
value,
icon: Icon,
}: DetailItemProps) {
return ( <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"> <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
{Icon && ( <Icon className="h-4 w-4 text-slate-400" />
)}
{label} </div>


  <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
    {value}
  </p>
</div>


);
}

export default function FlightDetails({
flight,
onClose,
}: FlightDetailsProps) {
return ( <AnimatePresence>
{flight && (
<motion.div
className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onClose();
}
}}
>
<motion.div
initial={{
opacity: 0,
y: 24,
scale: 0.97,
}}
animate={{
opacity: 1,
y: 0,
scale: 1,
}}
exit={{
opacity: 0,
y: 24,
scale: 0.97,
}}
transition={{
duration: 0.2,
ease: "easeOut",
}}
className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>

```
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {flight.flightNumber}
                </h2>

                <FlightStatusBadge
                  status={flight.status}
                />
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {flight.aircraftType} ·{" "}
                {flight.aircraftRegistration}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close flight details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="space-y-6 p-5 sm:p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {flight.departureAirportCode}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {flight.departureCity}
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    {flight.departureTime}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(
                      flight.departureDate,
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {flight.duration}
                  </span>

                  <div className="my-2 flex items-center gap-2 text-sky-500">
                    <span className="h-px w-10 bg-sky-200 dark:bg-sky-500/30" />
                    <Plane className="h-5 w-5" />
                    <span className="h-px w-10 bg-sky-200 dark:bg-sky-500/30" />
                  </div>

                  <span className="text-xs text-slate-400">
                    {flight.distance.toLocaleString()} km
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {flight.arrivalAirportCode}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {flight.arrivalCity}
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    {flight.arrivalTime}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(flight.arrivalDate)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Flight Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Aircraft"
                  value={flight.aircraftType}
                  icon={Plane}
                />

                <DetailItem
                  label="Registration"
                  value={flight.aircraftRegistration}
                  icon={Plane}
                />

                <DetailItem
                  label="Departure Terminal"
                  value={
                    flight.terminal ?? "Not assigned"
                  }
                  icon={MapPin}
                />

                <DetailItem
                  label="Departure Gate"
                  value={flight.gate ?? "Not assigned"}
                  icon={MapPin}
                />

                <DetailItem
                  label="Duration"
                  value={flight.duration}
                  icon={Clock3}
                />

                <DetailItem
                  label="Distance"
                  value={`${flight.distance.toLocaleString()} km`}
                  icon={Gauge}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Seat Availability
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  label="Total Seats"
                  value={flight.totalSeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="Booked Seats"
                  value={flight.bookedSeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="Available Seats"
                  value={flight.availableSeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="Economy"
                  value={flight.economySeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="Premium Economy"
                  value={flight.premiumEconomySeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="Business"
                  value={flight.businessSeats.toString()}
                  icon={Users}
                />

                <DetailItem
                  label="First Class"
                  value={flight.firstClassSeats.toString()}
                  icon={Users}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Passenger Services
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Baggage Allowance"
                  value={flight.baggageAllowance}
                  icon={Luggage}
                />

                <DetailItem
                  label="Meal Service"
                  value={
                    flight.mealService
                      ? "Available"
                      : "Not available"
                  }
                  icon={Luggage}
                />

                <DetailItem
                  label="Wi-Fi"
                  value={
                    flight.wifiAvailable
                      ? "Available"
                      : "Not available"
                  }
                  icon={Wifi}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Fare Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Base Fare"
                  value={formatCurrency(
                    flight.baseFare,
                    flight.currency,
                  )}
                />

                <DetailItem
                  label="Estimated Booked Revenue"
                  value={formatCurrency(
                    flight.baseFare *
                      flight.bookedSeats,
                    flight.currency,
                  )}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Flight record
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    Created {formatDate(flight.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Updated {formatDate(flight.updatedAt)}
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


);
}
