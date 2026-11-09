"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Mail,
Phone,
Plane,
Wallet,
} from "lucide-react";

import CustomerActions from "./CustomerActions";
import CustomerStatusBadge from "./CustomerStatusBadge";
import type { AdminCustomer } from "./admin-customers-data/AdminCustomersData";

interface CustomerCardProps {
customer: AdminCustomer;
onView: (customer: AdminCustomer) => void;
onEdit: (customer: AdminCustomer) => void;
onDelete: (customer: AdminCustomer) => void;
}

function getTierStyle(
tier: AdminCustomer["customerTier"],
) {
if (tier === "standard") {
return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

if (tier === "silver") {
return "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300";
}

if (tier === "gold") {
return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
}

return "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400";
}

function formatCurrency(
amount: number,
currency: string,
) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(new Date(date));
}

export default function CustomerCard({
customer,
onView,
onEdit,
onDelete,
}: CustomerCardProps) {
const fullName = `${customer.firstName} ${customer.lastName}`;

return (
<motion.article
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
{customer.firstName.charAt(0)}
{customer.lastName.charAt(0)} </div>

```
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
          {fullName}
        </h3>

        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {customer.customerReference}
        </p>
      </div>
    </div>

    <CustomerActions
      onView={() => onView(customer)}
      onEdit={() => onEdit(customer)}
      onDelete={() => onDelete(customer)}
    />
  </div>

  <div className="mt-4 flex flex-wrap items-center gap-2">
    <CustomerStatusBadge status={customer.status} />

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getTierStyle(
        customer.customerTier,
      )}`}
    >
      {customer.customerTier}
    </span>
  </div>

  <div className="mt-5 space-y-3">
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="truncate">{customer.email}</span>
    </div>

    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{customer.phone}</span>
    </div>

    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
      <span>
        Joined {formatDate(customer.joinedDate)}
      </span>
    </div>
  </div>

  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <Plane className="h-4 w-4 text-sky-500" />

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Bookings
        </span>
      </div>

      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {customer.totalBookings}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-emerald-500" />

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Spent
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
        {formatCurrency(
          customer.totalSpent,
          customer.currency,
        )}
      </p>
    </div>
  </div>
</motion.article>


);
}
