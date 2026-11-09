"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  staffDepartmentOptions,
  staffLocationOptions,
  staffRoleOptions,
  staffStatusOptions,
  StaffDepartment,
  StaffLocation,
  StaffRole,
  StaffStatus,
} from "./admin-staff-data/StaffData";

export type StaffSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "last-active"
  | "role-asc";

export interface StaffFilterValues {
  search: string;
  role: StaffRole | "all";
  department: StaffDepartment | "all";
  location: StaffLocation | "all";
  status: StaffStatus | "all";
  sortBy: StaffSortOption;
}

interface StaffFiltersProps {
  filters: StaffFilterValues;
  onChange: (
    field: keyof StaffFilterValues,
    value: string,
  ) => void;
  onReset: () => void;
}

export default function StaffFilters({
  filters,
  onChange,
  onReset,
}: StaffFiltersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Staff Filters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search and organize staff records
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-1">
          <label
            htmlFor="staff-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Search
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="staff-search"
              type="search"
              value={filters.search}
              onChange={(event) =>
                onChange("search", event.target.value)
              }
              placeholder="Name, ID, email or phone..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>
        </div>

        <FilterSelect
          id="staff-role"
          label="Role"
          value={filters.role}
          onChange={(value) => onChange("role", value)}
          options={staffRoleOptions}
          allLabel="All Roles"
        />

        <FilterSelect
          id="staff-department"
          label="Department"
          value={filters.department}
          onChange={(value) => onChange("department", value)}
          options={staffDepartmentOptions}
          allLabel="All Departments"
        />

        <FilterSelect
          id="staff-location"
          label="Location"
          value={filters.location}
          onChange={(value) => onChange("location", value)}
          options={staffLocationOptions}
          allLabel="All Locations"
        />

        <FilterSelect
          id="staff-status"
          label="Status"
          value={filters.status}
          onChange={(value) => onChange("status", value)}
          options={staffStatusOptions}
          allLabel="All Statuses"
        />

        <div>
          <label
            htmlFor="staff-sort"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Sort By
          </label>

          <select
            id="staff-sort"
            value={filters.sortBy}
            onChange={(event) =>
              onChange("sortBy", event.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          >
            <option value="newest">Newest Joined</option>
            <option value="oldest">Oldest Joined</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="last-active">Recently Active</option>
            <option value="role-asc">Role A-Z</option>
          </select>
        </div>
      </div>
    </motion.section>
  );
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  allLabel: string;
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  allLabel,
}: FilterSelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
      >
        <option value="all">{allLabel}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}