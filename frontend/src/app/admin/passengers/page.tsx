"use client";

import { useMemo, useState } from "react";

import PassengerCards from "@/components/admin/passengers/PassengerCard";
import PassengerDetails from "@/components/admin/passengers/PassengerDetails";
import PassengerFilters, {
type PassengerFilterValues,
} from "@/components/admin/passengers/PassengerFilters";
import PassengerForm, {
type PassengerFormData,
} from "@/components/admin/passengers/PassengerForm";
import PassengerHeader from "@/components/admin/passengers/PassengerHeader";
import PassengerStats from "@/components/admin/passengers/PassengerStats";
import PassengerTable from "@/components/admin/passengers/PassengerTable";

import {
adminPassengerData,
type AdminPassenger,
} from "@/components/admin/passengers/admin-passengers-data/AdminPassengersData";

const DEFAULT_FILTERS: PassengerFilterValues = {
search: "",
status: "all",
nationality: "",
sortBy: "newest",
};

export default function PassengersPage() {
const [passengers, setPassengers] =
useState<AdminPassenger[]>(adminPassengerData);

const [filters, setFilters] =
useState<PassengerFilterValues>(DEFAULT_FILTERS);

const [selectedPassenger, setSelectedPassenger] =
useState<AdminPassenger | null>(null);

const [isFormOpen, setIsFormOpen] = useState(false);
const [isDetailsOpen, setIsDetailsOpen] = useState(false);
const [editingPassenger, setEditingPassenger] =
useState<AdminPassenger | null>(null);

const nationalities = useMemo(() => {
return Array.from(
new Set(passengers.map((passenger) => passenger.nationality)),
).sort((a, b) => a.localeCompare(b));
}, [passengers]);

const filteredPassengers = useMemo(() => {
const search = filters.search.trim().toLowerCase();


const result = passengers.filter((passenger) => {
  const fullName =
    `${passenger.firstName} ${passenger.lastName}`.toLowerCase();

  const matchesSearch =
    search === "" ||
    fullName.includes(search) ||
    passenger.passengerId.toLowerCase().includes(search) ||
    passenger.email.toLowerCase().includes(search) ||
    passenger.phone.toLowerCase().includes(search) ||
    passenger.passportNumber.toLowerCase().includes(search);

  const matchesStatus =
    filters.status === "all" ||
    passenger.status === filters.status;

  const matchesNationality =
    filters.nationality === "" ||
    passenger.nationality === filters.nationality;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesNationality
  );
});

return [...result].sort((a, b) => {
  switch (filters.sortBy) {
    case "oldest":
      return (
        new Date(a.registeredAt).getTime() -
        new Date(b.registeredAt).getTime()
      );

    case "name-asc":
      return `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
      );

    case "name-desc":
      return `${b.firstName} ${b.lastName}`.localeCompare(
        `${a.firstName} ${a.lastName}`,
      );

    case "bookings-high":
      return b.totalBookings - a.totalBookings;

    case "bookings-low":
      return a.totalBookings - b.totalBookings;

    case "newest":
    default:
      return (
        new Date(b.registeredAt).getTime() -
        new Date(a.registeredAt).getTime()
      );
  }
});


}, [passengers, filters]);

const handleFilterChange = (
nextFilters: PassengerFilterValues,
) => {
setFilters(nextFilters);
};

const handleResetFilters = () => {
setFilters(DEFAULT_FILTERS);
};

const handleView = (passenger: AdminPassenger) => {
setSelectedPassenger(passenger);
setIsDetailsOpen(true);
};

const handleAddPassenger = () => {
setEditingPassenger(null);
setIsFormOpen(true);
};

const handleEdit = (passenger: AdminPassenger) => {
setEditingPassenger(passenger);
setIsFormOpen(true);
};

const handleDelete = (passenger: AdminPassenger) => {
const confirmed = window.confirm(
`Delete ${passenger.firstName} ${passenger.lastName}?`,
);


if (!confirmed) {
  return;
}

setPassengers((current) =>
  current.filter(
    (item) => item.id !== passenger.id,
  ),
);

if (selectedPassenger?.id === passenger.id) {
  setSelectedPassenger(null);
  setIsDetailsOpen(false);
}


};

const handleStatusChange = (
passenger: AdminPassenger,
status: AdminPassenger["status"],
) => {
setPassengers((current) =>
current.map((item) =>
item.id === passenger.id
? {
...item,
status,
updatedAt: new Date()
.toISOString()
.split("T")[0],
}
: item,
),
);
};

const handleSubmit = (data: PassengerFormData) => {
const today = new Date()
.toISOString()
.split("T")[0];


if (editingPassenger) {
  setPassengers((current) =>
    current.map((passenger) =>
      passenger.id === editingPassenger.id
        ? {
            ...passenger,
            ...data,
            updatedAt: today,
          }
        : passenger,
    ),
  );
} else {
  const nextNumber =
    passengers.reduce((highest, passenger) => {
      const number = Number(
        passenger.passengerId.replace("PSG-", ""),
      );

      return Number.isNaN(number)
        ? highest
        : Math.max(highest, number);
    }, 0) + 1;

  const newPassenger: AdminPassenger = {
    id: crypto.randomUUID(),
    passengerId: `PSG-${String(nextNumber).padStart(4, "0")}`,
    ...data,
    totalBookings: 0,
    totalTrips: 0,
    lastTrip: null,
    registeredAt: today,
    updatedAt: today,
  };

  setPassengers((current) => [
    ...current,
    newPassenger,
  ]);
}

setIsFormOpen(false);
setEditingPassenger(null);


};

const handleExport = () => {
const headers = [
"Passenger ID",
"First Name",
"Last Name",
"Email",
"Phone",
"Gender",
"Date of Birth",
"Nationality",
"Passport Number",
"Passport Expiry",
"Status",
"Total Bookings",
"Total Trips",
"Last Trip",
"Registered At",
"Updated At",
];


const escapeCsvValue = (
  value: string | number | null,
) => {
  if (value === null) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

const rows = filteredPassengers.map(
  (passenger) => [
    passenger.passengerId,
    passenger.firstName,
    passenger.lastName,
    passenger.email,
    passenger.phone,
    passenger.gender,
    passenger.dateOfBirth,
    passenger.nationality,
    passenger.passportNumber,
    passenger.passportExpiry,
    passenger.status,
    passenger.totalBookings,
    passenger.totalTrips,
    passenger.lastTrip,
    passenger.registeredAt,
    passenger.updatedAt,
  ],
);

const csv = [
  headers,
  ...rows,
]
  .map((row) =>
    row.map(escapeCsvValue).join(","),
  )
  .join("\n");

const blob = new Blob([csv], {
  type: "text/csv;charset=utf-8;",
});

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "sog-airways-passengers.csv";
document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);


};

return ( <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl space-y-6"> <PassengerHeader
       totalPassengers={passengers.length}
       onAddPassenger={handleAddPassenger}
       onExport={handleExport}
     />


    <PassengerStats passengers={passengers} />

    <PassengerFilters
      filters={filters}
      nationalities={nationalities}
      onChange={handleFilterChange}
      onReset={handleResetFilters}
    />

    <div className="hidden md:block">
      <PassengerTable
        passengers={filteredPassengers}
        onView={handleView}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>

    <div className="md:hidden">
      <PassengerCards
        passengers={filteredPassengers}
        onView={handleView}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  </div>

  {isDetailsOpen && selectedPassenger && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <PassengerDetails
          passenger={selectedPassenger}
          onEdit={() => {
            setIsDetailsOpen(false);
            handleEdit(selectedPassenger);
          }}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedPassenger(null);
          }}
        />
      </div>
    </div>
  )}

  {isFormOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <PassengerForm
          passenger={editingPassenger}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPassenger(null);
          }}
        />
      </div>
    </div>
  )}
</main>


);
}
