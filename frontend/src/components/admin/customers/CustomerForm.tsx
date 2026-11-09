"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";

import type {
AdminCustomer,
AdminCustomerGender,
AdminCustomerStatus,
AdminCustomerTier,
} from "./admin-customers-data/AdminCustomersData";

interface CustomerFormProps {
customer: AdminCustomer | null;
onSubmit: (customer: AdminCustomer) => void;
onClose: () => void;
}

interface CustomerFormState {
firstName: string;
lastName: string;
email: string;
phone: string;
nationality: string;
countryCode: string;
gender: AdminCustomerGender;
dateOfBirth: string;
customerTier: AdminCustomerTier;
status: AdminCustomerStatus;
totalBookings: string;
completedBookings: string;
cancelledBookings: string;
totalSpent: string;
currency: string;
lastBookingDate: string;
joinedDate: string;
}

const emptyForm: CustomerFormState = {
firstName: "",
lastName: "",
email: "",
phone: "",
nationality: "",
countryCode: "",
gender: "male",
dateOfBirth: "",
customerTier: "standard",
status: "active",
totalBookings: "0",
completedBookings: "0",
cancelledBookings: "0",
totalSpent: "0",
currency: "NGN",
lastBookingDate: "",
joinedDate: new Date().toISOString().split("T")[0],
};

function customerToForm(
customer: AdminCustomer,
): CustomerFormState {
return {
firstName: customer.firstName,
lastName: customer.lastName,
email: customer.email,
phone: customer.phone,
nationality: customer.nationality,
countryCode: customer.countryCode,
gender: customer.gender,
dateOfBirth: customer.dateOfBirth,
customerTier: customer.customerTier,
status: customer.status,
totalBookings: customer.totalBookings.toString(),
completedBookings:
customer.completedBookings.toString(),
cancelledBookings:
customer.cancelledBookings.toString(),
totalSpent: customer.totalSpent.toString(),
currency: customer.currency,
lastBookingDate: customer.lastBookingDate ?? "",
joinedDate: customer.joinedDate,
};
}

const genderOptions = [
{ label: "Male", value: "male" },
{ label: "Female", value: "female" },
{ label: "Other", value: "other" },
];

const tierOptions = [
{ label: "Standard", value: "standard" },
{ label: "Silver", value: "silver" },
{ label: "Gold", value: "gold" },
{ label: "Platinum", value: "platinum" },
];

const statusOptions = [
{ label: "Active", value: "active" },
{ label: "Inactive", value: "inactive" },
{ label: "Suspended", value: "suspended" },
];

const currencyOptions = [
{ label: "Nigerian Naira (NGN)", value: "NGN" },
{ label: "US Dollar (USD)", value: "USD" },
{ label: "British Pound (GBP)", value: "GBP" },
{ label: "Euro (EUR)", value: "EUR" },
];

