"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

import StaffCard from "@/components/admin/staff/StaffCard";
import StaffDetails from "@/components/admin/staff/StaffDetails";
import StaffFilters, {
  type StaffFilterValues,
} from "@/components/admin/staff/StaffFilters";
import StaffForm from "@/components/admin/staff/StaffForm";
import StaffHeader from "@/components/admin/staff/StaffHeader";
import StaffStats from "@/components/admin/staff/StaffStats";
import StaffTable from "@/components/admin/staff/StaffTable";

import {
  adminStaffData,
  type AdminStaff,
  type StaffFormValues,
  type StaffStatus,
  getStaffFullName,
} from "@/components/admin/staff/admin-staff-data/StaffData";

const initialFilters: StaffFilterValues = {
  search: "",
  role: "all",
  department: "all",
  location: "all",
  status: "all",
  sortBy: "newest",
};

function generateStaffId(staff: AdminStaff[]) {
  const numbers = staff
    .map((member) => {
      const match = member.staffId.match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter((number) => Number.isFinite(number));

  const nextNumber = Math.max(0, ...numbers) + 1;

  return `SOG-STF-${String(nextNumber).padStart(3, "0")}`;
}

function generateInternalId() {
  return `staff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<AdminStaff[]>(adminStaffData);

  const [filters, setFilters] =
    useState<StaffFilterValues>(initialFilters);

  const [selectedStaff, setSelectedStaff] =
    useState<AdminStaff | null>(null);

  const [editingStaff, setEditingStaff] =
    useState<AdminStaff | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AdminStaff | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStaff = useMemo(
    () => staffList.filter((staff) => staff.status === "active").length,
    [staffList],
  );

  const filteredStaff = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const results = staffList.filter((staff) => {
      const fullName = getStaffFullName(staff).toLowerCase();

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        staff.staffId.toLowerCase().includes(search) ||
        staff.email.toLowerCase().includes(search) ||
        staff.phone.toLowerCase().includes(search);

      const matchesRole =
        filters.role === "all" || staff.role === filters.role;

      const matchesDepartment =
        filters.department === "all" ||
        staff.department === filters.department;

      const matchesLocation =
        filters.location === "all" ||
        staff.location === filters.location;

      const matchesStatus =
        filters.status === "all" ||
        staff.status === filters.status;

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        matchesLocation &&
        matchesStatus
      );
    });

    return [...results].sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return (
            new Date(a.joinedDate).getTime() -
            new Date(b.joinedDate).getTime()
          );

        case "name-asc":
          return getStaffFullName(a).localeCompare(getStaffFullName(b));

        case "name-desc":
          return getStaffFullName(b).localeCompare(getStaffFullName(a));

        case "last-active":
          return (
            new Date(b.lastActive).getTime() -
            new Date(a.lastActive).getTime()
          );

        case "role-asc":
          return a.role.localeCompare(b.role);

        case "newest":
        default:
          return (
            new Date(b.joinedDate).getTime() -
            new Date(a.joinedDate).getTime()
          );
      }
    });
  }, [staffList, filters]);

  const handleFilterChange = (
    field: keyof StaffFilterValues,
    value: string,
  ) => {
    setFilters((previous) => {
      if (field === "sortBy") {
        return {
          ...previous,
          sortBy: value as StaffFilterValues["sortBy"],
        };
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const handleEditStaff = (staff: AdminStaff) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleSubmitStaff = async (values: StaffFormValues) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 350));

    setStaffList((previous) => {
      if (editingStaff) {
        return previous.map((staff) => {
          if (staff.id !== editingStaff.id) {
            return staff;
          }

          return {
            ...staff,
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            staffId: values.staffId.trim() || staff.staffId,
          };
        });
      }

      const newStaff: AdminStaff = {
        id: generateInternalId(),
        staffId: values.staffId.trim() || generateStaffId(previous),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        role: values.role,
        department: values.department,
        status: values.status,
        location: values.location,
        joinedDate: getCurrentDate(),
        lastActive: getCurrentDate(),
        avatar: "",
        permissions: values.permissions,
      };

      return [newStaff, ...previous];
    });

    setIsSubmitting(false);
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleStatusChange = (
    staff: AdminStaff,
    status: StaffStatus,
  ) => {
    const currentDate = getCurrentDate();

    setStaffList((previous) =>
      previous.map((member) =>
        member.id === staff.id
          ? {
              ...member,
              status,
              lastActive:
                status === "active"
                  ? currentDate
                  : member.lastActive,
            }
          : member,
      ),
    );

    setSelectedStaff((previous) =>
      previous?.id === staff.id
        ? {
            ...previous,
            status,
            lastActive:
              status === "active"
                ? currentDate
                : previous.lastActive,
          }
        : previous,
    );
  };

  const handleDeleteRequest = (staff: AdminStaff) => {
    setDeleteTarget(staff);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setStaffList((previous) =>
      previous.filter((staff) => staff.id !== deleteTarget.id),
    );

    if (selectedStaff?.id === deleteTarget.id) {
      setSelectedStaff(null);
    }

    setDeleteTarget(null);
  };

  const handleCloseForm = () => {
    if (isSubmitting) {
      return;
    }

    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.role !== "all" ||
    filters.department !== "all" ||
    filters.location !== "all" ||
    filters.status !== "all";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <StaffHeader
          totalStaff={staffList.length}
          activeStaff={activeStaff}
          onAddStaff={handleAddStaff}
        />

        <StaffStats staff={staffList} />

        <StaffFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Staff Directory
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {filteredStaff.length} of {staffList.length} staff
                members
              </p>
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-sm font-medium text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="hidden lg:block">
            {filteredStaff.length > 0 ? (
              <StaffTable
                staff={filteredStaff}
                onView={setSelectedStaff}
                onEdit={handleEditStaff}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteRequest}
              />
            ) : (
              <EmptyStaffState onReset={handleResetFilters} />
            )}
          </div>

          <div className="space-y-4 p-4 lg:hidden">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={[staff]}
                  onView={setSelectedStaff}
                  onEdit={handleEditStaff}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteRequest}
                />
              ))
            ) : (
              <EmptyStaffState onReset={handleResetFilters} />
            )}
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {isFormOpen ? (
          <ModalShell onClose={handleCloseForm}>
            <StaffForm
              key={editingStaff?.id ?? "new-staff"}
              staff={editingStaff}
              onSubmit={handleSubmitStaff}
              onCancel={handleCloseForm}
              isSubmitting={isSubmitting}
            />
          </ModalShell>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStaff ? (
          <ModalShell onClose={() => setSelectedStaff(null)}>
            <StaffDetails
              staff={selectedStaff}
              onClose={() => setSelectedStaff(null)}
            />
          </ModalShell>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget ? (
          <DeleteConfirmation
            staff={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
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
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pb-5 sm:px-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmation({
  staff,
  onCancel,
  onConfirm,
}: {
  staff: AdminStaff;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Delete Staff Member?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          You are about to permanently remove{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {getStaffFullName(staff)}
          </span>{" "}
          from the staff directory. This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete Staff
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EmptyStaffState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <StaffActionsEmptyIcon />
      </div>

      <h3 className="mt-4 text-base font-semibold">
        No staff members found
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Try changing your search or filter settings to find the staff
        member you are looking for.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Reset Filters
      </button>
    </div>
  );
}

function StaffActionsEmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />

      <circle cx="9" cy="7" r="4" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}