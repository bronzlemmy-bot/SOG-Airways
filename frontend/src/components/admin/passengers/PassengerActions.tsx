"use client";

import {
MoreHorizontal,
Eye,
Pencil,
UserCheck,
UserX,
Trash2,
} from "lucide-react";

import type {
AdminPassenger,
PassengerStatus,
} from "./admin-passengers-data/AdminPassengersData";

interface PassengerActionsProps {
passenger: AdminPassenger;

onView: (passenger: AdminPassenger) => void;
onEdit: (passenger: AdminPassenger) => void;
onStatusChange: (
passenger: AdminPassenger,
status: PassengerStatus
) => void;
onDelete: (passenger: AdminPassenger) => void;
}

export default function PassengerActions({
passenger,
onView,
onEdit,
onStatusChange,
onDelete,
}: PassengerActionsProps) {
const isActive = passenger.status === "active";

return ( <div className="flex items-center justify-end gap-1">
<button
type="button"
onClick={() => onView(passenger)}
aria-label={`View ${passenger.firstName} ${passenger.lastName}`}
title="View passenger"
className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
> <Eye className="h-4 w-4" /> </button>

```
  <button
    type="button"
    onClick={() => onEdit(passenger)}
    aria-label={`Edit ${passenger.firstName} ${passenger.lastName}`}
    title="Edit passenger"
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
  >
    <Pencil className="h-4 w-4" />
  </button>

  <button
    type="button"
    onClick={() =>
      onStatusChange(
        passenger,
        isActive ? "inactive" : "active"
      )
    }
    aria-label={
      isActive
        ? `Deactivate ${passenger.firstName} ${passenger.lastName}`
        : `Activate ${passenger.firstName} ${passenger.lastName}`
    }
    title={isActive ? "Deactivate passenger" : "Activate passenger"}
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-600"
  >
    {isActive ? (
      <UserX className="h-4 w-4" />
    ) : (
      <UserCheck className="h-4 w-4" />
    )}
  </button>

  <button
    type="button"
    onClick={() => onDelete(passenger)}
    aria-label={`Delete ${passenger.firstName} ${passenger.lastName}`}
    title="Delete passenger"
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
  >
    <Trash2 className="h-4 w-4" />
  </button>

  <button
    type="button"
    aria-label="More passenger actions"
    title="More actions"
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
  >
    <MoreHorizontal className="h-4 w-4" />
  </button>
</div>


);
}
