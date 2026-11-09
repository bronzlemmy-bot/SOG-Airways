"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  Plane,
  Save,
  X,
} from "lucide-react";

import type {
  CabinClass,
  Flight,
  FlightStatus,
  FlightType,
} from "@/types/flight";
import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export interface FlightFormValues {
  flightNumber: string;
  aircraftId: string;
  aircraftRegistration: string;
  type: FlightType;
  status: FlightStatus;
  departureAirportId: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportId: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  durationMinutes: number;
  terminal: string;
  departureGate: string;
  arrivalGate: string;
  baggageClaim: string;
  availableSeats: number;
  totalSeats: number;
  cabinClasses: CabinClass[];
  price: number;
  currency: string;
  delayMinutes: number;
  delayReason: string;
  cancellationReason: string;
}

interface FlightFormProps {
  flight?: Flight | null;
  onSubmit: (values: FlightFormValues) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium-economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];

const STATUS_OPTIONS: { value: FlightStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "boarding", label: "Boarding" },
  { value: "departed", label: "Departed" },
  { value: "in-air", label: "In Air" },
  { value: "landed", label: "Landed" },
  { value: "delayed", label: "Delayed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "diverted", label: "Diverted" },
];

const INITIAL_VALUES: FlightFormValues = {
  flightNumber: "",
  aircraftId: "",
  aircraftRegistration: "",
  type: "domestic",
  status: "scheduled",
  departureAirportId: "",
  departureAirportCode: "",
  departureAirportName: "",
  arrivalAirportId: "",
  arrivalAirportCode: "",
  arrivalAirportName: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  durationMinutes: 60,
  terminal: "",
  departureGate: "",
  arrivalGate: "",
  baggageClaim: "",
  availableSeats: 0,
  totalSeats: 180,
  cabinClasses: ["economy"],
  price: 0,
  currency: "NGN",
  delayMinutes: 0,
  delayReason: "",
  cancellationReason: "",
};

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800";

const labelClass =
  "block text-sm font-semibold text-slate-700 dark:text-slate-200";

