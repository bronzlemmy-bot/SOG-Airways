"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  IdCard,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Input from "@/components/forms/Input";
import FormField from "@/components/forms/FormField";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";

import type { CheckInPassenger } from "@/types";

export type PassengerDocumentType =
  | "passport"
  | "national-id"
  | "drivers-license";

export interface PassengerVerificationData {
  passengerId: string;
  documentType: PassengerDocumentType;
  documentNumber: string;
  dateOfBirth: string;
  expiryDate: string;
  nationality: string;
}

interface PassengerVerificationProps {
  passenger: CheckInPassenger;
  initialValues?: Partial<PassengerVerificationData>;
  onSubmit: (
    data: PassengerVerificationData,
  ) => void | Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  error?: string | null;
  verified?: boolean;
  className?: string;
}

const DOCUMENT_OPTIONS: {
  value: PassengerDocumentType;
  label: string;
  description: string;
}[] = [
  {
    value: "passport",
    label: "Passport",
    description: "For international travel and passport-based identification.",
  },
  {
    value: "national-id",
    label: "National ID",
    description: "Use a valid national identity document where accepted.",
  },
  {
    value: "drivers-license",
    label: "Driver's license",
    description: "Use only where this document is accepted for your journey.",
  },
];

export default function PassengerVerification({
  passenger,
  initialValues,
  onSubmit,
  onBack,
  loading = false,
  error = null,
  verified = false,
  className = "",
}: PassengerVerificationProps) {
  const [formData, setFormData] =
    useState<PassengerVerificationData>({
      passengerId: passenger.passengerId,
      documentType: initialValues?.documentType ?? "passport",
      documentNumber: initialValues?.documentNumber ?? "",
      dateOfBirth: initialValues?.dateOfBirth ?? "",
      expiryDate: initialValues?.expiryDate ?? "",
      nationality: initialValues?.nationality ?? "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PassengerVerificationData, string>>
  >({});

  const updateField = <K extends keyof PassengerVerificationData>(
    field: K,
    value: PassengerVerificationData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof PassengerVerificationData, string>
    > = {};

    if (!formData.documentNumber.trim()) {
      nextErrors.documentNumber = "Enter your document number.";
    } else if (formData.documentNumber.trim().length < 4) {
      nextErrors.documentNumber =
        "Enter a valid document number.";
    }

    if (!formData.dateOfBirth) {
      nextErrors.dateOfBirth = "Enter your date of birth.";
    } else {
      const birthDate = new Date(`${formData.dateOfBirth}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        Number.isNaN(birthDate.getTime()) ||
        birthDate >= today
      ) {
        nextErrors.dateOfBirth =
          "Date of birth must be a valid date in the past.";
      }
    }

    if (!formData.expiryDate) {
      nextErrors.expiryDate = "Enter your document expiry date.";
    } else {
      const expiryDate = new Date(`${formData.expiryDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(expiryDate.getTime())) {
        nextErrors.expiryDate =
          "Enter a valid document expiry date.";
      } else if (expiryDate < today) {
        nextErrors.expiryDate =
          "Your document appears to have expired.";
      }
    }

    if (!formData.nationality.trim()) {
      nextErrors.nationality = "Enter your nationality.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (verified || loading || !validate()) return;

    await onSubmit({
      ...formData,
      passengerId: passenger.passengerId,
      documentNumber: formData.documentNumber.trim().toUpperCase(),
      nationality: formData.nationality.trim(),
    });
  };

  const fullName =
    `${passenger.firstName} ${passenger.lastName}`.trim();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  SOG Airways
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Passenger verification
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                  Confirm your identity details before proceeding
                  with check-in.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">
                  Passenger
                </p>
                <p className="mt-1 truncate font-semibold text-slate-900">
                  {fullName || "Passenger"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Passenger ID: {passenger.passengerId}
                </p>
              </div>

              <Badge variant={verified ? "success" : "warning"}>
                {verified ? "Verified" : "Verification required"}
              </Badge>
            </div>

            {verified ? (
              <div
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                <h2 className="mt-3 font-bold text-emerald-950">
                  Passenger verification complete
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  The parent workflow has marked this passenger
                  as verified. You can continue to the next step.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Select identification document
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Choose a document accepted for your destination
                    and itinerary.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {DOCUMENT_OPTIONS.map((option) => {
                      const selected =
                        formData.documentType === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updateField("documentType", option.value)
                          }
                          disabled={loading}
                          aria-pressed={selected}
                          className={`rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/15"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <IdCard
                            className={`h-5 w-5 ${
                              selected
                                ? "text-sky-700"
                                : "text-slate-500"
                            }`}
                          />
                          <p className="mt-3 text-sm font-semibold text-slate-900">
                            {option.label}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Document number"
                    htmlFor="documentNumber"
                    error={errors.documentNumber}
                    required
                  >
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={(event) =>
                        updateField(
                          "documentNumber",
                          event.target.value,
                        )
                      }
                      placeholder="Enter document number"
                      autoComplete="off"
                      disabled={loading}
                    />
                  </FormField>

                  <FormField
                    label="Nationality"
                    htmlFor="nationality"
                    error={errors.nationality}
                    required
                  >
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={(event) =>
                        updateField(
                          "nationality",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Nigerian"
                      autoComplete="country-name"
                      disabled={loading}
                    />
                  </FormField>

                  <FormField
                    label="Date of birth"
                    htmlFor="dateOfBirth"
                    error={errors.dateOfBirth}
                    required
                  >
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(event) =>
                        updateField(
                          "dateOfBirth",
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      autoComplete="bday"
                    />
                  </FormField>

                  <FormField
                    label="Document expiry date"
                    htmlFor="expiryDate"
                    error={errors.expiryDate}
                    required
                  >
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(event) =>
                        updateField(
                          "expiryDate",
                          event.target.value,
                        )
                      }
                      disabled={loading}
                    />
                  </FormField>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-sm font-semibold text-amber-950">
                      Protect your personal information
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Enter accurate details. This form does not
                      itself verify document authenticity; your
                      check-in workflow or airline staff must
                      confirm eligibility and identity.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  {onBack ? (
                    <OutlineButton
                      type="button"
                      onClick={onBack}
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </OutlineButton>
                  ) : (
                    <span />
                  )}

                  <PrimaryButton
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    Submit Verification
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </PrimaryButton>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 px-2">
          <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
          <p className="text-xs leading-5 text-slate-500">
            Required documents can vary by route and destination.
            Confirm the applicable travel-document requirements
            before departure.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
