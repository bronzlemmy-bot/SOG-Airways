"use client";

import {
Search,
SlidersHorizontal,
X,
} from "lucide-react";

import type {
AdminFlightStatus,
AdminFlight,
} from "./admin-flights-data/AdminFlightsData";

interface FlightFiltersProps {
searchQuery: string;
statusFilter: AdminFlightStatus | "all";
aircraftFilter: string;
departureFilter: string;
arrivalFilter: string;
aircraftTypes: string[];
airportCodes: string[];
flights: AdminFlight[];
onSearchChange: (value: string) => void;
onStatusChange: (
value: AdminFlightStatus | "all",
) => void;
onAircraftChange: (value: string) => void;
onDepartureChange: (value: string) => void;
onArrivalChange: (value: string) => void;
onClearFilters: () => void;
}

export default function FlightFilters({
searchQuery,
statusFilter,
aircraftFilter,
departureFilter,
arrivalFilter,
aircraftTypes,
airportCodes,
flights,
onSearchChange,
onStatusChange,
onAircraftChange,
onDepartureChange,
onArrivalChange,
onClearFilters,
}: FlightFiltersProps) {
const hasActiveFilters =
searchQuery.trim() !== "" ||
statusFilter !== "all" ||
aircraftFilter !== "all" ||
departureFilter !== "all" ||
arrivalFilter !== "all";

const uniqueDepartureAirports = Array.from(
new Set(
flights.map(
(flight) => flight.departureAirportCode,
),
),
).sort();

const uniqueArrivalAirports = Array.from(
new Set(
flights.map(
(flight) => flight.arrivalAirportCode,
),
),
).sort();

const departures =
airportCodes.length > 0
? airportCodes
: uniqueDepartureAirports;

const arrivals =
airportCodes.length > 0
? airportCodes
: uniqueArrivalAirports;

return ( <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="flex flex-col gap-4"> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"> <SlidersHorizontal className="h-4 w-4" /> </div>

```
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Flight Filters
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search and filter flight records
        </p>
      </div>
    </div>

    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div className="relative xl:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search flights..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as
              | AdminFlightStatus
              | "all",
          )
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="all">All Statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="boarding">Boarding</option>
        <option value="departed">Departed</option>
        <option value="arrived">Arrived</option>
        <option value="delayed">Delayed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={aircraftFilter}
        onChange={(event) =>
          onAircraftChange(event.target.value)
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="all">All Aircraft</option>

        {aircraftTypes.map((aircraftType) => (
          <option
            key={aircraftType}
            value={aircraftType}
          >
            {aircraftType}
          </option>
        ))}
      </select>

      <select
        value={departureFilter}
        onChange={(event) =>
          onDepartureChange(event.target.value)
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="all">
          All Departure Airports
        </option>

        {departures.map((airportCode) => (
          <option
            key={airportCode}
            value={airportCode}
          >
            {airportCode}
          </option>
        ))}
      </select>

      <select
        value={arrivalFilter}
        onChange={(event) =>
          onArrivalChange(event.target.value)
        }
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="all">
          All Arrival Airports
        </option>

        {arrivals.map((airportCode) => (
          <option
            key={airportCode}
            value={airportCode}
          >
            {airportCode}
          </option>
        ))}
      </select>
    </div>

    {hasActiveFilters && (
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Active filters are applied.
        </p>

        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      </div>
    )}
  </div>
</div>


);
}
