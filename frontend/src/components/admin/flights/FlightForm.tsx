"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type {
AdminFlight,
AdminFlightStatus,
} from "./admin-flights-data/AdminFlightsData";

interface FlightFormProps {
flight: AdminFlight | null;
onSubmit: (flight: AdminFlight) => void;
onClose: () => void;
}

interface FlightFormState {
flightNumber: string;
airlineCode: string;
aircraftId: string;
aircraftRegistration: string;
aircraftType: string;

departureAirport: string;
departureAirportCode: string;
departureCity: string;

arrivalAirport: string;
arrivalAirportCode: string;
arrivalCity: string;

departureDate: string;
departureTime: string;
arrivalDate: string;
arrivalTime: string;

duration: string;
distance: string;

totalSeats: string;
bookedSeats: string;
availableSeats: string;
economySeats: string;
premiumEconomySeats: string;
businessSeats: string;
firstClassSeats: string;

status: AdminFlightStatus;

gate: string;
terminal: string;

baggageAllowance: string;
mealService: boolean;
wifiAvailable: boolean;

baseFare: string;
currency: string;
}

const emptyForm: FlightFormState = {
flightNumber: "",
airlineCode: "SOG",
aircraftId: "",
aircraftRegistration: "",
aircraftType: "",

departureAirport: "",
departureAirportCode: "",
departureCity: "",

arrivalAirport: "",
arrivalAirportCode: "",
arrivalCity: "",

departureDate: "",
departureTime: "",
arrivalDate: "",
arrivalTime: "",

duration: "",
distance: "",

totalSeats: "",
bookedSeats: "0",
availableSeats: "",
economySeats: "",
premiumEconomySeats: "0",
businessSeats: "0",
firstClassSeats: "0",

status: "scheduled",

gate: "",
terminal: "",

baggageAllowance: "",
mealService: false,
wifiAvailable: false,

baseFare: "",
currency: "NGN",
};

function flightToForm(
flight: AdminFlight,
): FlightFormState {
return {
flightNumber: flight.flightNumber,
airlineCode: flight.airlineCode,
aircraftId: flight.aircraftId,
aircraftRegistration:
flight.aircraftRegistration,
aircraftType: flight.aircraftType,


departureAirport: flight.departureAirport,
departureAirportCode:
  flight.departureAirportCode,
departureCity: flight.departureCity,

arrivalAirport: flight.arrivalAirport,
arrivalAirportCode: flight.arrivalAirportCode,
arrivalCity: flight.arrivalCity,

departureDate: flight.departureDate,
departureTime: flight.departureTime,
arrivalDate: flight.arrivalDate,
arrivalTime: flight.arrivalTime,

duration: flight.duration,
distance: String(flight.distance),

totalSeats: String(flight.totalSeats),
bookedSeats: String(flight.bookedSeats),
availableSeats: String(flight.availableSeats),
economySeats: String(flight.economySeats),
premiumEconomySeats: String(
  flight.premiumEconomySeats,
),
businessSeats: String(flight.businessSeats),
firstClassSeats: String(flight.firstClassSeats),

status: flight.status,

gate: flight.gate ?? "",
terminal: flight.terminal ?? "",

baggageAllowance: flight.baggageAllowance,
mealService: flight.mealService,
wifiAvailable: flight.wifiAvailable,

baseFare: String(flight.baseFare),
currency: flight.currency,


};
}

interface FieldProps {
label: string;
value: string;
onChange: (value: string) => void;
type?: string;
placeholder?: string;
required?: boolean;
min?: string;
step?: string;
}

function Field({
label,
value,
onChange,
type = "text",
placeholder,
required = false,
min,
step,
}: FieldProps) {
return ( <label className="block"> <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
{label}


    {required && (
      <span className="ml-1 text-red-500">
        *
      </span>
    )}
  </span>

  <input
    type={type}
    value={value}
    onChange={(event) =>
      onChange(event.target.value)
    }
    placeholder={placeholder}
    required={required}
    min={min}
    step={step}
    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
  />
</label>


);
}

