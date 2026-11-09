"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Input from "@/components/forms/Input";
import Badge from "@/components/ui/Badge";

export interface ChangePassengerDetails {
  passengerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ChangePassengerRequest {
  bookingReference: string;
  passengers: ChangePassengerDetails[];
}

interface ChangePassengerFormProps {
  bookingReference: string;
  passengers?: ChangePassengerDetails[];
  onSubmit?: (
    request: ChangePassengerRequest,
  ) => void | Promise<void>;
  onCancel?: () => void;
}

const MOCK_PASSENGERS: ChangePassengerDetails[] = [
  {
    passengerId: "PAX-001",
    firstName: "Ade",
    lastName: "Johnson",
    email: "ade.johnson@example.com",
    phone: "+2348012345678",
  },
];

export default function ChangePassengerForm({
  bookingReference,
  passengers = MOCK_PASSENGERS,
  onSubmit,
  onCancel,
}: ChangePassengerFormProps) {
  const [formPassengers, setFormPassengers] =
    useState<ChangePassengerDetails[]>(() =>
      passengers.map((passenger) => ({ ...passenger })),
    );

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const updatePassenger = (
    index: number,
    field: keyof ChangePassengerDetails,
    value: string,
  ) => {
    setFormPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index
          ? { ...passenger, [field]: value }
          : passenger,
      ),
    );

    const errorKey = `${index}.${field}`;

    setErrors((current) => {
      const next = { ...current };
      delete next[errorKey];
      return next;
    });

    setSubmitError("");
    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    formPassengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) {
        nextErrors[`${index}.firstName`] =
          "First name is required.";
      }

      if (!passenger.lastName.trim()) {
        nextErrors[`${index}.lastName`] =
          "Last name is required.";
      }

      if (
        passenger.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          passenger.email.trim(),
        )
      ) {
        nextErrors[`${index}.email`] =
          "Enter a valid email address.";
      }

      if (
        passenger.phone.trim() &&
        !/^[+()\d\s-]{7,20}$/.test(
          passenger.phone.trim(),
        )
      ) {
        nextErrors[`${index}.phone`] =
          "Enter a valid phone number.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setSubmitError("");
    setSuccess(false);

    if (!bookingReference.trim()) {
      setSubmitError(
        "A valid booking reference is required.",
      );
      return;
    }

    if (formPassengers.length === 0) {
      setSubmitError(
        "No passenger details are available to update.",
      );
      return;
    }

    if (!validate()) {
      setSubmitError(
        "Please correct the highlighted fields.",
      );
      return;
    }

    if (!onSubmit) {
      setSubmitError(
        "Passenger updates are not connected yet. Please try again when the booking service is available.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        bookingReference: bookingReference
          .trim()
          .toUpperCase(),
        passengers: formPassengers.map((passenger) => ({
          ...passenger,
          firstName: passenger.firstName.trim(),
          lastName: passenger.lastName.trim(),
          email: passenger.email.trim(),
          phone: passenger.phone.trim(),
        })),
      });

      setSuccess(true);
    } catch {
      setSubmitError(
        "We couldn't submit your passenger update. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="info">
              Passenger management
            </Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Update passenger details
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Review passenger information attached to
              your booking and request corrections where
              necessary.
            </p>

            <p className="mt-4 text-sm text-blue-200">
              Booking reference:{" "}
              <span className="font-semibold text-white">
                {bookingReference || "Not provided"}
              </span>
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <UsersRound className="h-9 w-9" />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {formPassengers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <UserRound className="mx-auto h-8 w-8 text-slate-400" />

            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
              No passengers found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              No passenger details are available for
              this booking.
            </p>
          </div>
        ) : (
          formPassengers.map((passenger, index) => (
            <motion.div
              key={`${passenger.passengerId}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.05,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Passenger {index + 1}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Correct the information that needs
                    updating.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`firstName-${index}`}
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    First name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <Input
                    name={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "firstName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter first name"
                  />

                  {errors[`${index}.firstName`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`${index}.firstName`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`lastName-${index}`}
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Last name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <Input
                    name={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "lastName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter last name"
                  />

                  {errors[`${index}.lastName`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`${index}.lastName`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`email-${index}`}
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <Mail className="h-4 w-4" />
                    Email address
                  </label>

                  <Input
                    name={`email-${index}`}
                    value={passenger.email}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="name@example.com"
                  />

                  {errors[`${index}.email`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`${index}.email`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`phone-${index}`}
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <Phone className="h-4 w-4" />
                    Phone number
                  </label>

                  <Input
                    name={`phone-${index}`}
                    value={passenger.phone}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "phone",
                        event.target.value,
                      )
                    }
                    placeholder="+234..."
                  />

                  {errors[`${index}.phone`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`${index}.phone`]}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="text-sm leading-6 text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Passenger names
            must match the travel document. This form
            submits a change request; it does not
            automatically change an issued ticket.
            Airline approval may be required.
          </p>
        </div>

        {submitError && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {submitError}
          </p>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Update request submitted
              </p>

              <p className="mt-1">
                Your connected submission handler
                completed successfully. Airline approval
                may still be required.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {onCancel && (
            <OutlineButton
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </OutlineButton>
          )}

          <PrimaryButton
            type="submit"
            disabled={
              isSubmitting ||
              formPassengers.length === 0
            }
            loading={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit passenger update"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}