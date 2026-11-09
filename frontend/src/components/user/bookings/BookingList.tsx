"use client";

import BookingCard, { Booking } from "./BookingCard";

interface BookingListProps {
bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
if (bookings.length === 0) {
return ( <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"> <h3 className="text-lg font-semibold text-slate-900">
No bookings found </h3>


    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
      Your bookings will appear here once you make a reservation.
    </p>
  </section>
);


}

return ( <section className="space-y-5">
{bookings.map((booking, index) => ( <BookingCard
       key={booking.id}
       booking={booking}
       index={index}
     />
))} </section>
);
}
