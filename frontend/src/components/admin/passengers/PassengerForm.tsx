"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
CalendarDays,
Check,
Loader2,
Mail,
Phone,
User,
X,
} from "lucide-react";

import type {
AdminPassenger,
PassengerGender,
PassengerStatus,
} from "./admin-passengers-data/AdminPassengersData";

export interface PassengerFormData {
firstName: string;
lastName: string;
email: string;
phone: string;
gender: PassengerGender;
dateOfBirth: string;
nationality: string;
passportNumber: string;
passportExpiry: string;
status: PassengerStatus;
}

interface PassengerFormProps {
passenger?: AdminPassenger | null;
onSubmit: (data: PassengerFormData) => void;
onCancel: () => void;
isSubmitting?: boolean;
}

interface FormErrors {
firstName?: string;
lastName?: string;
email?: string;
phone?: string;
gender?: string;
dateOfBirth?: string;
nationality?: string;
passportNumber?: string;
passportExpiry?: string;
status?: string;
}

const genderOptions: Array<{
value: PassengerGender;
label: string;
}> = [
{
value: "male",
label: "Male",
},
{
value: "female",
label: "Female",
},
{
value: "other",
label: "Other",
},
];

const statusOptions: Array<{
value: PassengerStatus;
label: string;
}> = [
{
value: "active",
label: "Active",
},
{
value: "inactive",
label: "Inactive",
},
{
value: "pending",
label: "Pending",
},
{
value: "suspended",
label: "Suspended",
},
];

const nationalityOptions = [
"Nigerian",
"British",
"American",
"Ghanaian",
"Canadian",
"Portuguese",
"South African",
"Kenyan",
"French",
"German",
"Spanish",
"Italian",
"Other",
];

function createInitialForm(
passenger?: AdminPassenger | null,
): PassengerFormData {
return {
firstName: passenger?.firstName ?? "",
lastName: passenger?.lastName ?? "",
email: passenger?.email ?? "",
phone: passenger?.phone ?? "",
gender: passenger?.gender ?? "other",
dateOfBirth: passenger?.dateOfBirth ?? "",
nationality: passenger?.nationality ?? "",
passportNumber: passenger?.passportNumber ?? "",
passportExpiry: passenger?.passportExpiry ?? "",
status: passenger?.status ?? "pending",
};
}

function validateForm(values: PassengerFormData): FormErrors {
const errors: FormErrors = {};

if (!values.firstName.trim()) {
errors.firstName = "First name is required.";
}

if (!values.lastName.trim()) {
errors.lastName = "Last name is required.";
}

if (!values.email.trim()) {
errors.email = "Email address is required.";
} else if (
!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(values.email.trim())
) {
errors.email = "Enter a valid email address.";
}

if (!values.phone.trim()) {
errors.phone = "Phone number is required.";
}

if (!values.gender) {
errors.gender = "Please select a gender.";
}

if (!values.dateOfBirth) {
errors.dateOfBirth = "Date of birth is required.";
}

if (!values.nationality.trim()) {
errors.nationality = "Nationality is required.";
}

if (!values.passportNumber.trim()) {
errors.passportNumber = "Passport number is required.";
}

if (!values.passportExpiry) {
errors.passportExpiry = "Passport expiry date is required.";
} else {
const expiryDate = new Date(values.passportExpiry);
const today = new Date();


if (expiryDate <= today) {
  errors.passportExpiry =
    "Passport expiry date must be in the future.";
}


}

if (!values.status) {
errors.status = "Please select a passenger status.";
}

return errors;
}

export default function PassengerForm({
passenger = null,
onSubmit,
onCancel,
isSubmitting = false,
}: PassengerFormProps) {
const [form, setForm] = useState<PassengerFormData>(() =>
createInitialForm(passenger),
);

const [errors, setErrors] = useState<FormErrors>({});

const isEditing = Boolean(passenger);

const updateField = <K extends keyof PassengerFormData>(
field: K,
value: PassengerFormData[K],
) => {
setForm((current) => ({
...current,
[field]: value,
}));


setErrors((current) => ({
  ...current,
  [field]: undefined,
}));


};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();


const validationErrors = validateForm(form);

if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  return;
}

onSubmit({
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  gender: form.gender,
  dateOfBirth: form.dateOfBirth,
  nationality: form.nationality.trim(),
  passportNumber: form.passportNumber.trim(),
  passportExpiry: form.passportExpiry,
  status: form.status,
});


};

const inputClass = (hasError?: boolean) =>
`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
        : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 dark:border-slate-700"
    }`;

const labelClass =
"mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

