"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Mail,
Phone,
Plane,
} from "lucide-react";

import CustomerActions from "./CustomerActions";
import CustomerCard from "./CustomerCard";
import CustomerStatusBadge from "./CustomerStatusBadge";
import type { AdminCustomer } from "./admin-customers-data/AdminCustomersData";

interface CustomerTableProps {
customers: AdminCustomer[];
onView: (customer: AdminCustomer) => void;
onEdit: (customer: AdminCustomer) => void;
onDelete: (customer: AdminCustomer) => void;
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

export default function CustomerTable({
customers,
onView,
onEdit,
onDelete,
}: CustomerTableProps) {
if (customers.length === 0) {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900"
> <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"> <Plane className="h-6 w-6 text-slate-400" /> </div>

```
    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
      No customers found
    </h3>

    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
      No customers match the current search and filter
      criteria.
    </p>
  </motion.div>
);


}

return ( <div> <div className="space-y-4 lg:hidden">
{customers.map((customer) => ( <CustomerCard
         key={customer.id}
         customer={customer}
         onView={onView}
         onEdit={onEdit}
         onDelete={onDelete}
       />
))} </div>


  <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
    <div className="overflow-x-auto">
      <table className="w-full min-w-275">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Customer
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contact
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tier
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bookings
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Spent
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Joined
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {customers.map((customer, index) => (
            <motion.tr
              key={customer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.03,
              }}
              className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
                    {customer.firstName.charAt(0)}
                    {customer.lastName.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {customer.firstName}{" "}
                      {customer.lastName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {customer.customerReference}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="max-w-47.5 truncate">
                      {customer.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    customer.customerTier ===
                    "standard"
                      ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      : customer.customerTier ===
                          "silver"
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300"
                        : customer.customerTier ===
                            "gold"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                          : "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
                  }`}
                >
                  {customer.customerTier}
                </span>
              </td>

              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {customer.totalBookings}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {customer.completedBookings} completed
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(
                    customer.totalSpent,
                    customer.currency,
                  )}
                </p>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  {formatDate(customer.joinedDate)}
                </div>
              </td>

              <td className="px-5 py-4">
                <CustomerStatusBadge
                  status={customer.status}
                />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <CustomerActions
                    onView={() => onView(customer)}
                    onEdit={() => onEdit(customer)}
                    onDelete={() => onDelete(customer)}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


);
}
