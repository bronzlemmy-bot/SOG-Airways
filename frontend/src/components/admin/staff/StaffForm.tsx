"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Check,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import {
  AdminStaff,
  defaultStaffFormValues,
  StaffFormValues,
  staffDepartmentOptions,
  staffLocationOptions,
  staffPermissionOptions,
  staffRoleOptions,
  staffStatusOptions,
} from "./admin-staff-data/StaffData";

interface StaffFormProps {
  staff?: AdminStaff | null;
  onSubmit: (values: StaffFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const getInitialFormValues = (
  staff?: AdminStaff | null,
): StaffFormValues => {
  if (!staff) {
    return {
      ...defaultStaffFormValues,
      permissions: [...defaultStaffFormValues.permissions],
    };
  }

  return {
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    staffId: staff.staffId,
    role: staff.role,
    department: staff.department,
    location: staff.location,
    status: staff.status,
    permissions: [...staff.permissions],
  };
};

export default function StaffForm({
  staff,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: StaffFormProps) {
  const [formValues, setFormValues] = useState<StaffFormValues>(() =>
    getInitialFormValues(staff),
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof StaffFormValues, string>>
  >({});

  const isEditing = Boolean(staff);

  const updateField = <K extends keyof StaffFormValues>(
    field: K,
    value: StaffFormValues[K],
  ) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const togglePermission = (
    permission: StaffFormValues["permissions"][number],
  ) => {
    setFormValues((previous) => {
      const hasPermission = previous.permissions.includes(permission);

      if (hasPermission) {
        if (previous.permissions.length === 1) {
          return previous;
        }

        return {
          ...previous,
          permissions: previous.permissions.filter(
            (item) => item !== permission,
          ),
        };
      }

      return {
        ...previous,
        permissions: [...previous.permissions, permission],
      };
    });

    setErrors((previous) => ({
      ...previous,
      permissions: "",
    }));
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof StaffFormValues, string>
    > = {};

    if (!formValues.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formValues.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formValues.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!formValues.staffId.trim()) {
      nextErrors.staffId = "Staff ID is required.";
    }

    if (formValues.permissions.length === 0) {
      nextErrors.permissions = "Select at least one permission.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    onSubmit({
      ...formValues,
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim().toLowerCase(),
      phone: formValues.phone.trim(),
      staffId: formValues.staffId.trim().toUpperCase(),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? "Edit Staff Member" : "Add Staff Member"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update this staff member's information and permissions."
                : "Create a new staff member and assign their access permissions."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Close staff form"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
        <div className="space-y-8">
          <FormSection
            icon={<User className="h-4 w-4" />}
            title="Personal Information"
            description="Basic information about the staff member."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="First Name"
                required
                error={errors.firstName}
              >
                <input
                  type="text"
                  value={formValues.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  placeholder="Enter first name"
                  className={inputClass(Boolean(errors.firstName))}
                />
              </Field>

              <Field
                label="Last Name"
                required
                error={errors.lastName}
              >
                <input
                  type="text"
                  value={formValues.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  placeholder="Enter last name"
                  className={inputClass(Boolean(errors.lastName))}
                />
              </Field>

              <Field
                label="Email Address"
                required
                error={errors.email}
              >
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="staff@sogairways.com"
                    className={`${inputClass(Boolean(errors.email))} pl-10`}
                  />
                </div>
              </Field>

              <Field
                label="Phone Number"
                required
                error={errors.phone}
              >
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+234 800 000 0000"
                    className={`${inputClass(Boolean(errors.phone))} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </FormSection>

          <FormSection
            icon={<BriefcaseBusiness className="h-4 w-4" />}
            title="Employment Information"
            description="Assign the staff member's role, department and location."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Staff ID"
                required
                error={errors.staffId}
              >
                <input
                  type="text"
                  value={formValues.staffId}
                  onChange={(event) =>
                    updateField(
                      "staffId",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="SOG-STAFF-001"
                  className={inputClass(Boolean(errors.staffId))}
                />
              </Field>

              <Field label="Role" required>
                <select
                  value={formValues.role}
                  onChange={(event) =>
                    updateField(
                      "role",
                      event.target.value as StaffFormValues["role"],
                    )
                  }
                  className={inputClass()}
                >
                  {staffRoleOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Department" required>
                <select
                  value={formValues.department}
                  onChange={(event) =>
                    updateField(
                      "department",
                      event.target.value as StaffFormValues["department"],
                    )
                  }
                  className={inputClass()}
                >
                  {staffDepartmentOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Location" required>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={formValues.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value as StaffFormValues["location"],
                      )
                    }
                    className={`${inputClass()} pl-10`}
                  >
                    {staffLocationOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Status" required>
                <select
                  value={formValues.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as StaffFormValues["status"],
                    )
                  }
                  className={inputClass()}
                >
                  {staffStatusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Permissions"
            description="Choose which areas of the admin system this staff member can access."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {staffPermissionOptions.map((permission) => {
                const selected = formValues.permissions.includes(
                  permission.value,
                );

                return (
                  <button
                    key={permission.value}
                    type="button"
                    onClick={() =>
                      togglePermission(permission.value)
                    }
                    disabled={isSubmitting}
                    className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        selected
                          ? "border-white/30 bg-white/15"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selected && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </span>

                    {permission.label}
                  </button>
                );
              })}
            </div>

            {errors.permissions && (
              <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                {errors.permissions}
              </p>
            )}
          </FormSection>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:justify-end sm:p-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {isSubmitting ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                className="inline-flex"
              >
                <Save className="h-4 w-4" />
              </motion.span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "Save Changes" : "Add Staff"}
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

function FormSection({
  icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({
  label,
  required = false,
  error,
  children,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError = false) {
  return `h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition dark:bg-slate-950 dark:text-white ${
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:border-rose-700 dark:focus:ring-rose-950"
      : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:focus:border-slate-500 dark:focus:ring-slate-800"
  }`;
}