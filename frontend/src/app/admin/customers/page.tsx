"use client";

import { useMemo, useState } from "react";

import CustomerDetails from "@/components/admin/customers/CustomerDetails";
import CustomerFilters from "@/components/admin/customers/CustomerFilters";
import CustomerForm from "@/components/admin/customers/CustomerForm";
import CustomerHeader from "@/components/admin/customers/CustomerHeader";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerTable from "@/components/admin/customers/CustomerTable";

import {
adminCustomersData,
adminCustomerSummary,
type AdminCustomer,
type AdminCustomerStatus,
type AdminCustomerTier,
} from "@/components/admin/customers/admin-customers-data/AdminCustomersData";

export default function CustomersPage() {
const [customers, setCustomers] =
useState<AdminCustomer[]>(adminCustomersData);

const [searchQuery, setSearchQuery] = useState("");

const [statusFilter, setStatusFilter] = useState<
AdminCustomerStatus | "all"

> ("all");

const [tierFilter, setTierFilter] = useState<
AdminCustomerTier | "all"

> ("all");

const [nationalityFilter, setNationalityFilter] =
useState("all");

const [selectedCustomer, setSelectedCustomer] =
useState<AdminCustomer | null>(null);

const [editingCustomer, setEditingCustomer] =
useState<AdminCustomer | null>(null);

const [isFormOpen, setIsFormOpen] = useState(false);

const nationalities = useMemo(() => {
return Array.from(
new Set(
customers.map(
(customer) => customer.nationality,
),
),
).sort();
}, [customers]);

const filteredCustomers = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


return customers.filter((customer) => {
  const fullName =
    `${customer.firstName} ${customer.lastName}`.toLowerCase();

  const matchesSearch =
    query === "" ||
    fullName.includes(query) ||
    customer.customerReference
      .toLowerCase()
      .includes(query) ||
    customer.email.toLowerCase().includes(query) ||
    customer.phone.toLowerCase().includes(query) ||
    customer.nationality.toLowerCase().includes(query);

  const matchesStatus =
    statusFilter === "all" ||
    customer.status === statusFilter;

  const matchesTier =
    tierFilter === "all" ||
    customer.customerTier === tierFilter;

  const matchesNationality =
    nationalityFilter === "all" ||
    customer.nationality === nationalityFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesTier &&
    matchesNationality
  );
});


}, [
customers,
searchQuery,
statusFilter,
tierFilter,
nationalityFilter,
]);

const summaries = useMemo(() => {
const total = customers.length;


const active = customers.filter(
  (customer) => customer.status === "active",
).length;

const inactive = customers.filter(
  (customer) => customer.status === "inactive",
).length;

const suspended = customers.filter(
  (customer) => customer.status === "suspended",
).length;

const revenue = customers.reduce(
  (totalSpent, customer) =>
    totalSpent + customer.totalSpent,
  0,
);

return adminCustomerSummary.map((summary) => {
  if (summary.type === "total") {
    return {
      ...summary,
      value: total.toString(),
    };
  }

  if (summary.type === "active") {
    return {
      ...summary,
      value: active.toString(),
    };
  }

  if (summary.type === "inactive") {
    return {
      ...summary,
      value: inactive.toString(),
    };
  }

  if (summary.type === "suspended") {
    return {
      ...summary,
      value: suspended.toString(),
    };
  }

  return {
    ...summary,
    value: new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(revenue),
  };
});


}, [customers]);

const handleAddCustomer = () => {
setEditingCustomer(null);
setIsFormOpen(true);
};

const handleViewCustomer = (
customer: AdminCustomer,
) => {
setSelectedCustomer(customer);
};

const handleEditCustomer = (
customer: AdminCustomer,
) => {
setSelectedCustomer(null);
setEditingCustomer(customer);
setIsFormOpen(true);
};

const handleDeleteCustomer = (
customer: AdminCustomer,
) => {
const confirmed = window.confirm(
`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
);


if (!confirmed) {
  return;
}

setCustomers((currentCustomers) =>
  currentCustomers.filter(
    (item) => item.id !== customer.id,
  ),
);

if (selectedCustomer?.id === customer.id) {
  setSelectedCustomer(null);
}

if (editingCustomer?.id === customer.id) {
  setEditingCustomer(null);
  setIsFormOpen(false);
}


};

const handleSaveCustomer = (
customer: AdminCustomer,
) => {
setCustomers((currentCustomers) => {
const exists = currentCustomers.some(
(item) => item.id === customer.id,
);


  if (exists) {
    return currentCustomers.map((item) =>
      item.id === customer.id ? customer : item,
    );
  }

  return [customer, ...currentCustomers];
});

setEditingCustomer(null);
setIsFormOpen(false);


};

const handleClearFilters = () => {
setSearchQuery("");
setStatusFilter("all");
setTierFilter("all");
setNationalityFilter("all");
};

const hasFilters =
searchQuery.trim() !== "" ||
statusFilter !== "all" ||
tierFilter !== "all" ||
nationalityFilter !== "all";

return ( <main className="min-h-screen bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 lg:px-8"> <div className="mx-auto max-w-[1600px] space-y-5"> <CustomerHeader
       onAddCustomer={handleAddCustomer}
     />


    <CustomerStats summaries={summaries} />

    <CustomerFilters
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      tierFilter={tierFilter}
      nationalityFilter={nationalityFilter}
      nationalities={nationalities}
      onSearchChange={setSearchQuery}
      onStatusChange={setStatusFilter}
      onTierChange={setTierFilter}
      onNationalityChange={setNationalityFilter}
      onClearFilters={handleClearFilters}
    />

    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Customer Directory
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredCustomers.length} of{" "}
          {customers.length} customers
        </p>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-fit text-sm font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          Reset filters
        </button>
      )}
    </div>

    <CustomerTable
      customers={filteredCustomers}
      onView={handleViewCustomer}
      onEdit={handleEditCustomer}
      onDelete={handleDeleteCustomer}
    />
  </div>

  <CustomerDetails
    customer={selectedCustomer}
    onClose={() => setSelectedCustomer(null)}
  />

  {isFormOpen && (
    <CustomerForm
      key={editingCustomer?.id ?? "new"}
      customer={editingCustomer}
      onSubmit={handleSaveCustomer}
      onClose={() => {
        setEditingCustomer(null);
        setIsFormOpen(false);
      }}
    />
  )}
</main>


);
}
