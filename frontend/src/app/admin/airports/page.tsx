"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AirportDetails from "@/components/admin/airports/AirportDetails";
import AirportFilters from "@/components/admin/airports/AirportFilters";
import AirportForm from "@/components/admin/airports/AirportForm";
import AirportHeader from "@/components/admin/airports/AirportHeader";
import AirportStats from "@/components/admin/airports/AirportStats";
import AirportTable from "@/components/admin/airports/AirportTable";

import {
airportSummary,
airportsData,
type Airport,
type AirportStatus,
type AirportType,
} from "@/components/admin/airports/airports-data/AirportsData";

export default function AirportsPage() {
const [airports, setAirports] = useState<Airport[]>(airportsData);

const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState<AirportStatus | "all">(
"all",
);
const [typeFilter, setTypeFilter] = useState<AirportType | "all">("all");
const [countryFilter, setCountryFilter] = useState("all");

const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
const [editingAirport, setEditingAirport] = useState<Airport | null>(null);

const [showForm, setShowForm] = useState(false);
const [showDetails, setShowDetails] = useState(false);

const countries = useMemo(() => {
return Array.from(
new Set(airports.map((airport) => airport.country)),
).sort((a, b) => a.localeCompare(b));
}, [airports]);

const filteredAirports = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


return airports.filter((airport) => {
  const matchesSearch =
    !query ||
    airport.name.toLowerCase().includes(query) ||
    airport.code.toLowerCase().includes(query) ||
    airport.city.toLowerCase().includes(query) ||
    airport.country.toLowerCase().includes(query);

  const matchesStatus =
    statusFilter === "all" || airport.status === statusFilter;

  const matchesType =
    typeFilter === "all" || airport.airportType === typeFilter;

  const matchesCountry =
    countryFilter === "all" || airport.country === countryFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesType &&
    matchesCountry
  );
});


}, [
airports,
searchQuery,
statusFilter,
typeFilter,
countryFilter,
]);

const handleAddAirport = () => {
setEditingAirport(null);
setShowForm(true);
};

const handleViewAirport = (airport: Airport) => {
setSelectedAirport(airport);
setShowDetails(true);
};

const handleEditAirport = (airport: Airport) => {
setEditingAirport(airport);
setShowForm(true);
};

const handleDeleteAirport = (airport: Airport) => {
const confirmed = window.confirm(
`Are you sure you want to delete ${airport.name} (${airport.code})?`,
);


if (!confirmed) {
  return;
}

setAirports((currentAirports) =>
  currentAirports.filter((item) => item.id !== airport.id),
);

if (selectedAirport?.id === airport.id) {
  setSelectedAirport(null);
  setShowDetails(false);
}

if (editingAirport?.id === airport.id) {
  setEditingAirport(null);
  setShowForm(false);
}


};

const handleSaveAirport = (airport: Airport) => {
setAirports((currentAirports) => {
const exists = currentAirports.some(
(item) => item.id === airport.id,
);


  if (exists) {
    return currentAirports.map((item) =>
      item.id === airport.id ? airport : item,
    );
  }

  return [airport, ...currentAirports];
});

setEditingAirport(null);
setShowForm(false);


};

const handleClearFilters = () => {
setSearchQuery("");
setStatusFilter("all");
setTypeFilter("all");
setCountryFilter("all");
};

return ( <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8"> <div className="mx-auto max-w-[1600px] space-y-6"> <AirportHeader onAddAirport={handleAddAirport} />

```
    <AirportStats summaries={airportSummary} />

    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="space-y-4"
    >
      <AirportFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        countryFilter={countryFilter}
        countries={countries}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onCountryChange={setCountryFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Airport Directory
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredAirports.length} of {airports.length} airports
          </p>
        </div>

        {(searchQuery ||
          statusFilter !== "all" ||
          typeFilter !== "all" ||
          countryFilter !== "all") && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-fit text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            Clear all filters
          </button>
        )}
      </div>

      <AirportTable
        airports={filteredAirports}
        onView={handleViewAirport}
        onEdit={handleEditAirport}
        onDelete={handleDeleteAirport}
      />
    </motion.section>
  </div>

  <AnimatePresence>
    {showForm && (
      <AirportForm
        key={editingAirport?.id ?? "new"}
        airport={editingAirport}
        onSubmit={handleSaveAirport}
        onClose={() => {
          setShowForm(false);
          setEditingAirport(null);
        }}
      />
    )}
  </AnimatePresence>

  <AnimatePresence>
    {showDetails && (
      <AirportDetails
        airport={selectedAirport}
        onClose={() => {
          setShowDetails(false);
          setSelectedAirport(null);
        }}
      />
    )}
  </AnimatePresence>
</main>


);
}
