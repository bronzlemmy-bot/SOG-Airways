"use client";

import { useMemo, useState } from "react";

import BookingDetails from "@/components/admin/bookings/BookingDetails";
import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingForm from "@/components/admin/bookings/BookingForm";
import BookingHeader from "@/components/admin/bookings/BookingHeader";
import BookingStats from "@/components/admin/bookings/BookingStats";
import BookingTable from "@/components/admin/bookings/BookingTable";

import {
adminBookingsData,
type AdminBooking,
type AdminBookingClass,
type AdminBookingStatus,
type AdminPaymentStatus,
type AdminBookingSummary,
} from "@/components/admin/bookings/admin-bookings-data/AdminBookingsData";

export default function BookingsPage() {
const [bookings, setBookings] =
useState<AdminBooking[]>(adminBookingsData);

const [searchQuery, setSearchQuery] = useState("");

const [statusFilter, setStatusFilter] =
useState<AdminBookingStatus | "all">("all");

const [paymentFilter, setPaymentFilter] =
useState<AdminPaymentStatus | "all">("all");

const [classFilter, setClassFilter] =
useState<AdminBookingClass | "all">("all");

const [selectedBooking, setSelectedBooking] =
useState<AdminBooking | null>(null);

const [editingBooking, setEditingBooking] =
useState<AdminBooking | null>(null);

const [showDetails, setShowDetails] = useState(false);
const [showForm, setShowForm] = useState(false);

const summaries = useMemo<AdminBookingSummary[]>(() => {
const total = bookings.length;


const confirmed = bookings.filter(
  (booking) => booking.status === "confirmed",
).length;

const pending = bookings.filter(
  (booking) => booking.status === "pending",
).length;

const cancelled = bookings.filter(
  (booking) => booking.status === "cancelled",
).length;

const revenue = bookings
  .filter((booking) => booking.paymentStatus === "paid")
  .reduce(
    (totalAmount, booking) => totalAmount + booking.amount,
    0,
  );

return [
  {
    id: "total",
    label: "Total Bookings",
    value: total.toString(),
    description: "All bookings",
    type: "total",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    value: confirmed.toString(),
    description: "Confirmed bookings",
    type: "confirmed",
  },
  {
    id: "pending",
    label: "Pending",
    value: pending.toString(),
    description: "Bookings awaiting confirmation",
    type: "pending",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    value: cancelled.toString(),
    description: "Cancelled bookings",
    type: "cancelled",
  },
  {
    id: "revenue",
    label: "Revenue",
    value: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(revenue),
    description: "Paid booking revenue",
    type: "revenue",
  },
];


}, [bookings]);

const filteredBookings = useMemo(() => {
const query = searchQuery.trim().toLowerCase();


return bookings.filter((booking) => {
  const matchesSearch =
    query === "" ||
    booking.bookingReference.toLowerCase().includes(query) ||
    booking.passenger.fullName.toLowerCase().includes(query) ||
    booking.passenger.email.toLowerCase().includes(query) ||
    booking.flightNumber.toLowerCase().includes(query) ||
    booking.departureAirportCode.toLowerCase().includes(query) ||
    booking.arrivalAirportCode.toLowerCase().includes(query) ||
    booking.departureCity.toLowerCase().includes(query) ||
    booking.arrivalCity.toLowerCase().includes(query);

  const matchesStatus =
    statusFilter === "all" ||
    booking.status === statusFilter;

  const matchesPayment =
    paymentFilter === "all" ||
    booking.paymentStatus === paymentFilter;

  const matchesClass =
    classFilter === "all" ||
    booking.cabinClass === classFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPayment &&
    matchesClass
  );
});


}, [
bookings,
searchQuery,
statusFilter,
paymentFilter,
classFilter,
]);

const handleAddBooking = () => {
setEditingBooking(null);
setShowForm(true);
};

const handleViewBooking = (booking: AdminBooking) => {
setSelectedBooking(booking);
setShowDetails(true);
};

const handleEditBooking = (booking: AdminBooking) => {
setEditingBooking(booking);
setShowForm(true);
};

const handleDeleteBooking = (booking: AdminBooking) => {
const confirmed = window.confirm(
`Are you sure you want to delete booking ${booking.bookingReference}?`,
);


if (!confirmed) {
  return;
}

setBookings((currentBookings) =>
  currentBookings.filter(
    (currentBooking) =>
      currentBooking.id !== booking.id,
  ),
);

if (selectedBooking?.id === booking.id) {
  setSelectedBooking(null);
  setShowDetails(false);
}


};

const handleSaveBooking = (booking: AdminBooking) => {
setBookings((currentBookings) => {
const bookingExists = currentBookings.some(
(currentBooking) =>
currentBooking.id === booking.id,
);


  if (bookingExists) {
    return currentBookings.map((currentBooking) =>
      currentBooking.id === booking.id
        ? booking
        : currentBooking,
    );
  }

  return [booking, ...currentBookings];
});

setEditingBooking(null);
setShowForm(false);


};

const handleClearFilters = () => {
setSearchQuery("");
setStatusFilter("all");
setPaymentFilter("all");
setClassFilter("all");
};

const handleCloseDetails = () => {
setSelectedBooking(null);
setShowDetails(false);
};

const handleCloseForm = () => {
setEditingBooking(null);
setShowForm(false);
};

return ( <div className="space-y-6"> <BookingHeader
     onAddBooking={handleAddBooking}
   />

```
  <BookingStats
    summaries={summaries}
  />

  <BookingFilters
    searchQuery={searchQuery}
    statusFilter={statusFilter}
    paymentFilter={paymentFilter}
    classFilter={classFilter}
    onSearchChange={setSearchQuery}
    onStatusChange={setStatusFilter}
    onPaymentChange={setPaymentFilter}
    onClassChange={setClassFilter}
    onClearFilters={handleClearFilters}
  />

  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {filteredBookings.length}{" "}
        {filteredBookings.length === 1
          ? "booking"
          : "bookings"}
      </p>

      {filteredBookings.length !== bookings.length && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Showing filtered results
        </p>
      )}
    </div>
  </div>

  <BookingTable
    bookings={filteredBookings}
    onView={handleViewBooking}
    onEdit={handleEditBooking}
    onDelete={handleDeleteBooking}
  />

  {showDetails && (
    <BookingDetails
      booking={selectedBooking}
      onClose={handleCloseDetails}
    />
  )}

  {showForm && (
    <BookingForm
      key={editingBooking?.id ?? "new"}
      booking={editingBooking}
      onSubmit={handleSaveBooking}
      onClose={handleCloseForm}
    />
  )}
</div>


);
}
