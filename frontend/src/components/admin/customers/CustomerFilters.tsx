"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type {
AdminCustomerStatus,
AdminCustomerTier,
} from "./admin-customers-data/AdminCustomersData";

interface CustomerFiltersProps {
searchQuery: string;
statusFilter: AdminCustomerStatus | "all";
tierFilter: AdminCustomerTier | "all";
nationalityFilter: string;
nationalities: string[];
onSearchChange: (value: string) => void;
onStatusChange: (
value: AdminCustomerStatus | "all",
) => void;
onTierChange: (
value: AdminCustomerTier | "all",
) => void;
onNationalityChange: (value: string) => void;
onClearFilters: () => void;
}

export default function CustomerFilters({
searchQuery,
statusFilter,
tierFilter,
nationalityFilter,
nationalities,
onSearchChange,
onStatusChange,
onTierChange,
onNationalityChange,
onClearFilters,
}: CustomerFiltersProps) {
const hasFilters =
searchQuery.trim() !== "" ||
statusFilter !== "all" ||
tierFilter !== "all" ||
nationalityFilter !== "all";

return ( <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="mb-4 flex items-center gap-2"> <SlidersHorizontal className="h-4 w-4 text-sky-500" />

```
    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
      Customer Filters
    </h2>
  </div>

  <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(150px,1fr))_auto]">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        type="search"
        value={searchQuery}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search customers..."
        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>

    <select
      value={statusFilter}
      onChange={(event) =>
        onStatusChange(
          event.target.value as
            | AdminCustomerStatus
            | "all",
        )
      }
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">All Statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="suspended">Suspended</option>
    </select>

    <select
      value={tierFilter}
      onChange={(event) =>
        onTierChange(
          event.target.value as
            | AdminCustomerTier
            | "all",
        )
      }
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">All Tiers</option>
      <option value="standard">Standard</option>
      <option value="silver">Silver</option>
      <option value="gold">Gold</option>
      <option value="platinum">Platinum</option>
    </select>

    <select
      value={nationalityFilter}
      onChange={(event) =>
        onNationalityChange(event.target.value)
      }
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">
        All Nationalities
      </option>

      {nationalities.map((nationality) => (
        <option
          key={nationality}
          value={nationality}
        >
          {nationality}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={onClearFilters}
      disabled={!hasFilters}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <X className="h-4 w-4" />
      Clear
    </button>
  </div>
</div>


);
}
