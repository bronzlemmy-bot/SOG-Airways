"use client";

import { motion } from "framer-motion";
import { Plane, Save, X } from "lucide-react";
import { FormEvent, useState } from "react";

import type {
Aircraft,
AircraftStatus,
AircraftType,
} from "./aircraft-data/AircraftData";

interface AircraftFormProps {
aircraft?: Aircraft | null;
onSubmit: (aircraft: Aircraft) => void;
onCancel: () => void;
}

interface AircraftFormValues {
registration: string;
aircraftType: AircraftType;
model: string;
manufacturer: "Airbus" | "Boeing";
airlineCode: string;
totalSeats: string;
economySeats: string;
premiumEconomySeats: string;
businessSeats: string;
firstClassSeats: string;
status: AircraftStatus;
currentAirport: string;
currentAirportCode: string;
nextFlight: string;
nextFlightNumber: string;
lastMaintenanceDate: string;
nextMaintenanceDate: string;
}

const aircraftTypes: AircraftType[] = [
"Airbus A320",
"Airbus A321",
"Airbus A330",
"Boeing 737",
"Boeing 787",
];

function createInitialValues(aircraft?: Aircraft | null): AircraftFormValues {
return {
registration: aircraft?.registration ?? "",
aircraftType: aircraft?.aircraftType ?? "Airbus A320",
model: aircraft?.model ?? "",
manufacturer: aircraft?.manufacturer ?? "Airbus",
airlineCode: aircraft?.airlineCode ?? "SOG",
totalSeats: aircraft?.totalSeats.toString() ?? "",
economySeats: aircraft?.economySeats.toString() ?? "",
premiumEconomySeats:
aircraft?.premiumEconomySeats.toString() ?? "0",
businessSeats: aircraft?.businessSeats.toString() ?? "",
firstClassSeats: aircraft?.firstClassSeats.toString() ?? "0",
status: aircraft?.status ?? "active",
currentAirport: aircraft?.currentAirport ?? "",
currentAirportCode: aircraft?.currentAirportCode ?? "",
nextFlight: aircraft?.nextFlight ?? "",
nextFlightNumber: aircraft?.nextFlightNumber ?? "",
lastMaintenanceDate: aircraft?.lastMaintenanceDate ?? "",
nextMaintenanceDate: aircraft?.nextMaintenanceDate ?? "",
};
}

function Field({
label,
name,
value,
onChange,
type = "text",
placeholder,
required = false,
min,
}: {
label: string;
name: string;
value: string;
onChange: (value: string) => void;
type?: string;
placeholder?: string;
required?: boolean;
min?: string;
}) {
return ( <label className="block"> <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
{label}
{required && <span className="ml-1 text-red-500">*</span>} </span>


  <input
    name={name}
    type={type}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    required={required}
    min={min}
    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600"
  />
</label>


);
}

function SelectField({
label,
value,
onChange,
options,
required = false,
}: {
label: string;
value: string;
onChange: (value: string) => void;
options: Array<{ label: string; value: string }>;
required?: boolean;
}) {
return ( <label className="block"> <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
{label}
{required && <span className="ml-1 text-red-500">*</span>} </span>


  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    required={required}
    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-600"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</label>


);
}

