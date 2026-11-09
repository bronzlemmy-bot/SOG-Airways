"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";

import type {
AdminBooking,
AdminBookingClass,
AdminBookingStatus,
AdminPaymentStatus,
} from "./admin-bookings-data/AdminBookingsData";

interface BookingFormProps {
booking: AdminBooking | null;
onSubmit: (booking: AdminBooking) => void;
onClose: () => void;
}

interface BookingFormState {
bookingReference: string;
fullName: string;
email: string;
phone: string;
nationality: string;
flightNumber: string;
airlineCode: string;
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
cabinClass: AdminBookingClass;
passengerCount: number;
baggageCount: number;
status: AdminBookingStatus;
paymentStatus: AdminPaymentStatus;
amount: number;
currency: string;
}

const emptyForm: BookingFormState = {
bookingReference: "",
fullName: "",
email: "",
phone: "",
nationality: "",
flightNumber: "",
airlineCode: "SOG",
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
cabinClass: "Economy",
passengerCount: 1,
baggageCount: 1,
status: "pending",
paymentStatus: "pending",
amount: 0,
currency: "NGN",
};

function bookingToForm(booking: AdminBooking): BookingFormState {
return {
bookingReference: booking.bookingReference,
fullName: booking.passenger.fullName,
email: booking.passenger.email,
phone: booking.passenger.phone,
nationality: booking.passenger.nationality,
flightNumber: booking.flightNumber,
airlineCode: booking.airlineCode,
departureAirport: booking.departureAirport,
departureAirportCode: booking.departureAirportCode,
departureCity: booking.departureCity,
arrivalAirport: booking.arrivalAirport,
arrivalAirportCode: booking.arrivalAirportCode,
arrivalCity: booking.arrivalCity,
departureDate: booking.departureDate,
departureTime: booking.departureTime,
arrivalDate: booking.arrivalDate,
arrivalTime: booking.arrivalTime,
cabinClass: booking.cabinClass,
passengerCount: booking.passengerCount,
baggageCount: booking.baggageCount,
status: booking.status,
paymentStatus: booking.paymentStatus,
amount: booking.amount,
currency: booking.currency,
};
}

interface FieldProps {
label: string;
children: React.ReactNode;
className?: string;
}

function Field({ label, children, className = "" }: FieldProps) {
return ( <div className={className}> <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
{label} </label>
{children} </div>
);
}

export default function BookingForm({
booking,
onSubmit,
onClose,
}: BookingFormProps) {
const [form, setForm] = useState<BookingFormState>(() =>
booking ? bookingToForm(booking) : emptyForm,
);

const [error, setError] = useState("");

const updateField = <K extends keyof BookingFormState>(
field: K,
value: BookingFormState[K],
) => {
setForm((current) => ({
...current,
[field]: value,
}));


setError("");


};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (
  !form.bookingReference.trim() ||
  !form.fullName.trim() ||
  !form.email.trim() ||
  !form.flightNumber.trim() ||
  !form.departureAirport.trim() ||
  !form.departureAirportCode.trim() ||
  !form.arrivalAirport.trim() ||
  !form.arrivalAirportCode.trim() ||
  !form.departureDate ||
  !form.departureTime ||
  !form.arrivalDate ||
  !form.arrivalTime
) {
  setError("Please complete all required booking fields.");
  return;
}

if (form.passengerCount < 1) {
  setError("Passenger count must be at least 1.");
  return;
}

if (form.baggageCount < 0) {
  setError("Baggage count cannot be negative.");
  return;
}

if (form.amount < 0) {
  setError("Booking amount cannot be negative.");
  return;
}

const now = new Date().toISOString();

const savedBooking: AdminBooking = {
  id: booking?.id ?? `booking-${Date.now()}`,
  bookingReference: form.bookingReference.trim().toUpperCase(),

  passenger: {
    id: booking?.passenger.id ?? `passenger-${Date.now()}`,
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    nationality: form.nationality.trim(),
  },

  flightNumber: form.flightNumber.trim().toUpperCase(),
  airlineCode: form.airlineCode.trim().toUpperCase(),

  departureAirport: form.departureAirport.trim(),
  departureAirportCode: form.departureAirportCode.trim().toUpperCase(),
  departureCity: form.departureCity.trim(),

  arrivalAirport: form.arrivalAirport.trim(),
  arrivalAirportCode: form.arrivalAirportCode.trim().toUpperCase(),
  arrivalCity: form.arrivalCity.trim(),

  departureDate: form.departureDate,
  departureTime: form.departureTime,
  arrivalDate: form.arrivalDate,
  arrivalTime: form.arrivalTime,

  cabinClass: form.cabinClass,
  passengerCount: Number(form.passengerCount),
  baggageCount: Number(form.baggageCount),

  status: form.status,
  paymentStatus: form.paymentStatus,

  amount: Number(form.amount),
  currency: form.currency.trim().toUpperCase(),

  bookingDate: booking?.bookingDate ?? now,
  lastUpdated: now,
};

onSubmit(savedBooking);


};

