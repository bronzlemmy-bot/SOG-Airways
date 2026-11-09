"use client";

import {
CalendarDays,
CreditCard,
Mail,
MapPin,
Phone,
Plane,
ShieldCheck,
User,
} from "lucide-react";

import type { AdminPassenger } from "./admin-passengers-data/AdminPassengersData";
import PassengerStatusBadge from "./PassengerStatusBadge";

interface PassengerDetailsProps {
passenger: AdminPassenger;
onEdit?: (passenger: AdminPassenger) => void;
onClose?: () => void;
}

export default function PassengerDetails({
passenger,
onEdit,
onClose,
}: PassengerDetailsProps) {
const fullName = `${passenger.firstName} ${passenger.lastName}`;

return ( <div className="space-y-6">
{/* Header */} <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div className="flex items-center gap-4"> <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
{passenger.firstName.charAt(0)}
{passenger.lastName.charAt(0)} </div>


      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {fullName}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {passenger.passengerId}
        </p>
      </div>
    </div>

    <PassengerStatusBadge status={passenger.status} />
  </div>

  {/* Contact Information */}
  <section className="rounded-2xl border border-border bg-muted/20 p-5">
    <div className="mb-4 flex items-center gap-2">
      <User className="h-4 w-4 text-primary" />

      <h3 className="text-sm font-semibold text-foreground">
        Contact Information
      </h3>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem
        icon={Mail}
        label="Email"
        value={passenger.email}
      />

      <DetailItem
        icon={Phone}
        label="Phone"
        value={passenger.phone}
      />

      <DetailItem
        icon={MapPin}
        label="Nationality"
        value={passenger.nationality}
      />

      <DetailItem
        icon={User}
        label="Gender"
        value={formatValue(passenger.gender)}
      />
    </div>
  </section>

  {/* Personal Information */}
  <section className="rounded-2xl border border-border bg-muted/20 p-5">
    <div className="mb-4 flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-primary" />

      <h3 className="text-sm font-semibold text-foreground">
        Personal Information
      </h3>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem
        icon={CalendarDays}
        label="Date of Birth"
        value={formatDate(passenger.dateOfBirth)}
      />

      <DetailItem
        icon={CalendarDays}
        label="Registered"
        value={formatDate(passenger.registeredAt)}
      />

      <DetailItem
        icon={CalendarDays}
        label="Last Updated"
        value={formatDate(passenger.updatedAt)}
      />
    </div>
  </section>

  {/* Passport Information */}
  <section className="rounded-2xl border border-border bg-muted/20 p-5">
    <div className="mb-4 flex items-center gap-2">
      <CreditCard className="h-4 w-4 text-primary" />

      <h3 className="text-sm font-semibold text-foreground">
        Passport Information
      </h3>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <DetailItem
        icon={CreditCard}
        label="Passport Number"
        value={passenger.passportNumber}
      />

      <DetailItem
        icon={CalendarDays}
        label="Passport Expiry"
        value={formatDate(passenger.passportExpiry)}
      />
    </div>
  </section>

  {/* Travel Summary */}
  <section className="rounded-2xl border border-border bg-muted/20 p-5">
    <div className="mb-4 flex items-center gap-2">
      <Plane className="h-4 w-4 text-primary" />

      <h3 className="text-sm font-semibold text-foreground">
        Travel Summary
      </h3>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryItem
        label="Total Bookings"
        value={passenger.totalBookings}
      />

      <SummaryItem
        label="Total Trips"
        value={passenger.totalTrips}
      />

      <SummaryItem
        label="Last Trip"
        value={
          passenger.lastTrip
            ? formatDate(passenger.lastTrip)
            : "No trips yet"
        }
      />
    </div>
  </section>

  {/* Actions */}
  {(onEdit || onClose) && (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Close
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(passenger)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ShieldCheck className="h-4 w-4" />
          Edit Passenger
        </button>
      )}
    </div>
  )}
</div>


);
}

interface DetailItemProps {
icon: React.ComponentType<{ className?: string }>;
label: string;
value: string;
}

function DetailItem({
icon: Icon,
label,
value,
}: DetailItemProps) {
return ( <div className="flex items-start gap-3"> <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"> <Icon className="h-4 w-4" /> </div>


  <div className="min-w-0">
    <p className="text-xs text-muted-foreground">
      {label}
    </p>

    <p className="mt-1 wrap-break-words text-sm font-medium text-foreground">
      {value}
    </p>
  </div>
</div>


);
}

interface SummaryItemProps {
label: string;
value: string | number;
}

function SummaryItem({
label,
value,
}: SummaryItemProps) {
return ( <div className="rounded-xl bg-background p-4"> <p className="text-xs text-muted-foreground">
{label} </p>


  <p className="mt-1 text-lg font-semibold text-foreground">
    {value}
  </p>
</div>


);
}

function formatDate(value: string): string {
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return date.toLocaleDateString(undefined, {
year: "numeric",
month: "short",
day: "numeric",
});
}

function formatValue(value: string): string {
return value.charAt(0).toUpperCase() + value.slice(1);
}
