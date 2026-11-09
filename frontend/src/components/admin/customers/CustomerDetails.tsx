"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
CalendarDays,
CheckCircle2,
Globe2,
Mail,
Phone,
Plane,
ShieldCheck,
User,
Wallet,
X,
XCircle,
} from "lucide-react";

import CustomerStatusBadge from "./CustomerStatusBadge";
import type { AdminCustomer } from "./admin-customers-data/AdminCustomersData";

interface CustomerDetailsProps {
customer: AdminCustomer | null;
onClose: () => void;
}

const formatCurrency = (
amount: number,
currency: string,
) => {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
};

const formatDate = (date?: string) => {
if (!date) {
return "No booking yet";
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(new Date(date));
};

const formatLabel = (value: string) => {
return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function CustomerDetails({
customer,
onClose,
}: CustomerDetailsProps) {
return ( <AnimatePresence>
{customer && (
<motion.div
className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
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
className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
> <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"> <div> <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
Customer Profile </p>


            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              Customer Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-base font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
                {customer.firstName.charAt(0)}
                {customer.lastName.charAt(0)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {customer.customerReference}
                </p>
              </div>
            </div>

            <CustomerStatusBadge status={customer.status} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-sky-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Personal Information
                </h4>
              </div>

              <div className="mt-4 space-y-3">
                <DetailRow
                  label="Full Name"
                  value={`${customer.firstName} ${customer.lastName}`}
                />

                <DetailRow
                  label="Gender"
                  value={formatLabel(customer.gender)}
                />

                <DetailRow
                  label="Date of Birth"
                  value={formatDate(customer.dateOfBirth)}
                />

                <DetailRow
                  label="Nationality"
                  value={customer.nationality}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Account Information
                </h4>
              </div>

              <div className="mt-4 space-y-3">
                <DetailRow
                  label="Status"
                  value={formatLabel(customer.status)}
                />

                <DetailRow
                  label="Customer Tier"
                  value={formatLabel(customer.customerTier)}
                />

                <DetailRow
                  label="Joined"
                  value={formatDate(customer.joinedDate)}
                />

                <DetailRow
                  label="Last Updated"
                  value={formatDate(customer.lastUpdated)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sky-500" />
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Contact Information
              </h4>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ContactItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={customer.email}
              />

              <ContactItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={customer.phone}
              />

              <ContactItem
                icon={<Globe2 className="h-4 w-4" />}
                label="Country"
                value={`${customer.nationality} (${customer.countryCode})`}
              />

              <ContactItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Last Booking"
                value={formatDate(customer.lastBookingDate)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-violet-500" />
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Travel Activity
              </h4>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <ActivityCard
                label="Total Bookings"
                value={customer.totalBookings}
                icon={<Plane className="h-4 w-4" />}
              />

              <ActivityCard
                label="Completed"
                value={customer.completedBookings}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

              <ActivityCard
                label="Cancelled"
                value={customer.cancelledBookings}
                icon={<XCircle className="h-4 w-4" />}
              />

              <ActivityCard
                label="Total Spent"
                value={formatCurrency(
                  customer.totalSpent,
                  customer.currency,
                )}
                icon={<Wallet className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


);
}

interface DetailRowProps {
label: string;
value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
return ( <div className="flex items-start justify-between gap-4 text-sm"> <span className="text-slate-500 dark:text-slate-400">
{label} </span>


  <span className="text-right font-medium text-slate-900 dark:text-slate-200">
    {value}
  </span>
</div>


);
}

interface ContactItemProps {
icon: React.ReactNode;
label: string;
value: string;
}

function ContactItem({
icon,
label,
value,
}: ContactItemProps) {
return ( <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"> <span className="mt-0.5 text-slate-400">
{icon} </span>


  <div className="min-w-0">
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>

    <p className="mt-1 wrap-break-words text-sm font-medium text-slate-900 dark:text-slate-200">
      {value}
    </p>
  </div>
</div>


);
}

interface ActivityCardProps {
label: string;
value: number | string;
icon: React.ReactNode;
}

function ActivityCard({
label,
value,
icon,
}: ActivityCardProps) {
return ( <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"> <div className="flex items-center gap-2 text-slate-400">
{icon} <span className="text-xs font-medium">
{label} </span> </div>


  <p className="mt-2 truncate text-lg font-bold text-slate-900 dark:text-white">
    {value}
  </p>
</div>


);
}
