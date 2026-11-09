"use client";

import { useMemo, useState } from "react";

import AircraftDetails from "@/components/admin/aircraft/AircraftDetails";
import AircraftFilters from "@/components/admin/aircraft/AircraftFilters";
import AircraftForm from "@/components/admin/aircraft/AircraftForm";
import AircraftHeader from "@/components/admin/aircraft/AircraftHeader";
import AircraftStats from "@/components/admin/aircraft/AircraftStats";
import AircraftTable from "@/components/admin/aircraft/AircraftTable";

import type {
Aircraft,
AircraftStatus,
AircraftType,
} from "@/components/admin/aircraft/aircraft-data/AircraftData";

import {
aircraftData,
aircraftSummary,
} from "@/components/admin/aircraft/aircraft-data/AircraftData";

export default function AircraftPage() {
const [aircraft, setAircraft] = useState<Aircraft[]>(aircraftData);

const [searchQuery, setSearchQuery] = useState("");

const [selectedStatus, setSelectedStatus] = useState<
AircraftStatus | "all"

> ("all");

const [selectedType, setSelectedType] = useState<
AircraftType | "all"

> ("all");

const [selectedAirport, setSelectedAirport] = useState("all");

const [showForm, setShowForm] = useState(false);

const [editingAircraft, setEditingAircraft] =
useState<Aircraft | null>(null);

const [selectedAircraft, setSelectedAircraft] =
useState<Aircraft | null>(null);

const filteredAircraft = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


return aircraft.filter((item) => {
  const matchesSearch =
    !query ||
    item.registration.toLowerCase().includes(query) ||
    item.aircraftType.toLowerCase().includes(query) ||
    item.model.toLowerCase().includes(query) ||
    item.manufacturer.toLowerCase().includes(query) ||
    item.currentAirport.toLowerCase().includes(query) ||
    item.currentAirportCode.toLowerCase().includes(query) ||
    item.nextFlight?.toLowerCase().includes(query) ||
    item.nextFlightNumber?.toLowerCase().includes(query);

  const matchesStatus =
    selectedStatus === "all" ||
    item.status === selectedStatus;

  const matchesType =
    selectedType === "all" ||
    item.aircraftType === selectedType;

  const matchesAirport =
    selectedAirport === "all" ||
    item.currentAirportCode === selectedAirport;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesType &&
    matchesAirport
  );
});


}, [
aircraft,
searchQuery,
selectedStatus,
selectedType,
selectedAirport,
]);

const summaries = useMemo(() => {
const total = aircraft.length;


const active = aircraft.filter(
  (item) => item.status === "active",
).length;

const maintenance = aircraft.filter(
  (item) => item.status === "maintenance",
).length;

const inactive = aircraft.filter(
  (item) => item.status === "inactive",
).length;

return aircraftSummary.map((summary) => {
  if (summary.type === "total") {
    return {
      ...summary,
      value: String(total),
    };
  }

  if (summary.type === "active") {
    return {
      ...summary,
      value: String(active),
    };
  }

  if (summary.type === "maintenance") {
    return {
      ...summary,
      value: String(maintenance),
    };
  }

  return {
    ...summary,
    value: String(inactive),
  };
});


}, [aircraft]);

function handleAddAircraft() {
setEditingAircraft(null);
setShowForm(true);
}

function handleViewAircraft(item: Aircraft) {
setSelectedAircraft(item);
}

function handleEditAircraft(item: Aircraft) {
setSelectedAircraft(null);
setEditingAircraft(item);
setShowForm(true);
}

function handleDeleteAircraft(item: Aircraft) {
const confirmed = window.confirm(
`Are you sure you want to delete aircraft ${item.registration}?`,
);


if (!confirmed) {
  return;
}

setAircraft((current) =>
  current.filter(
    (aircraftItem) => aircraftItem.id !== item.id,
  ),
);

if (selectedAircraft?.id === item.id) {
  setSelectedAircraft(null);
}


}

function handleSubmitAircraft(item: Aircraft) {
setAircraft((current) => {
const exists = current.some(
(aircraftItem) => aircraftItem.id === item.id,
);


  if (exists) {
    return current.map((aircraftItem) =>
      aircraftItem.id === item.id ? item : aircraftItem,
    );
  }

  return [item, ...current];
});

setShowForm(false);
setEditingAircraft(null);


}

function handleCancelForm() {
setShowForm(false);
setEditingAircraft(null);
}

function handleResetFilters() {
setSearchQuery("");
setSelectedStatus("all");
setSelectedType("all");
setSelectedAirport("all");
}

return ( <main className="min-h-screen bg-slate-50 dark:bg-slate-950"> <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"> <div className="space-y-6"> <AircraftHeader
         onAddAircraft={handleAddAircraft}
       />


      <AircraftStats summaries={summaries} />

      <AircraftFilters
        aircraft={aircraft}
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        selectedAirport={selectedAirport}
        onSearchChange={setSearchQuery}
        onStatusChange={setSelectedStatus}
        onTypeChange={setSelectedType}
        onAirportChange={setSelectedAirport}
        onReset={handleResetFilters}
      />

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Aircraft Fleet
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredAircraft.length} of{" "}
              {aircraft.length} aircraft
            </p>
          </div>
        </div>

        <AircraftTable
          aircraft={filteredAircraft}
          onView={handleViewAircraft}
          onEdit={handleEditAircraft}
          onDelete={handleDeleteAircraft}
        />
      </section>
    </div>
  </div>

  {showForm && (
    <AircraftForm
      aircraft={editingAircraft}
      onSubmit={handleSubmitAircraft}
      onCancel={handleCancelForm}
    />
  )}

  {selectedAircraft && (
    <AircraftDetails
      aircraft={selectedAircraft}
      onEdit={handleEditAircraft}
      onClose={() => setSelectedAircraft(null)}
    />
  )}
</main>


);
}
