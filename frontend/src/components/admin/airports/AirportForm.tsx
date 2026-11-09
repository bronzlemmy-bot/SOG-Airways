"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Save, X } from "lucide-react";

import type {
Airport,
AirportStatus,
AirportType,
} from "./airports-data/AirportsData";

interface AirportFormProps {
airport: Airport | null;
onSubmit: (airport: Airport) => void;
onClose: () => void;
}

interface AirportFormState {
name: string;
code: string;
city: string;
country: string;
countryCode: string;
airportType: AirportType;
status: AirportStatus;
terminalCount: string;
runwayCount: string;
gateCount: string;
passengerCapacity: string;
annualPassengers: string;
operatingHours: string;
timezone: string;
latitude: string;
longitude: string;
airlineCount: string;
flightCount: string;
}

const emptyForm: AirportFormState = {
name: "",
code: "",
city: "",
country: "",
countryCode: "",
airportType: "international",
status: "operational",
terminalCount: "1",
runwayCount: "1",
gateCount: "1",
passengerCapacity: "0",
annualPassengers: "0",
operatingHours: "24 hours",
timezone: "Africa/Lagos",
latitude: "0",
longitude: "0",
airlineCount: "0",
flightCount: "0",
};

function airportToForm(airport: Airport): AirportFormState {
return {
name: airport.name,
code: airport.code,
city: airport.city,
country: airport.country,
countryCode: airport.countryCode,
airportType: airport.airportType,
status: airport.status,
terminalCount: String(airport.terminalCount),
runwayCount: String(airport.runwayCount),
gateCount: String(airport.gateCount),
passengerCapacity: String(airport.passengerCapacity),
annualPassengers: String(airport.annualPassengers),
operatingHours: airport.operatingHours,
timezone: airport.timezone,
latitude: String(airport.latitude),
longitude: String(airport.longitude),
airlineCount: String(airport.airlineCount),
flightCount: String(airport.flightCount),
};
}

