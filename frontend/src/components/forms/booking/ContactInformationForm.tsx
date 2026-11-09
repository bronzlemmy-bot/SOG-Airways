"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone } from "lucide-react";
import Input from "../Input";
import Select from "../Select";
import PrimaryButton from "../../buttons/PrimaryButton";
import FormError from "../FormError";

interface ContactInformationFormData {
  email: string;
  phone: string;
  countryCode: string;
}

interface ContactInformationFormProps {
  initialData?: Partial<ContactInformationFormData>;
  onSubmit?: (data: ContactInformationFormData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  showSubmitButton?: boolean;
}

export default function ContactInformationForm({
  initialData,
  onSubmit,
  loading = false,
  error,
  className = "",
  showSubmitButton = true,
}: ContactInformationFormProps) {
  const [formData, setFormData] =
    useState<ContactInformationFormData>({
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      countryCode: initialData?.countryCode ?? "+1",
    });

  const updateField = (
    field: keyof ContactInformationFormData,
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
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          We&apos;ll use these details to send your booking
          confirmation and important flight updates.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <div className="space-y-5">
        <Input
          id="booking-email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          leftIcon={<Mail className="h-5 w-5" />}
          autoComplete="email"
          required
        />

        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <Select
            id="booking-country-code"
            label="Country Code"
            value={formData.countryCode}
            onChange={(event) =>
              updateField("countryCode", event.target.value)
            }
            options={[
              { label: "+1 — USA", value: "+1" },
              { label: "+44 — UK", value: "+44" },
              { label: "+234 — Nigeria", value: "+234" },
              { label: "+91 — India", value: "+91" },
              { label: "+33 — France", value: "+33" },
              { label: "+49 — Germany", value: "+49" },
              { label: "+81 — Japan", value: "+81" },
              { label: "+86 — China", value: "+86" },
              { label: "+971 — UAE", value: "+971" },
              { label: "+61 — Australia", value: "+61" },
            ]}
            required
          />

          <Input
            id="booking-phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            leftIcon={<Phone className="h-5 w-5" />}
            autoComplete="tel"
            required
          />
        </div>
      </div>

      {showSubmitButton && (
        <div className="mt-6 flex justify-end">
          <PrimaryButton
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Save Contact Information
          </PrimaryButton>
        </div>
      )}
    </form>
  );
}

export type { ContactInformationFormData };