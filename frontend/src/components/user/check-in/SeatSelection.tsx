"use client";

import { motion } from "framer-motion";
import {
Armchair,
Check,
Info,
Plane,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export type SeatStatus = "available" | "selected" | "occupied" | "unavailable";

export interface Seat {
id: string;
label: string;
row: number;
position: string;
status?: SeatStatus;
cabinClass?: string;
}

interface SeatSelectionProps {
seats: Seat[];
selectedSeatId?: string;
onSeatSelect?: (seat: Seat) => void;
disabled?: boolean;
}

export default function SeatSelection({
seats,
selectedSeatId,
onSeatSelect,
disabled = false,
}: SeatSelectionProps) {
const getSeatStatus = (seat: Seat): SeatStatus => {
if (selectedSeatId === seat.id) {
return "selected";
}


return seat.status ?? "available";


};

const getSeatButtonClasses = (status: SeatStatus) => {
switch (status) {
case "selected":
return "border-sky-500 bg-sky-600 text-white shadow-md shadow-sky-200";


  case "occupied":
    return "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400";

  case "unavailable":
    return "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300";

  default:
    return "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700";
}


};

const canSelectSeat = (seat: Seat) => {
const status = getSeatStatus(seat);

return (
  !disabled &&
  status !== "occupied" &&
  status !== "unavailable"
);


};

const groupedSeats = seats.reduce<Record<number, Seat[]>>(
(groups, seat) => {
if (!groups[seat.row]) {
groups[seat.row] = [];
}


  groups[seat.row].push(seat);

  return groups;
},
{},


);

const rows = Object.entries(groupedSeats).sort(
([rowA], [rowB]) => Number(rowA) - Number(rowB),
);

return (
<motion.div
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
> <Card className="overflow-hidden"> <div className="border-b border-slate-200 px-5 py-5 sm:px-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div className="flex items-start gap-4"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"> <Armchair className="h-5 w-5" /> </div>


          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Your Seat
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Choose an available seat for your flight.
            </p>
          </div>
        </div>

        <Badge variant="info">
          {selectedSeatId ? "Seat Selected" : "Select a Seat"}
        </Badge>
      </div>
    </div>

    <div className="p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-md border border-slate-200 bg-white" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-md bg-sky-600" />
          Selected
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-md border border-slate-200 bg-slate-100" />
          Occupied
        </div>
      </div>

      {seats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <Armchair className="mx-auto h-8 w-8 text-slate-400" />

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            No seat information available
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Seat availability will appear here when information is
            provided for this flight.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="mx-auto min-w-105 max-w-2xl">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                <Plane className="h-4 w-4 rotate-90 text-sky-600" />
                Front of Aircraft
              </div>
            </div>

            <div className="space-y-3">
              {rows.map(([row, rowSeats]) => {
                const sortedSeats = [...rowSeats].sort((a, b) =>
                  a.position.localeCompare(b.position),
                );

                const leftSeats = sortedSeats.slice(
                  0,
                  Math.ceil(sortedSeats.length / 2),
                );

                const rightSeats = sortedSeats.slice(
                  Math.ceil(sortedSeats.length / 2),
                );

                return (
                  <div
                    key={row}
                    className="grid grid-cols-[44px_1fr_32px_1fr] items-center gap-2"
                  >
                    <span className="text-center text-xs font-semibold text-slate-400">
                      {row}
                    </span>

                    <div className="flex justify-end gap-2">
                      {leftSeats.map((seat) => {
                        const status = getSeatStatus(seat);
                        const selectable = canSelectSeat(seat);

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!selectable}
                            onClick={() => onSeatSelect?.(seat)}
                            aria-label={`Seat ${seat.label}`}
                            aria-pressed={status === "selected"}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold transition ${getSeatButtonClasses(
                              status,
                            )}`}
                          >
                            {status === "selected" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              seat.label
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-center">
                      <span className="h-8 w-px bg-slate-200" />
                    </div>

                    <div className="flex justify-start gap-2">
                      {rightSeats.map((seat) => {
                        const status = getSeatStatus(seat);
                        const selectable = canSelectSeat(seat);

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!selectable}
                            onClick={() => onSeatSelect?.(seat)}
                            aria-label={`Seat ${seat.label}`}
                            aria-pressed={status === "selected"}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold transition ${getSeatButtonClasses(
                              status,
                            )}`}
                          >
                            {status === "selected" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              seat.label
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />

              <p className="text-xs leading-5 text-sky-800">
                Seat availability is supplied by the booking data. When
                connected to the backend, unavailable seats will be
                updated automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </Card>
</motion.div>


);
}