return ( <AnimatePresence>
<motion.div
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
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
initial={{ opacity: 0, y: 24, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 24, scale: 0.98 }}
transition={{ duration: 0.2 }}
className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
> <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
{booking ? "Edit Booking" : "Add Booking"} </h2>


          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {booking
              ? "Update the booking information below."
              : "Create a new passenger booking."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking form"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto px-6 py-6"
      >
        <div className="space-y-8">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Booking Information
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Basic booking and passenger information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Booking Reference *">
                <Input
                  value={form.bookingReference}
                  onChange={(event) =>
                    updateField("bookingReference", event.target.value)
                  }
                  placeholder="SOG8K4P2"
                />
              </Field>

              <Field label="Passenger Name *">
                <Input
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Passenger full name"
                />
              </Field>

              <Field label="Email *">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="passenger@example.com"
                />
              </Field>

              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="+234..."
                />
              </Field>

              <Field label="Nationality">
                <Input
                  value={form.nationality}
                  onChange={(event) =>
                    updateField("nationality", event.target.value)
                  }
                  placeholder="Nigerian"
                />
              </Field>

              <Field label="Passenger Count">
                <Input
                  type="number"
                  min={1}
                  value={form.passengerCount}
                  onChange={(event) =>
                    updateField(
                      "passengerCount",
                      Math.max(1, Number(event.target.value)),
                    )
                  }
                />
              </Field>

              <Field label="Baggage Count">
                <Input
                  type="number"
                  min={0}
                  value={form.baggageCount}
                  onChange={(event) =>
                    updateField(
                      "baggageCount",
                      Math.max(0, Number(event.target.value)),
                    )
                  }
                />
              </Field>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Flight Information
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter the flight and route details.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Airline Code">
                <Input
                  value={form.airlineCode}
                  onChange={(event) =>
                    updateField("airlineCode", event.target.value)
                  }
                  placeholder="SOG"
                />
              </Field>

              <Field label="Flight Number *">
                <Input
                  value={form.flightNumber}
                  onChange={(event) =>
                    updateField("flightNumber", event.target.value)
                  }
                  placeholder="SOG101"
                />
              </Field>

              <Field label="Cabin Class">
                <Select
                  value={form.cabinClass}
                  onChange={(event) =>
                    updateField(
                      "cabinClass",
                      event.target.value as AdminBookingClass,
                    )
                  }
                  options={[
                    { label: "Economy", value: "Economy" },
                    {
                      label: "Premium Economy",
                      value: "Premium Economy",
                    },
                    { label: "Business", value: "Business" },
                    { label: "First", value: "First" },
                  ]}
                />
              </Field>

              <Field label="Departure Airport *">
                <Input
                  value={form.departureAirport}
                  onChange={(event) =>
                    updateField("departureAirport", event.target.value)
                  }
                  placeholder="Murtala Muhammed International Airport"
                />
              </Field>

              <Field label="Departure Airport Code *">
                <Input
                  value={form.departureAirportCode}
                  onChange={(event) =>
                    updateField(
                      "departureAirportCode",
                      event.target.value,
                    )
                  }
                  placeholder="LOS"
                />
              </Field>

              <Field label="Departure City">
                <Input
                  value={form.departureCity}
                  onChange={(event) =>
                    updateField("departureCity", event.target.value)
                  }
                  placeholder="Lagos"
                />
              </Field>

              <Field label="Arrival Airport *">
                <Input
                  value={form.arrivalAirport}
                  onChange={(event) =>
                    updateField("arrivalAirport", event.target.value)
                  }
                  placeholder="Nnamdi Azikiwe International Airport"
                />
              </Field>

              <Field label="Arrival Airport Code *">
                <Input
                  value={form.arrivalAirportCode}
                  onChange={(event) =>
                    updateField(
                      "arrivalAirportCode",
                      event.target.value,
                    )
                  }
                  placeholder="ABV"
                />
              </Field>

              <Field label="Arrival City">
                <Input
                  value={form.arrivalCity}
                  onChange={(event) =>
                    updateField("arrivalCity", event.target.value)
                  }
                  placeholder="Abuja"
                />
              </Field>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Flight Schedule
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Set departure and arrival dates and times.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Departure Date *">
                <Input
                  type="date"
                  value={form.departureDate}
                  onChange={(event) =>
                    updateField("departureDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Departure Time *">
                <Input
                  type="time"
                  value={form.departureTime}
                  onChange={(event) =>
                    updateField("departureTime", event.target.value)
                  }
                />
              </Field>

              <Field label="Arrival Date *">
                <Input
                  type="date"
                  value={form.arrivalDate}
                  onChange={(event) =>
                    updateField("arrivalDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Arrival Time *">
                <Input
                  type="time"
                  value={form.arrivalTime}
                  onChange={(event) =>
                    updateField("arrivalTime", event.target.value)
                  }
                />
              </Field>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Payment & Status
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage booking status and payment information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Booking Status">
                <Select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as AdminBookingStatus,
                    )
                  }
                  options={[
                    { label: "Confirmed", value: "confirmed" },
                    { label: "Pending", value: "pending" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "Completed", value: "completed" },
                  ]}
                />
              </Field>

              <Field label="Payment Status">
                <Select
                  value={form.paymentStatus}
                  onChange={(event) =>
                    updateField(
                      "paymentStatus",
                      event.target.value as AdminPaymentStatus,
                    )
                  }
                  options={[
                    { label: "Paid", value: "paid" },
                    { label: "Pending", value: "pending" },
                    { label: "Refunded", value: "refunded" },
                    { label: "Failed", value: "failed" },
                  ]}
                />
              </Field>

              <Field label="Amount">
                <Input
                  type="number"
                  min={0}
                  value={form.amount}
                  onChange={(event) =>
                    updateField(
                      "amount",
                      Math.max(0, Number(event.target.value)),
                    )
                  }
                  placeholder="0"
                />
              </Field>

              <Field label="Currency">
                <Input
                  value={form.currency}
                  onChange={(event) =>
                    updateField("currency", event.target.value)
                  }
                  placeholder="NGN"
                />
              </Field>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {booking ? "Save Changes" : "Create Booking"}
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
</AnimatePresence>

);
}
