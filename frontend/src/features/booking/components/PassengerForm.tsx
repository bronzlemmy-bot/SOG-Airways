"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  Globe2,
  User,
  X,
} from "lucide-react";

import type {
  Gender,
  PassengerType,
} from "@/types/passenger";

export interface BookingPassengerFormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  passengerType: PassengerType;
  nationality: string;
  documentType: "passport" | "national-id";
  documentNumber: string;
  documentExpiryDate: string;
}

interface PassengerFormProps {
  passenger: BookingPassengerFormData;
  index: number;
  onChange?: (
    passenger: BookingPassengerFormData,
  ) => void;
  onRemove?: () => void;
  canRemove?: boolean;
  disabled?: boolean;
}

export default function PassengerForm({
  passenger,
  index,
  onChange,
  onRemove,
  canRemove = false,
  disabled = false,
}: PassengerFormProps) {
  const [formData, setFormData] =
    useState<BookingPassengerFormData>(
      passenger,
    );

  const updateField = <
    K extends keyof BookingPassengerFormData,
  >(
    field: K,
    value: BookingPassengerFormData[K],
  ) => {
    setFormData((current) => {
      const updated = {
        ...current,
        [field]: value,
      };

      onChange?.(updated);

      return updated;
    });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <User className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              Passenger {index + 1}
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              Passenger information
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter the passenger details exactly as
              they appear on their travel document.
            </p>
          </div>
        </div>

        {canRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label={`Remove passenger ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-7">
        {/* Personal Information */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-sky-600 dark:text-sky-400" />

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Personal information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor={`first-name-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                First name
              </label>

              <input
                id={`first-name-${passenger.id}`}
                type="text"
                value={formData.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value,
                  )
                }
                disabled={disabled}
                placeholder="First name"
                autoComplete="given-name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor={`middle-name-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Middle name
                <span className="ml-1 text-xs text-slate-400">
                  Optional
                </span>
              </label>

              <input
                id={`middle-name-${passenger.id}`}
                type="text"
                value={formData.middleName}
                onChange={(event) =>
                  updateField(
                    "middleName",
                    event.target.value,
                  )
                }
                disabled={disabled}
                placeholder="Middle name"
                autoComplete="additional-name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor={`last-name-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Last name
              </label>

              <input
                id={`last-name-${passenger.id}`}
                type="text"
                value={formData.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value,
                  )
                }
                disabled={disabled}
                placeholder="Last name"
                autoComplete="family-name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor={`date-of-birth-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Date of birth
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={`date-of-birth-${passenger.id}`}
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(event) =>
                    updateField(
                      "dateOfBirth",
                      event.target.value,
                    )
                  }
                  disabled={disabled}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`gender-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Gender
              </label>

              <select
                id={`gender-${passenger.id}`}
                value={formData.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value as Gender,
                  )
                }
                disabled={disabled}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              >
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
                <option value="other">
                  Other
                </option>
                <option value="prefer-not-to-say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`passenger-type-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Passenger type
              </label>

              <select
                id={`passenger-type-${passenger.id}`}
                value={formData.passengerType}
                onChange={(event) =>
                  updateField(
                    "passengerType",
                    event.target
                      .value as PassengerType,
                  )
                }
                disabled={disabled}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              >
                <option value="adult">
                  Adult
                </option>
                <option value="child">
                  Child
                </option>
                <option value="infant">
                  Infant
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Travel Information */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Travel information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`nationality-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Nationality
              </label>

              <input
                id={`nationality-${passenger.id}`}
                type="text"
                value={formData.nationality}
                onChange={(event) =>
                  updateField(
                    "nationality",
                    event.target.value,
                  )
                }
                disabled={disabled}
                placeholder="e.g. Nigerian"
                autoComplete="country-name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor={`document-type-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Travel document
              </label>

              <select
                id={`document-type-${passenger.id}`}
                value={formData.documentType}
                onChange={(event) =>
                  updateField(
                    "documentType",
                    event.target.value as
                      | "passport"
                      | "national-id",
                  )
                }
                disabled={disabled}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
              >
                <option value="passport">
                  Passport
                </option>
                <option value="national-id">
                  National ID
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`document-number-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Document number
              </label>

              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={`document-number-${passenger.id}`}
                  type="text"
                  value={formData.documentNumber}
                  onChange={(event) =>
                    updateField(
                      "documentNumber",
                      event.target.value,
                    )
                  }
                  disabled={disabled}
                  placeholder="Document number"
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`document-expiry-${passenger.id}`}
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Document expiry date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={`document-expiry-${passenger.id}`}
                  type="date"
                  value={
                    formData.documentExpiryDate
                  }
                  onChange={(event) =>
                    updateField(
                      "documentExpiryDate",
                      event.target.value,
                    )
                  }
                  disabled={disabled}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}