export default function AircraftForm({
aircraft,
onSubmit,
onCancel,
}: AircraftFormProps) {
const [values, setValues] = useState<AircraftFormValues>(
() => createInitialValues(aircraft),
);

const [error, setError] = useState("");

const isEditing = Boolean(aircraft);

const updateField = (
field: keyof AircraftFormValues,
value: string,
) => {
setValues((current) => ({
...current,
[field]: value,
}));
};

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();
setError("");


const economySeats = Number(values.economySeats);
const premiumEconomySeats = Number(values.premiumEconomySeats);
const businessSeats = Number(values.businessSeats);
const firstClassSeats = Number(values.firstClassSeats);
const totalSeats = Number(values.totalSeats);

const calculatedSeats =
  economySeats +
  premiumEconomySeats +
  businessSeats +
  firstClassSeats;

if (
  !Number.isFinite(totalSeats) ||
  !Number.isFinite(economySeats) ||
  !Number.isFinite(premiumEconomySeats) ||
  !Number.isFinite(businessSeats) ||
  !Number.isFinite(firstClassSeats)
) {
  setError("Please enter valid seat numbers.");
  return;
}

if (totalSeats !== calculatedSeats) {
  setError(
    `Total seats must equal the cabin breakdown (${calculatedSeats}).`,
  );
  return;
}

if (totalSeats <= 0) {
  setError("Total seats must be greater than zero.");
  return;
}

if (!values.currentAirportCode.trim()) {
  setError("Please enter the current airport code.");
  return;
}

const now = new Date().toISOString();

const result: Aircraft = {
  id: aircraft?.id ?? `aircraft-${Date.now()}`,
  registration: values.registration.trim().toUpperCase(),
  aircraftType: values.aircraftType,
  model: values.model.trim(),
  manufacturer: values.manufacturer,
  airlineCode: values.airlineCode.trim().toUpperCase(),
  totalSeats,
  economySeats,
  premiumEconomySeats,
  businessSeats,
  firstClassSeats,
  status: values.status,
  currentAirport: values.currentAirport.trim(),
  currentAirportCode: values.currentAirportCode
    .trim()
    .toUpperCase(),
  nextFlight: values.nextFlight.trim() || undefined,
  nextFlightNumber:
    values.nextFlightNumber.trim().toUpperCase() || undefined,
  lastMaintenanceDate: values.lastMaintenanceDate,
  nextMaintenanceDate: values.nextMaintenanceDate,
  totalFlights: aircraft?.totalFlights ?? 0,
  totalFlightHours: aircraft?.totalFlightHours ?? 0,
  createdAt: aircraft?.createdAt ?? now,
  updatedAt: now,
};

onSubmit(result);


};

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
onClick={onCancel}
>
<motion.div
initial={{ opacity: 0, y: 20, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 20, scale: 0.97 }}
transition={{ duration: 0.25 }}
role="dialog"
aria-modal="true"
aria-labelledby="aircraft-form-title"
className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
onClick={(event) => event.stopPropagation()}
>
{/* Header */} <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-7 dark:border-slate-800 dark:bg-slate-900/95"> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>


        <div>
          <h2
            id="aircraft-form-title"
            className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white"
          >
            {isEditing ? "Edit Aircraft" : "Add Aircraft"}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update the aircraft's fleet information."
              : "Add a new aircraft to the SOG Airways fleet."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCancel}
        aria-label="Close aircraft form"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="space-y-7 p-5 sm:p-7">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Aircraft identification */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Aircraft Identification
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter the aircraft&apos;s registration and manufacturer
              information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Registration"
              name="registration"
              value={values.registration}
              onChange={(value) =>
                updateField("registration", value)
              }
              placeholder="5N-SOG7"
              required
            />

            <SelectField
              label="Aircraft Type"
              value={values.aircraftType}
              onChange={(value) =>
                updateField(
                  "aircraftType",
                  value as AircraftType,
                )
              }
              options={aircraftTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              required
            />

            <Field
              label="Model"
              name="model"
              value={values.model}
              onChange={(value) => updateField("model", value)}
              placeholder="A320-200"
              required
            />

            <SelectField
              label="Manufacturer"
              value={values.manufacturer}
              onChange={(value) =>
                updateField(
                  "manufacturer",
                  value as "Airbus" | "Boeing",
                )
              }
              options={[
                { label: "Airbus", value: "Airbus" },
                { label: "Boeing", value: "Boeing" },
              ]}
              required
            />

            <Field
              label="Airline Code"
              name="airlineCode"
              value={values.airlineCode}
              onChange={(value) =>
                updateField("airlineCode", value)
              }
              placeholder="SOG"
              required
            />

            <SelectField
              label="Fleet Status"
              value={values.status}
              onChange={(value) =>
                updateField(
                  "status",
                  value as AircraftStatus,
                )
              }
              options={[
                { label: "Active", value: "active" },
                {
                  label: "Maintenance",
                  value: "maintenance",
                },
                { label: "Inactive", value: "inactive" },
              ]}
              required
            />
          </div>
        </section>

        {/* Location */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Current Location
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Specify where the aircraft is currently located.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Airport Name"
              name="currentAirport"
              value={values.currentAirport}
              onChange={(value) =>
                updateField("currentAirport", value)
              }
              placeholder="Murtala Muhammed International Airport"
              required
            />

            <Field
              label="Airport Code"
              name="currentAirportCode"
              value={values.currentAirportCode}
              onChange={(value) =>
                updateField("currentAirportCode", value)
              }
              placeholder="LOS"
              required
            />
          </div>
        </section>

        {/* Flight assignment */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Flight Assignment
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add the aircraft&apos;s next scheduled assignment when
              available.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Next Flight Number"
              name="nextFlightNumber"
              value={values.nextFlightNumber}
              onChange={(value) =>
                updateField("nextFlightNumber", value)
              }
              placeholder="SOG 214"
            />

            <Field
              label="Next Flight / Route"
              name="nextFlight"
              value={values.nextFlight}
              onChange={(value) =>
                updateField("nextFlight", value)
              }
              placeholder="Lagos → London"
            />
          </div>
        </section>

        {/* Seating */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Seating Configuration
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Total seats must match the cabin class breakdown.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Total Seats"
              name="totalSeats"
              type="number"
              min="1"
              value={values.totalSeats}
              onChange={(value) =>
                updateField("totalSeats", value)
              }
              placeholder="186"
              required
            />

            <Field
              label="Economy Seats"
              name="economySeats"
              type="number"
              min="0"
              value={values.economySeats}
              onChange={(value) =>
                updateField("economySeats", value)
              }
              placeholder="162"
              required
            />

            <Field
              label="Premium Economy Seats"
              name="premiumEconomySeats"
              type="number"
              min="0"
              value={values.premiumEconomySeats}
              onChange={(value) =>
                updateField("premiumEconomySeats", value)
              }
              placeholder="0"
              required
            />

            <Field
              label="Business Seats"
              name="businessSeats"
              type="number"
              min="0"
              value={values.businessSeats}
              onChange={(value) =>
                updateField("businessSeats", value)
              }
              placeholder="24"
              required
            />

            <Field
              label="First Class Seats"
              name="firstClassSeats"
              type="number"
              min="0"
              value={values.firstClassSeats}
              onChange={(value) =>
                updateField("firstClassSeats", value)
              }
              placeholder="0"
              required
            />
          </div>
        </section>

        {/* Maintenance */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Maintenance Schedule
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Record the aircraft&apos;s maintenance dates.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Last Maintenance"
              name="lastMaintenanceDate"
              type="date"
              value={values.lastMaintenanceDate}
              onChange={(value) =>
                updateField("lastMaintenanceDate", value)
              }
              required
            />

            <Field
              label="Next Maintenance"
              name="nextMaintenanceDate"
              type="date"
              value={values.nextMaintenanceDate}
              onChange={(value) =>
                updateField("nextMaintenanceDate", value)
              }
              required
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-900/95">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Add Aircraft"}
        </button>
      </div>
    </form>
  </motion.div>
</motion.div>


);
}
