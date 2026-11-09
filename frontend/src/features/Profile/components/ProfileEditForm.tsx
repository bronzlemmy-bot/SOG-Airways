
"use client";

import { useId, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
 
  Globe2,
  Hash,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export type ProfileFormErrors = Partial<
  Record<keyof ProfileFormValues, string>
>;

interface ProfileEditFormProps {
  values: ProfileFormValues;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel: () => void;
  isSaving?: boolean;
  errors?: ProfileFormErrors;
}

interface TextFieldProps {
  id: string;
  name: keyof ProfileFormValues;
  label: string;
  value: string;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  error?: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

const inputClasses =
  "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

function TextField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
}: TextFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClasses} ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : ""
        }`}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileEditForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isSaving = false,
  errors = {},
}: ProfileEditFormProps) {
  const rawId = useId();
  const formId = rawId.replace(/:/g, "");

  const fieldId = (field: keyof ProfileFormValues) =>
    `${formId}-${field}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    onSubmit(values);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-6 dark:border-slate-800 dark:from-blue-950/30 dark:via-slate-950 dark:to-indigo-950/20 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Keep your personal and contact information accurate and up to date.
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          Fields marked with <span className="font-bold text-red-500">*</span> are required.
        </p>
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        <section aria-labelledby={`${formId}-personal-heading`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <UserRound className="h-4 w-4" />
            </div>

            <div>
              <h3
                id={`${formId}-personal-heading`}
                className="font-bold text-slate-900 dark:text-white"
              >
                Personal Information
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Your name and personal details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              id={fieldId("firstName")}
              name="firstName"
              label="First Name"
              value={values.firstName}
              onChange={onChange}
              error={errors.firstName}
              placeholder="Enter first name"
              autoComplete="given-name"
              required
            />

            <TextField
              id={fieldId("lastName")}
              name="lastName"
              label="Last Name"
              value={values.lastName}
              onChange={onChange}
              error={errors.lastName}
              placeholder="Enter last name"
              autoComplete="family-name"
              required
            />

            <TextField
              id={fieldId("dateOfBirth")}
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={values.dateOfBirth}
              onChange={onChange}
              error={errors.dateOfBirth}
              autoComplete="bday"
            />

            <div className="min-w-0 space-y-2">
              <label
                htmlFor={fieldId("gender")}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Gender
              </label>

              <div className="relative">
                <VenusAndMars className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  id={fieldId("gender")}
                  name="gender"
                  value={values.gender}
                  onChange={(event) => onChange("gender", event.currentTarget.value)}
                  aria-invalid={Boolean(errors.gender)}
                  className={`${inputClasses} appearance-none pl-10`}
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {errors.gender && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <section aria-labelledby={`${formId}-contact-heading`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Mail className="h-4 w-4" />
            </div>

            <div>
              <h3
                id={`${formId}-contact-heading`}
                className="font-bold text-slate-900 dark:text-white"
              >
                Contact Information
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                How the airline can reach you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              id={fieldId("email")}
              name="email"
              label="Email Address"
              type="email"
              value={values.email}
              onChange={onChange}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div className="min-w-0 space-y-2">
              <label
                htmlFor={fieldId("phone")}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={fieldId("phone")}
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={(event) => onChange("phone", event.currentTarget.value)}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${fieldId("phone")}-error` : undefined}
                  className={`${inputClasses} pl-10`}
                />
              </div>

              {errors.phone && (
                <p id={`${fieldId("phone")}-error`} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <section aria-labelledby={`${formId}-address-heading`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <MapPin className="h-4 w-4" />
            </div>

            <div>
              <h3
                id={`${formId}-address-heading`}
                className="font-bold text-slate-900 dark:text-white"
              >
                Address Information
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Your residential or mailing address.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0 space-y-2 sm:col-span-2">
              <label
                htmlFor={fieldId("address")}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Street Address
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400" />

                <textarea
                  id={fieldId("address")}
                  name="address"
                  value={values.address}
                  onChange={(event) => onChange("address", event.currentTarget.value)}
                  placeholder="Enter your street address"
                  autoComplete="street-address"
                  rows={3}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? `${fieldId("address")}-error` : undefined}
                  className={`${inputClasses} min-h-24 resize-y pl-10`}
                />
              </div>

              {errors.address && (
                <p id={`${fieldId("address")}-error`} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.address}
                </p>
              )}
            </div>

            <TextField
              id={fieldId("city")}
              name="city"
              label="City"
              value={values.city}
              onChange={onChange}
              error={errors.city}
              placeholder="Enter city"
              autoComplete="address-level2"
            />

            <div className="min-w-0 space-y-2">
              <label
                htmlFor={fieldId("country")}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Country
              </label>

              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={fieldId("country")}
                  name="country"
                  type="text"
                  value={values.country}
                  onChange={(event) => onChange("country", event.currentTarget.value)}
                  placeholder="Enter country"
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                  className={`${inputClasses} pl-10`}
                />
              </div>

              {errors.country && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.country}
                </p>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <label
                htmlFor={fieldId("postalCode")}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Postal Code
              </label>

              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={fieldId("postalCode")}
                  name="postalCode"
                  type="text"
                  value={values.postalCode}
                  onChange={(event) => onChange("postalCode", event.currentTarget.value)}
                  placeholder="Enter postal code"
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.postalCode)}
                  className={`${inputClasses} pl-10`}
                />
              </div>

              {errors.postalCode && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