interface SelectFieldProps {
label: string;
value: string;
onChange: (value: string) => void;
children: ReactNode;
required?: boolean;
}

function SelectField({
label,
value,
onChange,
children,
required = false,
}: SelectFieldProps) {
return ( <label className="block"> <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
{label}


    {required && (
      <span className="ml-1 text-red-500">
        *
      </span>
    )}
  </span>

  <select
    value={value}
    onChange={(event) =>
      onChange(event.target.value)
    }
    required={required}
    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
  >
    {children}
  </select>
</label>


);
}

export default function FlightForm({
flight,
onSubmit,
onClose,
}: FlightFormProps) {
const [form, setForm] = useState<FlightFormState>(
() =>
flight ? flightToForm(flight) : emptyForm,
);

const [error, setError] = useState("");

/*

* Deliberately avoids a generic arrow function here.
* Generic arrow functions beginning with <K ...> can
* be parsed as JSX inside .tsx files.
  */
  const updateField = (
  field: keyof FlightFormState,
  value: string | boolean,
  ) => {
  setForm(
  (current) =>
  ({
  ...current,
  [field]: value,
  }) as FlightFormState,
  );
  };

const handleSubmit = (
event: FormEvent<HTMLFormElement>,
) => {
event.preventDefault();
setError("");


const totalSeats = Number(form.totalSeats);
const bookedSeats = Number(form.bookedSeats);
const availableSeats = Number(
  form.availableSeats,
);

const economySeats = Number(form.economySeats);
const premiumEconomySeats = Number(
  form.premiumEconomySeats,
);
const businessSeats = Number(
  form.businessSeats,
);
const firstClassSeats = Number(
  form.firstClassSeats,
);

const distance = Number(form.distance);
const baseFare = Number(form.baseFare);

if (
  !Number.isFinite(totalSeats) ||
  !Number.isFinite(bookedSeats) ||
  !Number.isFinite(availableSeats) ||
  totalSeats <= 0 ||
  bookedSeats < 0 ||
  availableSeats < 0
) {
  setError(
    "Seat values must contain valid numbers.",
  );
  return;
}

if (bookedSeats > totalSeats) {
  setError(
    "Booked seats cannot exceed total seats.",
  );
  return;
}

if (
  availableSeats !==
  totalSeats - bookedSeats
) {
  setError(
    "Available seats must equal total seats minus booked seats.",
  );
  return;
}

const cabinSeatTotal =
  economySeats +
  premiumEconomySeats +
  businessSeats +
  firstClassSeats;

if (cabinSeatTotal !== totalSeats) {
  setError(
    "The cabin seat totals must equal the total number of seats.",
  );
  return;
}

if (
  !Number.isFinite(distance) ||
  distance <= 0
) {
  setError(
    "Distance must contain a valid positive number.",
  );
  return;
}

if (
  !Number.isFinite(baseFare) ||
  baseFare < 0
) {
  setError(
    "Base fare must contain a valid number.",
  );
  return;
}

const now = new Date().toISOString();

const savedFlight: AdminFlight = {
  id: flight?.id ?? `flight-${Date.now()}`,

  flightNumber:
    form.flightNumber.trim().toUpperCase(),

  airlineCode:
    form.airlineCode.trim().toUpperCase(),

  aircraftId: form.aircraftId.trim(),

  aircraftRegistration:
    form.aircraftRegistration
      .trim()
      .toUpperCase(),

  aircraftType:
    form.aircraftType.trim(),

  departureAirport:
    form.departureAirport.trim(),

  departureAirportCode:
    form.departureAirportCode
      .trim()
      .toUpperCase(),

  departureCity:
    form.departureCity.trim(),

  arrivalAirport:
    form.arrivalAirport.trim(),

  arrivalAirportCode:
    form.arrivalAirportCode
      .trim()
      .toUpperCase(),

  arrivalCity:
    form.arrivalCity.trim(),

  departureDate:
    form.departureDate,

  departureTime:
    form.departureTime,

  arrivalDate:
    form.arrivalDate,

  arrivalTime:
    form.arrivalTime,

  duration:
    form.duration.trim(),

  distance,

  totalSeats,
  bookedSeats,
  availableSeats,

  economySeats,
  premiumEconomySeats,
  businessSeats,
  firstClassSeats,

  status: form.status,

  gate:
    form.gate.trim() || undefined,

  terminal:
    form.terminal.trim() || undefined,

  baggageAllowance:
    form.baggageAllowance.trim(),

  mealService:
    form.mealService,

  wifiAvailable:
    form.wifiAvailable,

  baseFare,

  currency:
    form.currency.trim().toUpperCase(),

  createdAt:
    flight?.createdAt ?? now,

  updatedAt: now,
};

onSubmit(savedFlight);


};

return ( <AnimatePresence>
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
className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
> <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"> <div> <h2 className="text-lg font-bold text-slate-900 dark:text-white">
{flight
? "Edit Flight"
: "Add New Flight"} </h2>


          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter the flight schedule,
            aircraft, seating and service
            information.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close flight form"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto"
      >
        <div className="space-y-7 p-5 sm:p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Flight Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Flight Number"
                value={form.flightNumber}
                onChange={(value) =>
                  updateField(
                    "flightNumber",
                    value,
                  )
                }
                placeholder="SOG101"
                required
              />

              <Field
                label="Airline Code"
                value={form.airlineCode}
                onChange={(value) =>
                  updateField(
                    "airlineCode",
                    value,
                  )
                }
                placeholder="SOG"
                required
              />

              <SelectField
                label="Status"
                value={form.status}
                onChange={(value) =>
                  updateField(
                    "status",
                    value as AdminFlightStatus,
                  )
                }
                required
              >
                <option value="scheduled">
                  Scheduled
                </option>
                <option value="boarding">
                  Boarding
                </option>
                <option value="departed">
                  Departed
                </option>
                <option value="arrived">
                  Arrived
                </option>
                <option value="delayed">
                  Delayed
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </SelectField>

              <Field
                label="Aircraft ID"
                value={form.aircraftId}
                onChange={(value) =>
                  updateField(
                    "aircraftId",
                    value,
                  )
                }
                placeholder="aircraft-001"
                required
              />

              <Field
                label="Aircraft Registration"
                value={
                  form.aircraftRegistration
                }
                onChange={(value) =>
                  updateField(
                    "aircraftRegistration",
                    value,
                  )
                }
                placeholder="5N-SOG"
                required
              />

              <Field
                label="Aircraft Type"
                value={form.aircraftType}
                onChange={(value) =>
                  updateField(
                    "aircraftType",
                    value,
                  )
                }
                placeholder="Boeing 737-800"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Departure
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Airport"
                value={
                  form.departureAirport
                }
                onChange={(value) =>
                  updateField(
                    "departureAirport",
                    value,
                  )
                }
                placeholder="Murtala Muhammed International Airport"
                required
              />

              <Field
                label="Airport Code"
                value={
                  form.departureAirportCode
                }
                onChange={(value) =>
                  updateField(
                    "departureAirportCode",
                    value,
                  )
                }
                placeholder="LOS"
                required
              />

              <Field
                label="City"
                value={form.departureCity}
                onChange={(value) =>
                  updateField(
                    "departureCity",
                    value,
                  )
                }
                placeholder="Lagos"
                required
              />

              <Field
                label="Departure Date"
                value={
                  form.departureDate
                }
                onChange={(value) =>
                  updateField(
                    "departureDate",
                    value,
                  )
                }
                type="date"
                required
              />

              <Field
                label="Departure Time"
                value={
                  form.departureTime
                }
                onChange={(value) =>
                  updateField(
                    "departureTime",
                    value,
                  )
                }
                type="time"
                required
              />

              <Field
                label="Terminal"
                value={form.terminal}
                onChange={(value) =>
                  updateField(
                    "terminal",
                    value,
                  )
                }
                placeholder="Terminal 1"
              />

              <Field
                label="Gate"
                value={form.gate}
                onChange={(value) =>
                  updateField(
                    "gate",
                    value,
                  )
                }
                placeholder="A12"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Arrival
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Airport"
                value={form.arrivalAirport}
                onChange={(value) =>
                  updateField(
                    "arrivalAirport",
                    value,
                  )
                }
                placeholder="Nnamdi Azikiwe International Airport"
                required
              />

              <Field
                label="Airport Code"
                value={
                  form.arrivalAirportCode
                }
                onChange={(value) =>
                  updateField(
                    "arrivalAirportCode",
                    value,
                  )
                }
                placeholder="ABV"
                required
              />

              <Field
                label="City"
                value={form.arrivalCity}
                onChange={(value) =>
                  updateField(
                    "arrivalCity",
                    value,
                  )
                }
                placeholder="Abuja"
                required
              />

              <Field
                label="Arrival Date"
                value={form.arrivalDate}
                onChange={(value) =>
                  updateField(
                    "arrivalDate",
                    value,
                  )
                }
                type="date"
                required
              />

              <Field
                label="Arrival Time"
                value={form.arrivalTime}
                onChange={(value) =>
                  updateField(
                    "arrivalTime",
                    value,
                  )
                }
                type="time"
                required
              />

              <Field
                label="Duration"
                value={form.duration}
                onChange={(value) =>
                  updateField(
                    "duration",
                    value,
                  )
                }
                placeholder="1h 10m"
                required
              />

              <Field
                label="Distance (km)"
                value={form.distance}
                onChange={(value) =>
                  updateField(
                    "distance",
                    value,
                  )
                }
                type="number"
                min="1"
                step="1"
                placeholder="450"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Seating
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Total Seats"
                value={form.totalSeats}
                onChange={(value) =>
                  updateField(
                    "totalSeats",
                    value,
                  )
                }
                type="number"
                min="1"
                step="1"
                required
              />

              <Field
                label="Booked Seats"
                value={form.bookedSeats}
                onChange={(value) =>
                  updateField(
                    "bookedSeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />

              <Field
                label="Available Seats"
                value={
                  form.availableSeats
                }
                onChange={(value) =>
                  updateField(
                    "availableSeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />

              <Field
                label="Economy Seats"
                value={form.economySeats}
                onChange={(value) =>
                  updateField(
                    "economySeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />

              <Field
                label="Premium Economy"
                value={
                  form.premiumEconomySeats
                }
                onChange={(value) =>
                  updateField(
                    "premiumEconomySeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />

              <Field
                label="Business Seats"
                value={form.businessSeats}
                onChange={(value) =>
                  updateField(
                    "businessSeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />

              <Field
                label="First Class Seats"
                value={
                  form.firstClassSeats
                }
                onChange={(value) =>
                  updateField(
                    "firstClassSeats",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                required
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Passenger Services & Fare
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Baggage Allowance"
                value={
                  form.baggageAllowance
                }
                onChange={(value) =>
                  updateField(
                    "baggageAllowance",
                    value,
                  )
                }
                placeholder="23 kg"
                required
              />

              <Field
                label="Base Fare"
                value={form.baseFare}
                onChange={(value) =>
                  updateField(
                    "baseFare",
                    value,
                  )
                }
                type="number"
                min="0"
                step="1"
                placeholder="185000"
                required
              />

              <Field
                label="Currency"
                value={form.currency}
                onChange={(value) =>
                  updateField(
                    "currency",
                    value,
                  )
                }
                placeholder="NGN"
                required
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.mealService}
                  onChange={(event) =>
                    updateField(
                      "mealService",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Meal service
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.wifiAvailable}
                  onChange={(event) =>
                    updateField(
                      "wifiAvailable",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Wi-Fi available
              </label>
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            {flight
              ? "Save Changes"
              : "Create Flight"}
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
</AnimatePresence>


);
}