return (
<motion.form
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
onSubmit={handleSubmit}
className="w-full"
noValidate
> <div className="space-y-6">
{/* Header */} <div className="flex items-start gap-3 border-b border-slate-200 pb-5 dark:border-slate-800"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400"> <User className="h-5 w-5" /> </div>


      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {isEditing ? "Edit Passenger" : "Add Passenger"}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isEditing
            ? "Update the passenger information below."
            : "Enter the passenger information below."}
        </p>
      </div>
    </div>

    {/* Personal Information */}
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Personal Information
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Basic passenger details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="passenger-first-name" className={labelClass}>
            First Name
          </label>

          <input
            id="passenger-first-name"
            type="text"
            value={form.firstName}
            onChange={(event) =>
              updateField("firstName", event.target.value)
            }
            placeholder="Enter first name"
            className={inputClass(Boolean(errors.firstName))}
            autoComplete="given-name"
          />

          <AnimatePresence>
            {errors.firstName && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500"
              >
                {errors.firstName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="passenger-last-name" className={labelClass}>
            Last Name
          </label>

          <input
            id="passenger-last-name"
            type="text"
            value={form.lastName}
            onChange={(event) =>
              updateField("lastName", event.target.value)
            }
            placeholder="Enter last name"
            className={inputClass(Boolean(errors.lastName))}
            autoComplete="family-name"
          />

          <AnimatePresence>
            {errors.lastName && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500"
              >
                {errors.lastName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="passenger-gender" className={labelClass}>
            Gender
          </label>

          <select
            id="passenger-gender"
            value={form.gender}
            onChange={(event) =>
              updateField(
                "gender",
                event.target.value as PassengerGender,
              )
            }
            className={inputClass(Boolean(errors.gender))}
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.gender && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.gender}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="passenger-date-of-birth" className={labelClass}>
            Date of Birth
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="passenger-date-of-birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(event) =>
                updateField("dateOfBirth", event.target.value)
              }
              className={`${inputClass(
                Boolean(errors.dateOfBirth),
              )} pl-10`}
            />
          </div>

          {errors.dateOfBirth && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.dateOfBirth}
            </p>
          )}
        </div>
      </div>
    </section>

    {/* Contact Information */}
    <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Contact Information
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Passenger contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="passenger-email" className={labelClass}>
            Email Address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="passenger-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder="passenger@example.com"
              className={`${inputClass(
                Boolean(errors.email),
              )} pl-10`}
              autoComplete="email"
            />
          </div>

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="passenger-phone" className={labelClass}>
            Phone Number
          </label>

          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="passenger-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField("phone", event.target.value)
              }
              placeholder="+234 800 000 0000"
              className={`${inputClass(
                Boolean(errors.phone),
              )} pl-10`}
              autoComplete="tel"
            />
          </div>

          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="passenger-nationality" className={labelClass}>
            Nationality
          </label>

          <select
            id="passenger-nationality"
            value={form.nationality}
            onChange={(event) =>
              updateField("nationality", event.target.value)
            }
            className={inputClass(Boolean(errors.nationality))}
          >
            <option value="">Select nationality</option>

            {nationalityOptions.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>

          {errors.nationality && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.nationality}
            </p>
          )}
        </div>
      </div>
    </section>

    {/* Passport Information */}
    <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Passport Information
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Travel document information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="passenger-passport-number" className={labelClass}>
            Passport Number
          </label>

          <input
            id="passenger-passport-number"
            type="text"
            value={form.passportNumber}
            onChange={(event) =>
              updateField("passportNumber", event.target.value)
            }
            placeholder="Enter passport number"
            className={inputClass(Boolean(errors.passportNumber))}
            autoComplete="off"
          />

          {errors.passportNumber && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.passportNumber}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="passenger-passport-expiry" className={labelClass}>
            Passport Expiry
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="passenger-passport-expiry"
              type="date"
              value={form.passportExpiry}
              onChange={(event) =>
                updateField("passportExpiry", event.target.value)
              }
              className={`${inputClass(
                Boolean(errors.passportExpiry),
              )} pl-10`}
            />
          </div>

          {errors.passportExpiry && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.passportExpiry}
            </p>
          )}
        </div>
      </div>
    </section>

    {/* Account Status */}
    <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Passenger Status
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Control the current passenger account status.
        </p>
      </div>

      <div className="max-w-md">
        <label htmlFor="passenger-status" className={labelClass}>
          Status
        </label>

        <select
          id="passenger-status"
          value={form.status}
          onChange={(event) =>
            updateField(
              "status",
              event.target.value as PassengerStatus,
            )
          }
          className={inputClass(Boolean(errors.status))}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {errors.status && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.status}
          </p>
        )}
      </div>
    </section>

    {/* Actions */}
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <X className="h-4 w-4" />
        Cancel
      </motion.button>

      <motion.button
        type="submit"
        whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        disabled={isSubmitting}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Adding..."}
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            {isEditing ? "Update Passenger" : "Add Passenger"}
          </>
        )}
      </motion.button>
    </div>
  </div>
</motion.form>


);
}