export default function AirportForm({
airport,
onSubmit,
onClose,
}: AirportFormProps) {
const [form, setForm] = useState<AirportFormState>(() =>
airport ? airportToForm(airport) : emptyForm,
);

const [error, setError] = useState("");

const isEditing = Boolean(airport);

const updateField = <K extends keyof AirportFormState>(
field: K,
value: AirportFormState[K],
) => {
setForm((previous) => ({
...previous,
[field]: value,
}));


if (error) {
  setError("");
}


};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (
  !form.name.trim() ||
  !form.code.trim() ||
  !form.city.trim() ||
  !form.country.trim() ||
  !form.countryCode.trim()
) {
  setError(
    "Please complete the airport name, code, city, country, and country code.",
  );
  return;
}

const now = new Date().toISOString().slice(0, 10);

const submittedAirport: Airport = {
  id: airport?.id ?? `airport-${Date.now()}`,
  name: form.name.trim(),
  code: form.code.trim().toUpperCase(),
  city: form.city.trim(),
  country: form.country.trim(),
  countryCode: form.countryCode.trim().toUpperCase(),
  airportType: form.airportType,
  status: form.status,
  terminalCount: Number(form.terminalCount) || 0,
  runwayCount: Number(form.runwayCount) || 0,
  gateCount: Number(form.gateCount) || 0,
  passengerCapacity: Number(form.passengerCapacity) || 0,
  annualPassengers: Number(form.annualPassengers) || 0,
  operatingHours: form.operatingHours.trim(),
  timezone: form.timezone.trim(),
  latitude: Number(form.latitude) || 0,
  longitude: Number(form.longitude) || 0,
  airlineCount: Number(form.airlineCount) || 0,
  flightCount: Number(form.flightCount) || 0,
  createdAt: airport?.createdAt ?? now,
  updatedAt: now,
};

onSubmit(submittedAirport);


};

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onClose();
}
}}
>
<motion.div
initial={{ opacity: 0, y: 20, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.25 }}
className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-6"> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Building2 className="h-5 w-5" /> </div>


        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Airport" : "Add Airport"}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update airport information and operational details."
              : "Add a new airport to the SOG Airways network."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close airport form"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Basic Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Airport Name"
            value={form.name}
            onChange={(value) => updateField("name", value)}
            placeholder="Murtala Muhammed International Airport"
            required
          />

          <Field
            label="Airport Code"
            value={form.code}
            onChange={(value) => updateField("code", value)}
            placeholder="LOS"
            maxLength={3}
            required
          />

          <Field
            label="City"
            value={form.city}
            onChange={(value) => updateField("city", value)}
            placeholder="Lagos"
            required
          />

          <Field
            label="Country"
            value={form.country}
            onChange={(value) => updateField("country", value)}
            placeholder="Nigeria"
            required
          />

          <Field
            label="Country Code"
            value={form.countryCode}
            onChange={(value) => updateField("countryCode", value)}
            placeholder="NG"
            maxLength={2}
            required
          />

          <SelectField
            label="Airport Type"
            value={form.airportType}
            onChange={(value) =>
              updateField("airportType", value as AirportType)
            }
            options={[
              { value: "international", label: "International" },
              { value: "domestic", label: "Domestic" },
              { value: "regional", label: "Regional" },
            ]}
          />

          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) =>
              updateField("status", value as AirportStatus)
            }
            options={[
              { value: "operational", label: "Operational" },
              { value: "limited", label: "Limited Operations" },
              { value: "closed", label: "Closed" },
            ]}
          />

          <Field
            label="Operating Hours"
            value={form.operatingHours}
            onChange={(value) => updateField("operatingHours", value)}
            placeholder="24 hours"
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Facilities & Capacity
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumberField
            label="Terminals"
            value={form.terminalCount}
            onChange={(value) => updateField("terminalCount", value)}
            min={0}
          />

          <NumberField
            label="Runways"
            value={form.runwayCount}
            onChange={(value) => updateField("runwayCount", value)}
            min={0}
          />

          <NumberField
            label="Gates"
            value={form.gateCount}
            onChange={(value) => updateField("gateCount", value)}
            min={0}
          />

          <NumberField
            label="Passenger Capacity"
            value={form.passengerCapacity}
            onChange={(value) =>
              updateField("passengerCapacity", value)
            }
            min={0}
          />

          <NumberField
            label="Annual Passengers"
            value={form.annualPassengers}
            onChange={(value) =>
              updateField("annualPassengers", value)
            }
            min={0}
          />

          <NumberField
            label="Airline Count"
            value={form.airlineCount}
            onChange={(value) => updateField("airlineCount", value)}
            min={0}
          />

          <NumberField
            label="Flight Count"
            value={form.flightCount}
            onChange={(value) => updateField("flightCount", value)}
            min={0}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Location & Time Zone
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Time Zone"
            value={form.timezone}
            onChange={(value) => updateField("timezone", value)}
            placeholder="Africa/Lagos"
          />

          <Field
            label="Latitude"
            type="number"
            value={form.latitude}
            onChange={(value) => updateField("latitude", value)}
            placeholder="6.5774"
            step="any"
          />

          <Field
            label="Longitude"
            type="number"
            value={form.longitude}
            onChange={(value) => updateField("longitude", value)}
            placeholder="3.3212"
            step="any"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Add Airport"}
        </motion.button>
      </div>
    </form>
  </motion.div>
</motion.div>


);
}

interface FieldProps {
label: string;
value: string;
onChange: (value: string) => void;
placeholder?: string;
type?: "text" | "number";
required?: boolean;
maxLength?: number;
step?: string;
min?: number;
}

function Field({
label,
value,
onChange,
placeholder,
type = "text",
required = false,
maxLength,
step,
min,
}: FieldProps) {
return ( <label className="block"> <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
{label}
{required && <span className="ml-1 text-red-500">*</span>} </span>


  <input
    type={type}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    required={required}
    maxLength={maxLength}
    step={step}
    min={min}
    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
  />
</label>


);
}

interface NumberFieldProps {
label: string;
value: string;
onChange: (value: string) => void;
min?: number;
}

function NumberField({
label,
value,
onChange,
min = 0,
}: NumberFieldProps) {
return ( <Field
   label={label}
   type="number"
   value={value}
   onChange={onChange}
   min={min}
 />
);
}

interface SelectFieldProps {
label: string;
value: string;
onChange: (value: string) => void;
options: Array<{
value: string;
label: string;
}>;
}

function SelectField({
label,
value,
onChange,
options,
}: SelectFieldProps) {
return ( <label className="block"> <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
{label} </span>


  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
