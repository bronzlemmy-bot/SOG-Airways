
"use client";

import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";

interface CustomerHeaderProps {
onAddCustomer: () => void;
}

export default function CustomerHeader({
onAddCustomer,
}: CustomerHeaderProps) {
return (
<motion.header
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-6"
> <div className="flex min-w-0 items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"> <Users className="h-5 w-5" /> </div>

```
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
        Customer Management
      </p>

      <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Customers
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        Manage customer profiles, loyalty tiers, booking
        activity, and account status.
      </p>
    </div>
  </div>

  <motion.button
    type="button"
    onClick={onAddCustomer}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 sm:w-auto"
  >
    <Plus className="h-4 w-4" />
    Add Customer
  </motion.button>
</motion.header>


);
}
