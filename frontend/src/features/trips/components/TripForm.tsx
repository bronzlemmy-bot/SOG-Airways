
"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  AlertCircle,
  CalendarDays,
  Plane,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";

import type {
  Trip,
  TripSegment,
  TripStatus,
  TripType,
} from "@/types";

import {
  TRIP_DEFAULTS,
  TRIP_STATUSES,
  TRIP_TYPES,
} from "@/constants/trip";

import type { CreateTripData } from "@/services/tripService";

import Modal from "@/components/modals/Modal";

/* =========================================================
   PROPS
========================================================= */

interface TripFormProps {
  isOpen: boolean;
  initialTrip?: Trip | null;
  onClose: () => void;
  onSubmit: (data: CreateTripData) => Promise<void> | void;
  isSubmitting?: boolean;
}

/* =========================================================
   FORM TYPES
========================================================= */

type TripFormValues = Omit<
  CreateTripData,
  "title" | "destination"
> & {
  title: string;
  destination: string;
};

/* =========================================================
   STYLES
========================================================= */

const inputStyles =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500";

const labelStyles =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

const sectionStyles =
  "rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:p-5";

/* =========================================================
   CREATE EMPTY FLIGHT SEGMENT
========================================================= */

function createSegment(): TripSegment {
  return {
    id: `segment-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    flightId: "",
    flightNumber: "",
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
    status: TRIP_DEFAULTS.status,
  };
}

/* =========================================================
   CREATE INITIAL FORM VALUES
========================================================= */

function createInitialValues(
  trip?: Trip | null,
): TripFormValues {
  if (trip) {
    return {
      userId: trip.userId,
      bookingId: trip.bookingId,
      bookingReference: trip.bookingReference,
      title: trip.title ?? "",
      type: trip.type,
      status: trip.status,
      destination: trip.destination ?? "",
      segments:
        trip.segments.length > 0
          ? trip.segments.map((segment) => ({ ...segment }))
          : [createSegment()],
      passengerCount: trip.passengerCount,
      startDate: trip.startDate,
      endDate: trip.endDate,
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  return {
    userId: "",
    bookingId: "",
    bookingReference: "",
    title: "",
    type: TRIP_TYPES[0],
    status: TRIP_DEFAULTS.status,
    destination: "",
    segments: [createSegment()],
    passengerCount: TRIP_DEFAULTS.passengerCount,
    startDate: today,
    endDate: today,
  };
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof Plane;
  children: ReactNode;
}) {
  return (
    <section className={sectionStyles}>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <Icon size={19} aria-hidden="true" />
        </span>

        <div>
          <h3 className="font-bold text-slate-950 dark:text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   REUSABLE FORM FIELD
========================================================= */

function Field({
  label,
  htmlFor,
  required = false,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className={labelStyles}>
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   TRIP FORM
========================================================= */

export default function TripForm({
  isOpen,
  initialTrip = null,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TripFormProps) {
  /*
   * The parent component assigns a changing `key` whenever
   * the modal opens, closes, or switches between trips.
   *
   * That remount initializes the form without synchronously
   * setting state inside an effect.
   */

  const [form, setForm] = useState<TripFormValues>(() =>
    createInitialValues(initialTrip),
  );

  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = Boolean(initialTrip);

  /* =======================================================
     UPDATE GENERAL FORM FIELDS
  ======================================================= */

  function updateForm<K extends keyof TripFormValues>(
    key: K,
    value: TripFormValues[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setFormError(null);
  }

  /* =======================================================
     UPDATE A FLIGHT SEGMENT
  ======================================================= */

  function updateSegment<K extends keyof TripSegment>(
    segmentId: string,
    key: K,
    value: TripSegment[K],
  ) {
    setForm((previous) => ({
      ...previous,
      segments: previous.segments.map((segment) =>
        segment.id === segmentId
          ? {
              ...segment,
              [key]: value,
            }
          : segment,
      ),
    }));

    setFormError(null);
  }

  /* =======================================================
     ADD FLIGHT SEGMENT
  ======================================================= */

  function addSegment() {
    setForm((previous) => ({
      ...previous,
      segments: [
        ...previous.segments,
        createSegment(),
      ],
    }));

    setFormError(null);
  }

  /* =======================================================
     REMOVE FLIGHT SEGMENT
  ======================================================= */

  function removeSegment(segmentId: string) {
    if (form.segments.length <= 1) {
      setFormError(
        "A trip must contain at least one flight segment.",
      );
      return;
    }

    setForm((previous) => ({
      ...previous,
      segments: previous.segments.filter(
        (segment) => segment.id !== segmentId,
      ),
    }));

    setFormError(null);
  }

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  function validateForm(): string | null {
    if (!form.userId.trim()) {
      return "Enter the user ID associated with this trip.";
    }

    if (!form.bookingId.trim()) {
      return "Enter the booking ID associated with this trip.";
    }

    if (!form.bookingReference.trim()) {
      return "Enter the booking reference.";
    }

    if (!form.startDate || !form.endDate) {
      return "Enter both the trip start date and end date.";
    }

    if (form.endDate < form.startDate) {
      return "The trip end date cannot be before its start date.";
    }

    if (
      !Number.isInteger(form.passengerCount) ||
      form.passengerCount < 1
    ) {
      return "Passenger count must be a whole number of at least one.";
    }

    if (form.segments.length === 0) {
      return "Add at least one flight segment.";
    }

    for (
      let index = 0;
      index < form.segments.length;
      index += 1
    ) {
      const segment = form.segments[index];
      const segmentLabel = `Flight segment ${index + 1}`;

      const requiredFields: Array<[string, string]> = [
        ["flight ID", segment.flightId],
        ["flight number", segment.flightNumber],
        ["departure airport ID", segment.departureAirportId],
        ["departure airport code", segment.departureAirportCode],
        ["departure airport name", segment.departureAirportName],
        ["arrival airport ID", segment.arrivalAirportId],
        ["arrival airport code", segment.arrivalAirportCode],
        ["arrival airport name", segment.arrivalAirportName],
        ["departure date", segment.departureDate],
        ["departure time", segment.departureTime],
        ["arrival date", segment.arrivalDate],
        ["arrival time", segment.arrivalTime],
      ];

      const missingField = requiredFields.find(
        ([, value]) => !value.trim(),
      );

      if (missingField) {
        return `${segmentLabel}: enter the ${missingField[0]}.`;
      }

      if (segment.arrivalDate < segment.departureDate) {
        return `${segmentLabel}: arrival date cannot be before departure date.`;
      }

      if (
        segment.arrivalDate === segment.departureDate &&
        segment.arrivalTime < segment.departureTime
      ) {
        return `${segmentLabel}: arrival time cannot be earlier than departure time on the same date.`;
      }
    }

    return null;
  }

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);

    const payload: CreateTripData = {
      userId: form.userId.trim(),
      bookingId: form.bookingId.trim(),
      bookingReference: form.bookingReference.trim(),
      title: form.title.trim() || undefined,
      type: form.type,
      status: form.status,
      destination: form.destination.trim() || undefined,
      segments: form.segments.map((segment) => ({
        ...segment,
      })),
      passengerCount: form.passengerCount,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save this trip. Please try again.",
      );
    }
  }

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  function handleClose() {
    if (isSubmitting) return;

    setFormError(null);
    onClose();
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit trip" : "Create a trip"}
      description={
        isEditing
          ? "Update the trip, booking details, and flight segments."
          : "Add a trip and its associated flight information."
      }
      size="xl"
      showCloseButton
      closeOnOverlayClick={!isSubmitting}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          {/* BOOKING INFORMATION */}

          <FormSection
            title="Booking and ownership"
            description="Associate the trip with its user and booking."
            icon={Users}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="User ID"
                htmlFor="trip-form-user-id"
                required
              >
                <input
                  id="trip-form-user-id"
                  name="userId"
                  autoComplete="off"
                  value={form.userId}
                  onChange={(event) =>
                    updateForm("userId", event.target.value)
                  }
                  placeholder="Enter user ID"
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="Booking ID"
                htmlFor="trip-form-booking-id"
                required
              >
                <input
                  id="trip-form-booking-id"
                  name="bookingId"
                  autoComplete="off"
                  value={form.bookingId}
                  onChange={(event) =>
                    updateForm("bookingId", event.target.value)
                  }
                  placeholder="Enter booking ID"
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="Booking reference"
                htmlFor="trip-form-booking-reference"
                required
              >
                <input
                  id="trip-form-booking-reference"
                  name="bookingReference"
                  autoComplete="off"
                  value={form.bookingReference}
                  onChange={(event) =>
                    updateForm("bookingReference", event.target.value)
                  }
                  placeholder="e.g. SOG8K2P"
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="Trip title"
                htmlFor="trip-form-title"
                hint="Optional label shown to administrators."
              >
                <input
                  id="trip-form-title"
                  name="title"
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  placeholder="e.g. Business trip to London"
                  className={inputStyles}
                  disabled={isSubmitting}
                />
              </Field>
            </div>
          </FormSection>

          {/* TRIP INFORMATION */}

          <FormSection
            title="Trip information"
            description="Set the trip type, status, dates, destination, and passenger count."
            icon={CalendarDays}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Trip type"
                htmlFor="trip-form-type"
                required
              >
                <select
                  id="trip-form-type"
                  name="type"
                  value={form.type}
                  onChange={(event) =>
                    updateForm(
                      "type",
                      event.target.value as TripType,
                    )
                  }
                  className={inputStyles}
                  disabled={isSubmitting}
                >
                  {TRIP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === "one-way"
                        ? "One-way"
                        : type === "round-trip"
                          ? "Round trip"
                          : "Multi-city"}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Trip status"
                htmlFor="trip-form-status"
                required
              >
                <select
                  id="trip-form-status"
                  name="status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as TripStatus,
                    )
                  }
                  className={inputStyles}
                  disabled={isSubmitting}
                >
                  {TRIP_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === "in-progress"
                        ? "In progress"
                        : status.charAt(0).toUpperCase() +
                          status.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Start date"
                htmlFor="trip-form-start-date"
                required
              >
                <input
                  id="trip-form-start-date"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  max={form.endDate || undefined}
                  onChange={(event) =>
                    updateForm("startDate", event.target.value)
                  }
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="End date"
                htmlFor="trip-form-end-date"
                required
              >
                <input
                  id="trip-form-end-date"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(event) =>
                    updateForm("endDate", event.target.value)
                  }
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="Destination"
                htmlFor="trip-form-destination"
              >
                <input
                  id="trip-form-destination"
                  name="destination"
                  value={form.destination}
                  onChange={(event) =>
                    updateForm("destination", event.target.value)
                  }
                  placeholder="e.g. London, United Kingdom"
                  className={inputStyles}
                  disabled={isSubmitting}
                />
              </Field>

              <Field
                label="Passenger count"
                htmlFor="trip-form-passengers"
                required
              >
                <input
                  id="trip-form-passengers"
                  name="passengerCount"
                  type="number"
                  min={1}
                  step={1}
                  value={form.passengerCount}
                  onChange={(event) =>
                    updateForm(
                      "passengerCount",
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value),
                    )
                  }
                  className={inputStyles}
                  required
                  disabled={isSubmitting}
                />
              </Field>
            </div>
          </FormSection>

          {/* FLIGHT SEGMENTS */}

          <FormSection
            title="Flight segments"
            description="Add each flight, including connections and return flights."
            icon={Plane}
          >
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {form.segments.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      overflow: "hidden",
                    }}
                    transition={{ duration: 0.18 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Flight {index + 1}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Flight and airport information
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSegment(segment.id)
                        }
                        disabled={
                          isSubmitting ||
                          form.segments.length <= 1
                        }
                        aria-label={`Remove flight segment ${index + 1}`}
                        title={
                          form.segments.length <= 1
                            ? "A trip needs at least one segment"
                            : "Remove segment"
                        }
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/40"
                      >
                        <Trash2
                          size={16}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Flight ID"
                        htmlFor={`trip-flight-id-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-flight-id-${segment.id}`}
                          value={segment.flightId}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "flightId",
                              event.target.value,
                            )
                          }
                          placeholder="Existing flight ID"
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Flight number"
                        htmlFor={`trip-flight-number-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-flight-number-${segment.id}`}
                          value={segment.flightNumber}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "flightNumber",
                              event.target.value,
                            )
                          }
                          placeholder="e.g. SOG204"
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Departure airport ID"
                        htmlFor={`trip-departure-id-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-departure-id-${segment.id}`}
                          value={segment.departureAirportId}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "departureAirportId",
                              event.target.value,
                            )
                          }
                          placeholder="Airport ID"
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Departure airport code"
                        htmlFor={`trip-departure-code-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-departure-code-${segment.id}`}
                          value={segment.departureAirportCode}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "departureAirportCode",
                              event.target.value.toUpperCase(),
                            )
                          }
                          placeholder="e.g. LOS"
                          maxLength={5}
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field
                          label="Departure airport name"
                          htmlFor={`trip-departure-name-${segment.id}`}
                          required
                        >
                          <input
                            id={`trip-departure-name-${segment.id}`}
                            value={segment.departureAirportName}
                            onChange={(event) =>
                              updateSegment(
                                segment.id,
                                "departureAirportName",
                                event.target.value,
                              )
                            }
                            placeholder="Full departure airport name"
                            className={inputStyles}
                            required
                            disabled={isSubmitting}
                          />
                        </Field>
                      </div>

                      <Field
                        label="Arrival airport ID"
                        htmlFor={`trip-arrival-id-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-arrival-id-${segment.id}`}
                          value={segment.arrivalAirportId}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "arrivalAirportId",
                              event.target.value,
                            )
                          }
                          placeholder="Airport ID"
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Arrival airport code"
                        htmlFor={`trip-arrival-code-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-arrival-code-${segment.id}`}
                          value={segment.arrivalAirportCode}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "arrivalAirportCode",
                              event.target.value.toUpperCase(),
                            )
                          }
                          placeholder="e.g. LHR"
                          maxLength={5}
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field
                          label="Arrival airport name"
                          htmlFor={`trip-arrival-name-${segment.id}`}
                          required
                        >
                          <input
                            id={`trip-arrival-name-${segment.id}`}
                            value={segment.arrivalAirportName}
                            onChange={(event) =>
                              updateSegment(
                                segment.id,
                                "arrivalAirportName",
                                event.target.value,
                              )
                            }
                            placeholder="Full arrival airport name"
                            className={inputStyles}
                            required
                            disabled={isSubmitting}
                          />
                        </Field>
                      </div>

                      <Field
                        label="Departure date"
                        htmlFor={`trip-departure-date-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-departure-date-${segment.id}`}
                          type="date"
                          value={segment.departureDate}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "departureDate",
                              event.target.value,
                            )
                          }
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Departure time"
                        htmlFor={`trip-departure-time-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-departure-time-${segment.id}`}
                          type="time"
                          value={segment.departureTime}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "departureTime",
                              event.target.value,
                            )
                          }
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Arrival date"
                        htmlFor={`trip-arrival-date-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-arrival-date-${segment.id}`}
                          type="date"
                          min={segment.departureDate || undefined}
                          value={segment.arrivalDate}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "arrivalDate",
                              event.target.value,
                            )
                          }
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Arrival time"
                        htmlFor={`trip-arrival-time-${segment.id}`}
                        required
                      >
                        <input
                          id={`trip-arrival-time-${segment.id}`}
                          type="time"
                          value={segment.arrivalTime}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "arrivalTime",
                              event.target.value,
                            )
                          }
                          className={inputStyles}
                          required
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Field
                        label="Segment status"
                        htmlFor={`trip-segment-status-${segment.id}`}
                        required
                      >
                        <select
                          id={`trip-segment-status-${segment.id}`}
                          value={segment.status}
                          onChange={(event) =>
                            updateSegment(
                              segment.id,
                              "status",
                              event.target.value as TripStatus,
                            )
                          }
                          className={inputStyles}
                          disabled={isSubmitting}
                        >
                          {TRIP_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status === "in-progress"
                                ? "In progress"
                                : status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={addSegment}
                disabled={isSubmitting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300 dark:hover:bg-blue-950/50"
              >
                <Plus size={17} aria-hidden="true" />
                Add flight segment
              </button>
            </div>
          </FormSection>
        </div>

        {/* VALIDATION AND SUBMISSION ERRORS */}

        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              role="alert"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <p>{formError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} aria-hidden="true" />

            {isSubmitting
              ? "Saving trip..."
              : isEditing
                ? "Save changes"
                : "Create trip"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
