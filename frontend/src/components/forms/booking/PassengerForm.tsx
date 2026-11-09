"use client";

import { FormEvent, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import PrimaryButton from "../../buttons/PrimaryButton";
import FormError from "../FormError";

interface PassengerFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
}

interface PassengerFormProps {
  initialData?: Partial<PassengerFormData>;
  onSubmit?: (data: PassengerFormData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  showSubmitButton?: boolean;
}

export default function PassengerForm({
  initialData,
  onSubmit,
  loading = false,
  error,
  className = "",
  showSubmitButton = true,
}: PassengerFormProps) {
  const [formData, setFormData] = useState<PassengerFormData>({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    dateOfBirth: initialData?.dateOfBirth ?? "",
    gender: initialData?.gender ?? "",
    nationality: initialData?.nationality ?? "",
    passportNumber: initialData?.passportNumber ?? "",
    passportExpiry: initialData?.passportExpiry ?? "",
  });

  const updateField = (
    field: keyof PassengerFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Passenger Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the passenger details exactly as they appear on
          the travel document.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="passenger-first-name"
          label="First Name"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(event) =>
            updateField("firstName", event.target.value)
          }
          autoComplete="given-name"
          required
        />

        <Input
          id="passenger-last-name"
          label="Last Name"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(event) =>
            updateField("lastName", event.target.value)
          }
          autoComplete="family-name"
          required
        />

        <Input
          id="passenger-date-of-birth"
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(event) =>
            updateField("dateOfBirth", event.target.value)
          }
          required
        />

        <Select
          id="passenger-gender"
          label="Gender"
          value={formData.gender}
          onChange={(event) =>
            updateField("gender", event.target.value)
          }
          placeholder="Select gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ]}
          required
        />

        <Input
          id="passenger-nationality"
          label="Nationality"
          placeholder="Enter nationality"
          value={formData.nationality}
          onChange={(event) =>
            updateField("nationality", event.target.value)
          }
          autoComplete="country-name"
          required
        />

        <Input
          id="passenger-passport-number"
          label="Passport Number"
          placeholder="Enter passport number"
          value={formData.passportNumber}
          onChange={(event) =>
            updateField("passportNumber", event.target.value)
          }
          autoComplete="off"
          required
        />

        <Input
          id="passenger-passport-expiry"
          label="Passport Expiry"
          type="date"
          value={formData.passportExpiry}
          onChange={(event) =>
            updateField("passportExpiry", event.target.value)
          }
          required
        />
      </div>

      {showSubmitButton && (
        <div className="mt-6 flex justify-end">
          <PrimaryButton
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Save Passenger
          </PrimaryButton>
        </div>
      )}
    </form>
  );
}

export type { PassengerFormData };