function toDateInput(value: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function getInitialValues(flight?: Flight | null): FlightFormValues {
  if (!flight) {
    return {
      ...INITIAL_VALUES,
      cabinClasses: [...INITIAL_VALUES.cabinClasses],
    };
  }

  return {
    flightNumber: flight.flightNumber,
    aircraftId: flight.aircraftId,
    aircraftRegistration: flight.aircraftRegistration ?? "",
    type: flight.type,
    status: flight.status,
    departureAirportId: flight.route.departureAirportId,
    departureAirportCode: flight.route.departureAirportCode,
    departureAirportName: flight.route.departureAirportName,
    arrivalAirportId: flight.route.arrivalAirportId,
    arrivalAirportCode: flight.route.arrivalAirportCode,
    arrivalAirportName: flight.route.arrivalAirportName,
    departureDate: toDateInput(flight.schedule.departureDate),
    departureTime: flight.schedule.departureTime,
    arrivalDate: toDateInput(flight.schedule.arrivalDate),
    arrivalTime: flight.schedule.arrivalTime,
    durationMinutes: flight.schedule.durationMinutes,
    terminal: flight.terminal ?? "",
    departureGate: flight.departureGate ?? "",
    arrivalGate: flight.arrivalGate ?? "",
    baggageClaim: flight.baggageClaim ?? "",
    availableSeats: flight.availableSeats,
    totalSeats: flight.totalSeats,
    cabinClasses: [...flight.cabinClasses],
    price: flight.price,
    currency: flight.currency || "NGN",
    delayMinutes: flight.delayMinutes ?? 0,
    delayReason: flight.delayReason ?? "",
    cancellationReason: flight.cancellationReason ?? "",
  };
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  required,
  children,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function FlightForm({
  flight = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  className = "",
}: FlightFormProps) {
  const [values, setValues] = useState<FlightFormValues>(() =>
    getInitialValues(flight),
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = <K extends keyof FlightFormValues>(
    key: K,
    value: FlightFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));

    setValidationErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });

    setSubmitError(null);
  };

  const toggleCabin = (cabin: CabinClass) => {
    setValues((current) => {
      const selected = current.cabinClasses.includes(cabin);

      return {
        ...current,
        cabinClasses: selected
          ? current.cabinClasses.filter((item) => item !== cabin)
          : [...current.cabinClasses, cabin],
      };
    });

    setValidationErrors((current) => {
      const next = { ...current };
      delete next.cabinClasses;
      return next;
    });

    setSubmitError(null);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!values.flightNumber.trim()) {
      next.flightNumber = "Enter a flight number.";
    }

    if (!values.aircraftId.trim()) {
      next.aircraftId = "Enter an aircraft ID.";
    }

    if (!values.departureAirportCode.trim()) {
      next.departureAirportCode = "Enter a departure airport code.";
    }

    if (!values.departureAirportName.trim()) {
      next.departureAirportName = "Enter a departure airport name.";
    }

    if (!values.arrivalAirportCode.trim()) {
      next.arrivalAirportCode = "Enter an arrival airport code.";
    }

    if (!values.arrivalAirportName.trim()) {
      next.arrivalAirportName = "Enter an arrival airport name.";
    }

    if (
      values.departureAirportCode.trim().toUpperCase() ===
        values.arrivalAirportCode.trim().toUpperCase() &&
      values.departureAirportCode.trim()
    ) {
      next.arrivalAirportCode =
        "Departure and arrival airports must be different.";
    }

    if (!values.departureDate) {
      next.departureDate = "Select a departure date.";
    }

    if (!values.departureTime) {
      next.departureTime = "Select a departure time.";
    }

    if (!values.arrivalDate) {
      next.arrivalDate = "Select an arrival date.";
    }

    if (!values.arrivalTime) {
      next.arrivalTime = "Select an arrival time.";
    }

    if (
      values.departureDate &&
      values.arrivalDate &&
      values.departureTime &&
      values.arrivalTime
    ) {
      const departure = new Date(
        `${values.departureDate}T${values.departureTime}`,
      ).getTime();

      const arrival = new Date(
        `${values.arrivalDate}T${values.arrivalTime}`,
      ).getTime();

      if (
        !Number.isFinite(departure) ||
        !Number.isFinite(arrival) ||
        arrival <= departure
      ) {
        next.arrivalTime =
          "Arrival must be after departure. Check the dates and times.";
      }
    }

    if (
      !Number.isFinite(values.durationMinutes) ||
      values.durationMinutes <= 0
    ) {
      next.durationMinutes = "Duration must be greater than zero.";
    }

    if (
      !Number.isInteger(values.totalSeats) ||
      values.totalSeats <= 0
    ) {
      next.totalSeats = "Total seats must be a positive whole number.";
    }

    if (
      !Number.isInteger(values.availableSeats) ||
      values.availableSeats < 0 ||
      values.availableSeats > values.totalSeats
    ) {
      next.availableSeats =
        "Available seats must be between zero and total seats.";
    }

    if (!Number.isFinite(values.price) || values.price < 0) {
      next.price = "Enter a valid non-negative fare.";
    }

    if (!/^[A-Z]{3}$/.test(values.currency.trim().toUpperCase())) {
      next.currency = "Enter a three-letter currency code, e.g. NGN.";
    }

    if (values.cabinClasses.length === 0) {
      next.cabinClasses = "Select at least one cabin class.";
    }

    if (
      values.status === "delayed" &&
      (!Number.isFinite(values.delayMinutes) || values.delayMinutes < 0)
    ) {
      next.delayMinutes = "Delay minutes cannot be negative.";
    }

    if (
      values.status === "delayed" &&
      !values.delayReason.trim()
    ) {
      next.delayReason = "Provide a reason for the delay.";
    }

    if (
      values.status === "cancelled" &&
      !values.cancellationReason.trim()
    ) {
      next.cancellationReason =
        "Provide a reason for cancelling the flight.";
    }

    setValidationErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setSubmitError(null);

    if (!validate()) {
      setSubmitError("Please correct the highlighted fields.");
      return;
    }

    try {
      await onSubmit({
        ...values,
        flightNumber: values.flightNumber.trim().toUpperCase(),
        aircraftId: values.aircraftId.trim(),
        aircraftRegistration: values.aircraftRegistration.trim(),
        departureAirportId:
          values.departureAirportId.trim() ||
          values.departureAirportCode.trim().toUpperCase(),
        departureAirportCode:
          values.departureAirportCode.trim().toUpperCase(),
        departureAirportName: values.departureAirportName.trim(),
        arrivalAirportId:
          values.arrivalAirportId.trim() ||
          values.arrivalAirportCode.trim().toUpperCase(),
        arrivalAirportCode:
          values.arrivalAirportCode.trim().toUpperCase(),
        arrivalAirportName: values.arrivalAirportName.trim(),
        currency: values.currency.trim().toUpperCase(),
        terminal: values.terminal.trim(),
        departureGate: values.departureGate.trim(),
        arrivalGate: values.arrivalGate.trim(),
        baggageClaim: values.baggageClaim.trim(),
        delayReason: values.delayReason.trim(),
        cancellationReason: values.cancellationReason.trim(),
      });
    } catch (caught) {
      setSubmitError(
        caught instanceof Error
          ? caught.message
          : "The flight could not be saved. Please try again.",
      );
    }
  };

  const isEditing = Boolean(flight);

  let farePreview = "—";

  if (
    Number.isFinite(values.price) &&
    /^[A-Z]{3}$/.test(values.currency.trim().toUpperCase())
  ) {
    try {
      farePreview = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: values.currency.trim().toUpperCase(),
        maximumFractionDigits: 2,
      }).format(values.price);
    } catch {
      farePreview = `${values.currency.toUpperCase()} ${values.price.toLocaleString()}`;
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      noValidate
      className={`space-y-7 ${className}`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-900 dark:bg-sky-950/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300">
          <Plane className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit flight details" : "Create a new flight"}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
            {isEditing
              ? "Update the schedule, route, fare, and operational details."
              : "Enter the flight information below to add it to the SOG Airways schedule."}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {(error || submitError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="flex items-start gap-3 overflow-hidden rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{submitError || error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <FormSection
        title="Flight information"
        description="Identify the flight and the aircraft assigned to it."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Flight number" name="flightNumber" required>
            <input
              id="flightNumber"
              value={values.flightNumber}
              onChange={(event) => setField("flightNumber", event.target.value)}
              placeholder="e.g. SOG101"
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.flightNumber && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.flightNumber}
              </p>
            )}
          </Field>

          <Field label="Aircraft ID" name="aircraftId" required>
            <input
              id="aircraftId"
              value={values.aircraftId}
              onChange={(event) => setField("aircraftId", event.target.value)}
              placeholder="e.g. aircraft-001"
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.aircraftId && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.aircraftId}
              </p>
            )}
          </Field>

          <Field label="Aircraft registration" name="aircraftRegistration">
            <input
              id="aircraftRegistration"
              value={values.aircraftRegistration}
              onChange={(event) =>
                setField("aircraftRegistration", event.target.value)
              }
              placeholder="e.g. 5N-SOG"
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field label="Flight type" name="flightType" required>
            <select
              id="flightType"
              value={values.type}
              onChange={(event) =>
                setField("type", event.target.value as FlightType)
              }
              disabled={loading}
              className={inputClass}
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </Field>

          <Field label="Flight status" name="flightStatus" required>
            <select
              id="flightStatus"
              value={values.status}
              onChange={(event) =>
                setField("status", event.target.value as FlightStatus)
              }
              disabled={loading}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Currency" name="currency" required>
            <input
              id="currency"
              value={values.currency}
              onChange={(event) =>
                setField("currency", event.target.value.toUpperCase())
              }
              maxLength={3}
              placeholder="NGN"
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.currency && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.currency}
              </p>
            )}
          </Field>
        </div>
      </FormSection>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <FormSection
        title="Flight route"
        description="Provide the departure and arrival airport information."
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
              Departure airport
            </p>
            <div className="space-y-4">
              <Field
                label="Airport code"
                name="departureAirportCode"
                required
              >
                <input
                  id="departureAirportCode"
                  value={values.departureAirportCode}
                  onChange={(event) =>
                    setField(
                      "departureAirportCode",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="e.g. LOS"
                  maxLength={3}
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.departureAirportCode && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.departureAirportCode}
                  </p>
                )}
              </Field>

              <Field
                label="Airport name"
                name="departureAirportName"
                required
              >
                <input
                  id="departureAirportName"
                  value={values.departureAirportName}
                  onChange={(event) =>
                    setField("departureAirportName", event.target.value)
                  }
                  placeholder="e.g. Murtala Muhammed International Airport"
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.departureAirportName && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.departureAirportName}
                  </p>
                )}
              </Field>

              <Field label="Airport ID" name="departureAirportId">
                <input
                  id="departureAirportId"
                  value={values.departureAirportId}
                  onChange={(event) =>
                    setField("departureAirportId", event.target.value)
                  }
                  placeholder="Optional airport record ID"
                  disabled={loading}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
              Arrival airport
            </p>
            <div className="space-y-4">
              <Field
                label="Airport code"
                name="arrivalAirportCode"
                required
              >
                <input
                  id="arrivalAirportCode"
                  value={values.arrivalAirportCode}
                  onChange={(event) =>
                    setField(
                      "arrivalAirportCode",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="e.g. ABV"
                  maxLength={3}
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.arrivalAirportCode && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.arrivalAirportCode}
                  </p>
                )}
              </Field>

              <Field
                label="Airport name"
                name="arrivalAirportName"
                required
              >
                <input
                  id="arrivalAirportName"
                  value={values.arrivalAirportName}
                  onChange={(event) =>
                    setField("arrivalAirportName", event.target.value)
                  }
                  placeholder="e.g. Nnamdi Azikiwe International Airport"
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.arrivalAirportName && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.arrivalAirportName}
                  </p>
                )}
              </Field>

              <Field label="Airport ID" name="arrivalAirportId">
                <input
                  id="arrivalAirportId"
                  value={values.arrivalAirportId}
                  onChange={(event) =>
                    setField("arrivalAirportId", event.target.value)
                  }
                  placeholder="Optional airport record ID"
                  disabled={loading}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <FormSection
        title="Schedule"
        description="Set departure, arrival, and estimated journey duration."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Departure date" name="departureDate" required>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="departureDate"
                type="date"
                value={values.departureDate}
                onChange={(event) =>
                  setField("departureDate", event.target.value)
                }
                disabled={loading}
                className={`${inputClass} pl-10`}
              />
            </div>
            {validationErrors.departureDate && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.departureDate}
              </p>
            )}
          </Field>

          <Field label="Departure time" name="departureTime" required>
            <input
              id="departureTime"
              type="time"
              value={values.departureTime}
              onChange={(event) =>
                setField("departureTime", event.target.value)
              }
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.departureTime && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.departureTime}
              </p>
            )}
          </Field>

          <Field label="Arrival date" name="arrivalDate" required>
            <input
              id="arrivalDate"
              type="date"
              value={values.arrivalDate}
              onChange={(event) =>
                setField("arrivalDate", event.target.value)
              }
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.arrivalDate && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.arrivalDate}
              </p>
            )}
          </Field>

          <Field label="Arrival time" name="arrivalTime" required>
            <input
              id="arrivalTime"
              type="time"
              value={values.arrivalTime}
              onChange={(event) =>
                setField("arrivalTime", event.target.value)
              }
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.arrivalTime && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.arrivalTime}
              </p>
            )}
          </Field>

          <Field
            label="Duration (minutes)"
            name="durationMinutes"
            required
            hint="Example: 90 minutes = 1 hour 30 minutes."
          >
            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="durationMinutes"
                type="number"
                min={1}
                value={values.durationMinutes}
                onChange={(event) =>
                  setField("durationMinutes", Number(event.target.value))
                }
                disabled={loading}
                className={`${inputClass} pl-10`}
              />
            </div>
            {validationErrors.durationMinutes && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.durationMinutes}
              </p>
            )}
          </Field>
        </div>
      </FormSection>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <FormSection
        title="Cabin classes and pricing"
        description="Choose available cabins and set the base fare for this flight."
      >
        <div>
          <p className={labelClass}>Available cabin classes *</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CABIN_OPTIONS.map((cabin) => {
              const checked = values.cabinClasses.includes(cabin.value);

              return (
                <label
                  key={cabin.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    checked
                      ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCabin(cabin.value)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {cabin.label}
                  </span>
                </label>
              );
            })}
          </div>
          {validationErrors.cabinClasses && (
            <p className="mt-2 text-xs text-rose-600">
              {validationErrors.cabinClasses}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Base fare" name="price" required>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={values.price}
              onChange={(event) =>
                setField("price", Number(event.target.value))
              }
              placeholder="e.g. 85000"
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.price && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.price}
              </p>
            )}
          </Field>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Fare preview
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {farePreview}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Base fare per passenger. Final booking totals may vary.
            </p>
          </div>
        </div>
      </FormSection>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <FormSection
        title="Seat availability"
        description="Record the aircraft capacity and seats currently available."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Total seats" name="totalSeats" required>
            <input
              id="totalSeats"
              type="number"
              min={1}
              step={1}
              value={values.totalSeats}
              onChange={(event) =>
                setField("totalSeats", Number(event.target.value))
              }
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.totalSeats && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.totalSeats}
              </p>
            )}
          </Field>

          <Field label="Available seats" name="availableSeats" required>
            <input
              id="availableSeats"
              type="number"
              min={0}
              max={values.totalSeats}
              step={1}
              value={values.availableSeats}
              onChange={(event) =>
                setField("availableSeats", Number(event.target.value))
              }
              disabled={loading}
              className={inputClass}
            />
            {validationErrors.availableSeats && (
              <p className="mt-1 text-xs text-rose-600">
                {validationErrors.availableSeats}
              </p>
            )}
          </Field>
        </div>
      </FormSection>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <FormSection
        title="Airport operations"
        description="Optional terminal, gate, and baggage claim details."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Terminal" name="terminal">
            <input
              id="terminal"
              value={values.terminal}
              onChange={(event) => setField("terminal", event.target.value)}
              placeholder="e.g. Terminal 2"
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field label="Departure gate" name="departureGate">
            <input
              id="departureGate"
              value={values.departureGate}
              onChange={(event) =>
                setField("departureGate", event.target.value)
              }
              placeholder="e.g. A12"
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field label="Arrival gate" name="arrivalGate">
            <input
              id="arrivalGate"
              value={values.arrivalGate}
              onChange={(event) =>
                setField("arrivalGate", event.target.value)
              }
              placeholder="e.g. B06"
              disabled={loading}
              className={inputClass}
            />
          </Field>

          <Field label="Baggage claim" name="baggageClaim">
            <input
              id="baggageClaim"
              value={values.baggageClaim}
              onChange={(event) =>
                setField("baggageClaim", event.target.value)
              }
              placeholder="e.g. Carousel 3"
              disabled={loading}
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {values.status === "delayed" && (
        <>
          <div className="border-t border-slate-100 dark:border-slate-800" />
          <FormSection title="Delay information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Delay (minutes)" name="delayMinutes" required>
                <input
                  id="delayMinutes"
                  type="number"
                  min={0}
                  value={values.delayMinutes}
                  onChange={(event) =>
                    setField("delayMinutes", Number(event.target.value))
                  }
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.delayMinutes && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.delayMinutes}
                  </p>
                )}
              </Field>

              <Field label="Delay reason" name="delayReason" required>
                <input
                  id="delayReason"
                  value={values.delayReason}
                  onChange={(event) =>
                    setField("delayReason", event.target.value)
                  }
                  placeholder="Explain the delay"
                  disabled={loading}
                  className={inputClass}
                />
                {validationErrors.delayReason && (
                  <p className="mt-1 text-xs text-rose-600">
                    {validationErrors.delayReason}
                  </p>
                )}
              </Field>
            </div>
          </FormSection>
        </>
      )}

      {values.status === "cancelled" && (
        <>
          <div className="border-t border-slate-100 dark:border-slate-800" />
          <FormSection title="Cancellation information">
            <Field
              label="Cancellation reason"
              name="cancellationReason"
              required
            >
              <textarea
                id="cancellationReason"
                value={values.cancellationReason}
                onChange={(event) =>
                  setField("cancellationReason", event.target.value)
                }
                rows={3}
                placeholder="Explain why this flight is cancelled"
                disabled={loading}
                className={inputClass}
              />
              {validationErrors.cancellationReason && (
                <p className="mt-1 text-xs text-rose-600">
                  {validationErrors.cancellationReason}
                </p>
              )}
            </Field>
          </FormSection>
        </>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
        <OutlineButton type="button" onClick={onCancel} disabled={loading}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </OutlineButton>

        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading
            ? "Saving Flight..."
            : isEditing
              ? "Save Changes"
              : "Create Flight"}
        </PrimaryButton>
      </div>
    </motion.form>
  );
}