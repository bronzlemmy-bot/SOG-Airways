"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
ArrowRight,
CalendarCheck2,
ClipboardList,
CreditCard,
LogIn,
} from "lucide-react";

interface BookingActionDetailsProps {
bookingId: string;
canCheckIn?: boolean;
canManageTrip?: boolean;
canViewPayment?: boolean;
}

export default function BookingActionDetails({
bookingId,
canCheckIn = true,
canManageTrip = true,
canViewPayment = true,
}: BookingActionDetailsProps) {
const bookingKey = encodeURIComponent(bookingId);

const actions = [
canCheckIn
? {
href: `/users/check-in/${bookingKey}`,
label: "Check In",
description: "Complete your check-in when available.",
icon: LogIn,
}
: null,
canManageTrip
? {
href: `/users/manage-trips?bookingReference=${bookingKey}`,
label: "Manage Trip",
description: "Review and manage your trip options.",
icon: CalendarCheck2,
}
: null,
canViewPayment
? {
href: `/users/booking-details/${bookingKey}#payment`,
label: "Payment Details",
description: "View payment information for this booking.",
icon: CreditCard,
}
: null,
{
href: `/users/booking-details/${bookingKey}#details`,
label: "Booking Details",
description: "Return to the main booking information.",
icon: ClipboardList,
},
].filter(Boolean) as {
href: string;
label: string;
description: string;
icon: typeof LogIn;
}[];

return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div> <h2 className="text-base font-semibold text-slate-900">
Booking Actions </h2>

```
      <p className="mt-1 text-sm text-slate-500">
        Manage your booking and access available options
      </p>
    </div>
  </div>

  <div className="grid gap-3 p-5 sm:p-6 md:grid-cols-2">
    {actions.map((action, index) => {
      const Icon = action.icon;

      return (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        >
          <Link
            href={action.href}
            className="group flex h-full items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {action.label}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {action.description}
              </p>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
          </Link>
        </motion.div>
      );
    })}
  </div>
</motion.section>


);
}
