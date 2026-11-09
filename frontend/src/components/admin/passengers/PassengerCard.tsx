"use client";

import { Mail, Phone, Plane, CalendarDays } from "lucide-react";

import type { AdminPassenger } from "./admin-passengers-data/AdminPassengersData";
import PassengerActions from "./PassengerActions";
import PassengerStatusBadge from "./PassengerStatusBadge";

interface PassengerCardsProps {
passengers: AdminPassenger[];

onView: (passenger: AdminPassenger) => void;
onEdit: (passenger: AdminPassenger) => void;
onStatusChange: (
passenger: AdminPassenger,
status: AdminPassenger["status"]
) => void;
onDelete: (passenger: AdminPassenger) => void;
}

export default function PassengerCards({
passengers,
onView,
onEdit,
onStatusChange,
onDelete,
}: PassengerCardsProps) {
if (passengers.length === 0) {
return ( <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"> <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted"> <Plane className="h-5 w-5 text-muted-foreground" /> </div>

```
    <h3 className="mt-4 text-sm font-semibold text-foreground">
      No passengers found
    </h3>

    <p className="mt-1 text-sm text-muted-foreground">
      Try changing your search or filter criteria.
    </p>
  </div>
);


}

return ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
{passengers.map((passenger) => {
const fullName = `${passenger.firstName} ${passenger.lastName}`;


    return (
      <article
        key={passenger.id}
        className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {passenger.firstName.charAt(0)}
              {passenger.lastName.charAt(0)}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {fullName}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {passenger.passengerId}
              </p>
            </div>
          </div>

          <PassengerStatusBadge status={passenger.status} />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{passenger.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{passenger.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              Registered{" "}
              {new Date(
                passenger.registeredAt
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Bookings
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {passenger.totalBookings}
            </p>
          </div>

          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Trips
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {passenger.totalTrips}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <PassengerActions
            passenger={passenger}
            onView={onView}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </div>
      </article>
    );
  })}
</div>

);
}
