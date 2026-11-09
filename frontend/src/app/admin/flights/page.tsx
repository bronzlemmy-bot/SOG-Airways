"use client";

import { useMemo, useState } from "react";

import FlightDetails from "@/components/admin/flights/FlightDetails";
import FlightFilters from "@/components/admin/flights/FlightFilters";
import FlightForm from "@/components/admin/flights/FlightForm";
import FlightHeader from "@/components/admin/flights/FlightHeader";
import FlightStats from "@/components/admin/flights/FlightStats";
import FlightTable from "@/components/admin/flights/FlightTable";

import {
adminFlightsData,
type AdminFlight,
type AdminFlightStatus,
type AdminFlightSummary,
} from "@/components/admin/flights/admin-flights-data/AdminFlightsData";

export default function FlightsPage() {
const [flights, setFlights] =
useState<AdminFlight[]>(adminFlightsData);

const [searchQuery, setSearchQuery] =
useState("");

const [statusFilter, setStatusFilter] =
useState<AdminFlightStatus | "all">("all");

const [aircraftFilter, setAircraftFilter] =
useState("all");

const [departureFilter, setDepartureFilter] =
useState("all");

const [arrivalFilter, setArrivalFilter] =
useState("all");

const [selectedFlight, setSelectedFlight] =
useState<AdminFlight | null>(null);

const [editingFlight, setEditingFlight] =
useState<AdminFlight | null>(null);

const [isFormOpen, setIsFormOpen] =
useState(false);

const aircraftTypes = useMemo(() => {
return Array.from(
new Set(
flights.map(
(flight) => flight.aircraftType,
),
),
).sort();
}, [flights]);

const airportCodes = useMemo(() => {
return Array.from(
new Set(
flights.flatMap((flight) => [
flight.departureAirportCode,
flight.arrivalAirportCode,
]),
),
).sort();
}, [flights]);

const summaries = useMemo<AdminFlightSummary[]>(
() => {
const total = flights.length;


  const scheduled = flights.filter(
    (flight) => flight.status === "scheduled",
  ).length;

  const boarding = flights.filter(
    (flight) => flight.status === "boarding",
  ).length;

  const delayed = flights.filter(
    (flight) => flight.status === "delayed",
  ).length;

  const cancelled = flights.filter(
    (flight) => flight.status === "cancelled",
  ).length;

  const revenue = flights.reduce(
    (totalRevenue, flight) =>
      totalRevenue +
      flight.baseFare * flight.bookedSeats,
    0,
  );

  return [
    {
      id: "total",
      label: "Total Flights",
      value: total.toLocaleString("en-NG"),
      description:
        "All flights currently managed in the system.",
      type: "total",
    },
    {
      id: "scheduled",
      label: "Scheduled",
      value: scheduled.toLocaleString("en-NG"),
      description:
        "Flights currently scheduled for departure.",
      type: "scheduled",
    },
    {
      id: "boarding",
      label: "Boarding",
      value: boarding.toLocaleString("en-NG"),
      description:
        "Flights currently in the boarding process.",
      type: "boarding",
    },
    {
      id: "delayed",
      label: "Delayed",
      value: delayed.toLocaleString("en-NG"),
      description:
        "Flights currently marked as delayed.",
      type: "delayed",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      value: cancelled.toLocaleString("en-NG"),
      description:
        "Flights currently marked as cancelled.",
      type: "cancelled",
    },
    {
      id: "revenue",
      label: "Booked Revenue",
      value: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(revenue),
      description:
        "Estimated revenue from currently booked seats.",
      type: "revenue",
    },
  ];
},
[flights],


);

const filteredFlights = useMemo(() => {
const query = searchQuery
.trim()
.toLowerCase();


return flights.filter((flight) => {
  const matchesSearch =
    query.length === 0 ||
    [
      flight.flightNumber,
      flight.airlineCode,
      flight.aircraftRegistration,
      flight.aircraftType,
      flight.departureAirport,
      flight.departureAirportCode,
      flight.departureCity,
      flight.arrivalAirport,
      flight.arrivalAirportCode,
      flight.arrivalCity,
    ].some((value) =>
      value.toLowerCase().includes(query),
    );

  const matchesStatus =
    statusFilter === "all" ||
    flight.status === statusFilter;

  const matchesAircraft =
    aircraftFilter === "all" ||
    flight.aircraftType === aircraftFilter;

  const matchesDeparture =
    departureFilter === "all" ||
    flight.departureAirportCode ===
      departureFilter;

  const matchesArrival =
    arrivalFilter === "all" ||
    flight.arrivalAirportCode ===
      arrivalFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesAircraft &&
    matchesDeparture &&
    matchesArrival
  );
});


}, [
flights,
searchQuery,
statusFilter,
aircraftFilter,
departureFilter,
arrivalFilter,
]);

const handleAddFlight = () => {
setEditingFlight(null);
setIsFormOpen(true);
};

const handleViewFlight = (
flight: AdminFlight,
) => {
setSelectedFlight(flight);
};

const handleEditFlight = (
flight: AdminFlight,
) => {
setSelectedFlight(null);
setEditingFlight(flight);
setIsFormOpen(true);
};

const handleDeleteFlight = (
flight: AdminFlight,
) => {
const confirmed = window.confirm(
`Are you sure you want to delete flight ${flight.flightNumber}?`,
);


if (!confirmed) {
  return;
}

setFlights((current) =>
  current.filter(
    (item) => item.id !== flight.id,
  ),
);

if (
  selectedFlight?.id === flight.id
) {
  setSelectedFlight(null);
}

if (
  editingFlight?.id === flight.id
) {
  setEditingFlight(null);
  setIsFormOpen(false);
}


};

const handleSaveFlight = (
flight: AdminFlight,
) => {
setFlights((current) => {
const exists = current.some(
(item) => item.id === flight.id,
);


  if (!exists) {
    return [flight, ...current];
  }

  return current.map((item) =>
    item.id === flight.id
      ? flight
      : item,
  );
});

setIsFormOpen(false);
setEditingFlight(null);
setSelectedFlight(null);


};

const handleCloseForm = () => {
setIsFormOpen(false);
setEditingFlight(null);
};

const handleClearFilters = () => {
setSearchQuery("");
setStatusFilter("all");
setAircraftFilter("all");
setDepartureFilter("all");
setArrivalFilter("all");
};

return ( <main className="min-h-screen bg-slate-50 dark:bg-slate-950"> <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8"> <FlightHeader
       onAddFlight={handleAddFlight}
     />


    <FlightStats summaries={summaries} />

    <FlightFilters
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      aircraftFilter={aircraftFilter}
      departureFilter={departureFilter}
      arrivalFilter={arrivalFilter}
      aircraftTypes={aircraftTypes}
      airportCodes={airportCodes}
      flights={flights}
      onSearchChange={setSearchQuery}
      onStatusChange={setStatusFilter}
      onAircraftChange={setAircraftFilter}
      onDepartureChange={setDepartureFilter}
      onArrivalChange={setArrivalFilter}
      onClearFilters={handleClearFilters}
    />

    <FlightTable
      flights={filteredFlights}
      onView={handleViewFlight}
      onEdit={handleEditFlight}
      onDelete={handleDeleteFlight}
    />
  </div>

  {selectedFlight && (
    <FlightDetails
      flight={selectedFlight}
      onClose={() =>
        setSelectedFlight(null)
      }
    />
  )}

  {isFormOpen && (
    <FlightForm
      key={editingFlight?.id ?? "new"}
      flight={editingFlight}
      onSubmit={handleSaveFlight}
      onClose={handleCloseForm}
    />
  )}
</main>


);
}