export default function CustomerForm({
customer,
onSubmit,
onClose,
}: CustomerFormProps) {
const [form, setForm] = useState<CustomerFormState>(() =>
customer ? customerToForm(customer) : emptyForm,
);

const [error, setError] = useState("");

const isEditing = Boolean(customer);

const updateField = <K extends keyof CustomerFormState>(
field: K,
value: CustomerFormState[K],
) => {
setForm((current) => ({
...current,
[field]: value,
}));
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (
  !form.firstName.trim() ||
  !form.lastName.trim() ||
  !form.email.trim() ||
  !form.phone.trim() ||
  !form.nationality.trim() ||
  !form.countryCode.trim() ||
  !form.dateOfBirth
) {
  setError(
    "Please complete all required customer information.",
  );
  return;
}

const totalBookings = Number(form.totalBookings);
const completedBookings = Number(
  form.completedBookings,
);
const cancelledBookings = Number(
  form.cancelledBookings,
);
const totalSpent = Number(form.totalSpent);

if (
  [totalBookings, completedBookings, cancelledBookings, totalSpent].some(
    (value) => Number.isNaN(value) || value < 0,
  )
) {
  setError(
    "Booking counts and spending must be valid non-negative numbers.",
  );
  return;
}

if (completedBookings > totalBookings) {
  setError(
    "Completed bookings cannot be greater than total bookings.",
  );
  return;
}

if (cancelledBookings > totalBookings) {
  setError(
    "Cancelled bookings cannot be greater than total bookings.",
  );
  return;
}

const now = new Date().toISOString().split("T")[0];

const savedCustomer: AdminCustomer = {
  id: customer?.id ?? `customer-${Date.now()}`,
  customerReference:
    customer?.customerReference ??
    `SOG-CUS-${Math.floor(
      1000 + Math.random() * 9000,
    )}`,
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  nationality: form.nationality.trim(),
  countryCode: form.countryCode.trim().toUpperCase(),
  gender: form.gender,
  dateOfBirth: form.dateOfBirth,
  customerTier: form.customerTier,
  status: form.status,
  totalBookings,
  completedBookings,
  cancelledBookings,
  totalSpent,
  currency: form.currency,
  lastBookingDate:
    form.lastBookingDate || undefined,
  joinedDate: customer?.joinedDate ?? form.joinedDate,
  lastUpdated: now,
};

onSubmit(savedCustomer);


};

return ( <AnimatePresence>
<motion.div
className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onClose();
}
}}
>
<motion.div
initial={{ opacity: 0, y: 24, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 24, scale: 0.97 }}
transition={{
duration: 0.2,
ease: "easeOut",
}}
className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
> <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"> <div> <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
{isEditing
? "Update Customer"
: "New Customer"} </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {isEditing
              ? "Edit Customer"
              : "Add Customer"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close customer form"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto"
      >
        <div className="space-y-6 p-5 sm:p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <section>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Personal Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value,
                  )
                }
                placeholder="Enter first name"
                required
              />

              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value,
                  )
                }
                placeholder="Enter last name"
                required
              />

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="customer@example.com"
                required
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                placeholder="+234 800 000 0000"
                required
              />

              <Input
                label="Nationality"
                value={form.nationality}
                onChange={(event) =>
                  updateField(
                    "nationality",
                    event.target.value,
                  )
                }
                placeholder="Nigerian"
                required
              />

              <Input
                label="Country Code"
                value={form.countryCode}
                onChange={(event) =>
                  updateField(
                    "countryCode",
                    event.target.value,
                  )
                }
                placeholder="NG"
                required
              />

              <Select
                label="Gender"
                value={form.gender}
                options={genderOptions}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value as AdminCustomerGender,
                  )
                }
              />

              <Input
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField(
                    "dateOfBirth",
                    event.target.value,
                  )
                }
                required
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Account Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Customer Tier"
                value={form.customerTier}
                options={tierOptions}
                onChange={(event) =>
                  updateField(
                    "customerTier",
                    event.target.value as AdminCustomerTier,
                  )
                }
              />

              <Select
                label="Status"
                value={form.status}
                options={statusOptions}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as AdminCustomerStatus,
                  )
                }
              />

              <Input
                label="Joined Date"
                type="date"
                value={form.joinedDate}
                onChange={(event) =>
                  updateField(
                    "joinedDate",
                    event.target.value,
                  )
                }
                required
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Travel & Spending
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Total Bookings"
                type="number"
                min={0}
                value={form.totalBookings}
                onChange={(event) =>
                  updateField(
                    "totalBookings",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Completed Bookings"
                type="number"
                min={0}
                value={form.completedBookings}
                onChange={(event) =>
                  updateField(
                    "completedBookings",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Cancelled Bookings"
                type="number"
                min={0}
                value={form.cancelledBookings}
                onChange={(event) =>
                  updateField(
                    "cancelledBookings",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Total Spent"
                type="number"
                min={0}
                value={form.totalSpent}
                onChange={(event) =>
                  updateField(
                    "totalSpent",
                    event.target.value,
                  )
                }
              />

              <Select
                label="Currency"
                value={form.currency}
                options={currencyOptions}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Last Booking Date"
                type="date"
                value={form.lastBookingDate}
                onChange={(event) =>
                  updateField(
                    "lastBookingDate",
                    event.target.value,
                  )
                }
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            {isEditing
              ? "Save Changes"
              : "Add Customer"}
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
</AnimatePresence>


);
}
