"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CheckInHeader from "@/components/user/check-in/CheckInHeader";
import CheckInForm from "@/components/user/check-in/CheckInForm";
import CheckInPassengerCard from "@/components/user/check-in/CheckInPassengerCard";
import PassengerVerification from "@/components/user/check-in/PassengerVerification";
import SeatSelection, {
Seat,
} from "@/components/user/check-in/SeatSelection";
import BaggageSelection, {
SelectedBaggage,
} from "@/components/user/check-in/BaggageSelection";
import CheckInSummary from "@/components/user/check-in/CheckInSummary";
import CheckInConfirmation from "@/components/user/check-in/CheckInConfirmation";

import {
checkInBaggage,
checkInBooking,
checkInPassengers,
checkInSeats,
} from "@/components/user/check-in/check-in-data/CheckInData";

interface CheckInPageClientProps {
bookingId: string;
}

export default function CheckInPageClient({
bookingId,
}: CheckInPageClientProps) {
const router = useRouter();

const passenger = checkInPassengers[0];

const [verified, setVerified] = useState(false);
const [selectedSeatId, setSelectedSeatId] = useState<string>();
const [selectedBaggage, setSelectedBaggage] = useState<SelectedBaggage[]>(
[]
);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isCompleted, setIsCompleted] = useState(false);

const selectedSeat = checkInSeats.find(
(seat) => seat.id === selectedSeatId
);

const summaryBaggage = selectedBaggage.flatMap((selected) => {
const item = checkInBaggage.find(
(baggage) => baggage.id === selected.baggageId
);


if (!item) return [];

return [
  {
    baggageId: item.id,
    name: item.name,
    quantity: selected.quantity,
    weight: item.weight,
    weightUnit: item.weightUnit,
  },
];


});

const canComplete =
verified && Boolean(selectedSeatId) && !isSubmitting;

const handleSeatSelect = (seat: Seat) => {
setSelectedSeatId(seat.id);
};

const handleSubmit = async () => {
if (!canComplete) return;


setIsSubmitting(true);

await new Promise((resolve) => setTimeout(resolve, 800));

setIsSubmitting(false);
setIsCompleted(true);


};

if (isCompleted) {
return ( <main className="min-h-screen bg-slate-50"> <CheckInHeader
       bookingReference={bookingId}
       status="checked-in"
       departureDate={checkInBooking.departureDate}
       flightNumber={checkInBooking.flightNumber}
       originCode={checkInBooking.origin.code}
       destinationCode={checkInBooking.destination.code}
     />


    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CheckInConfirmation
        bookingId={bookingId}
        bookingReference={bookingId}
        flightNumber={checkInBooking.flightNumber}
        originCode={checkInBooking.origin.code}
        destinationCode={checkInBooking.destination.code}
        seatNumber={selectedSeat?.label}
        passengerName={`${passenger.firstName} ${passenger.lastName}`}
        departureDate={checkInBooking.departureDate}
        onDone={() => router.push("/users/bookings")}
      />
    </section>
  </main>
);


}

return ( <main className="min-h-screen bg-slate-50"> <CheckInHeader
     bookingReference={bookingId}
     status={checkInBooking.status}
     departureDate={checkInBooking.departureDate}
     flightNumber={checkInBooking.flightNumber}
     originCode={checkInBooking.origin.code}
     destinationCode={checkInBooking.destination.code}
   />


  <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <CheckInForm
      isSubmitting={isSubmitting}
      canSubmit={canComplete}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      onCancel={() => router.push("/users/bookings")}
    >
      <div className="space-y-8">
        <CheckInPassengerCard
          passenger={passenger}
          selected
        />

        <PassengerVerification
          passenger={passenger}
          verified={verified}
          onVerificationChange={setVerified}
        />

        <SeatSelection
          seats={checkInSeats}
          selectedSeatId={selectedSeatId}
          onSeatSelect={handleSeatSelect}
        />

        <BaggageSelection
          baggage={checkInBaggage}
          selectedBaggage={selectedBaggage}
          onBaggageChange={setSelectedBaggage}
        />

        <CheckInSummary
          bookingReference={bookingId}
          flightNumber={checkInBooking.flightNumber}
          originCode={checkInBooking.origin.code}
          destinationCode={checkInBooking.destination.code}
          passenger={{
            id: passenger.id,
            title: passenger.title,
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            passengerType: passenger.passengerType,
          }}
          seat={
            selectedSeat
              ? {
                  id: selectedSeat.id,
                  label: selectedSeat.label,
                  cabinClass: selectedSeat.cabinClass,
                }
              : undefined
          }
          baggage={summaryBaggage}
          isReady={canComplete}
        />
      </div>
    </CheckInForm>
  </section>
</main>


);
}
