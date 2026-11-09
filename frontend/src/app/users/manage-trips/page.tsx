"use client";

import { Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plane, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";


import TripLookupForm from "@/features/manage-trip/components/TripLookupForm";
import type { TripLookupData } from "@/features/manage-trip/components/TripLookupForm";

import ManageTripHeader from "@/components/user/manage-trip/ManageTripHeader";
import TripOverview from "@/components/user/manage-trip/TripOverview";
import TripFlightDetails from "@/components/user/manage-trip/TripFlightDetails";
import ChangeFlightForm from "@/components/user/manage-trip/ChangeFlightForm";
import ChangePassengerForm from "@/components/user/manage-trip/ChangePassengerForm";
import SeatChangeForm from "@/components/user/manage-trip/SeatChangeForm";
import TripConfarmation from "@/components/user/manage-trip/TripConfarmation";
import TripAction from "@/components/user/manage-trip/TripActions";
import BaggageManagment from "@/components/user/manage-trip/BaggageManagement";

import type {
  ManageTrip,
  ManageTripPassenger,
} from "@/components/user/manage-trip/manage-trip-data/ManageTripData";

import { useBooking } from "@/hooks";

type ActiveForm = "flight" | "passenger" | "seat" | "baggage" | null;

interface ConfirmationState {
  title: string;
  description: string;
}

function formatDate(value: string): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string): string {
  if (!value) return "Not available";

  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(value)) return value;

  const date = new Date(
    value.includes("T") ? value : `2000-01-01T${value}`,
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getCabinLabel(value: string): string {
  const labels: Record<string, string> = {
    economy: "Economy",
    "premium-economy": "Premium Economy",
    business: "Business",
    first: "First Class",
  };

  return labels[value.toLowerCase()] ?? value;
}

function getTripStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return labels[status.toLowerCase()] ?? status;
}

function getTripType(type: string): string {
  const labels: Record<string, string> = {
    "one-way": "One Way",
    "round-trip": "Round Trip",
    "multi-city": "Multi-City",
  };

  return labels[type.toLowerCase()] ?? type;
}

function ManageTripContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBookingReference =
    searchParams.get("bookingReference") ?? "";

  const {
    managedBooking,
    loading,
    error,
    findManageBooking,
    clearSelectedBooking,
    clearError,
  } = useBooking();

  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [confirmation, setConfirmation] =
    useState<ConfirmationState | null>(null);

  const [localPassengers, setLocalPassengers] =
    useState<ManageTripPassenger[] | null>(null);

  const [currentSeat, setCurrentSeat] = useState("");

  const booking = managedBooking?.booking;
  const firstFlight = managedBooking?.flight;
  const payment = managedBooking?.payment;

  const passengers = useMemo<ManageTripPassenger[]>(() => {
    if (!managedBooking) return [];

    const mapped = managedBooking.passengers.map((passenger, index) => ({
      id: passenger.id || `passenger-${index + 1}`,
      title: "",
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      type: "Passenger",
      seat:
        managedBooking.tickets.find(
          (ticket) => ticket.passenger === passenger.id,
        )?.seatNumber ?? "Not assigned",
    }));

    return localPassengers ?? mapped;
  }, [managedBooking, localPassengers]);

  const tripData = useMemo<ManageTrip | null>(() => {
    if (!booking || !firstFlight) return null;

    const airportParts = (
      code: string | undefined,
      city: string | undefined,
      name: string | undefined,
      fallbackId: string,
    ) => ({
      code: code || "N/A",
      city: city || name || "Unknown",
      airport: name || city || code || fallbackId,
    });

    const departure = airportParts(
      firstFlight.departureAirportCode,
      firstFlight.departureAirportCity,
      firstFlight.departureAirportName,
      firstFlight.departureAirport,
    );
    const arrival = airportParts(
      firstFlight.arrivalAirportCode,
      firstFlight.arrivalAirportCity,
      firstFlight.arrivalAirportName,
      firstFlight.arrivalAirport,
    );

    const currency = booking.currency;
    const paymentStatus = payment?.status ?? booking.paymentStatus;

    return {
      id: booking.id,
      bookingReference: booking.bookingReference,
      status: getTripStatus(booking.status),
      tripType: getTripType("one-way"),
      passengers,
      flight: {
        airline: "SOG Airways",
        flightNumber: firstFlight.flightNumber,
        origin: departure,
        destination: arrival,
        departureDate: formatDate(firstFlight.scheduledDeparture),
        departureTime: formatTime(firstFlight.scheduledDeparture),
        arrivalDate: formatDate(firstFlight.scheduledArrival),
        arrivalTime: formatTime(firstFlight.scheduledArrival),
        cabinClass: getCabinLabel(booking.bookingClass),
        duration: `${firstFlight.durationMinutes} minutes`,
      },
      baggage: {
        checkedBags: 0,
        totalWeight: "Not provided",
        carryOn: "Not provided",
      },
      paymentStatus: paymentStatus
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      totalAmount: booking.totalAmount,
      currency,
    };
  }, [booking, firstFlight, passengers, payment]);

  const closeForm = () => setActiveForm(null);

  const showConfirmation = (
    title: string,
    description: string,
  ) => {
    setActiveForm(null);
    setConfirmation({ title, description });
  };

  const handleLookup = async (data: TripLookupData) => {
    setLocalPassengers(null);
    setCurrentSeat("");
    setConfirmation(null);
    setActiveForm(null);

    const result = await findManageBooking(
      data.bookingReference,
      data.lastName,
    );

    if (result) {
      const firstPassenger = result.passengers[0];
      setCurrentSeat(
        result.tickets.find(
          (ticket) => ticket.passenger === firstPassenger?.id,
        )?.seatNumber ?? "",
      );
    }
  };

  const handleFlightSubmit = (data: {
    flightNumber: string;
    departureDate: string;
    cabinClass: string;
  }) => {
    showConfirmation(
      "Flight change request recorded",
      `Your request to change to ${data.flightNumber} on ${data.departureDate} in ${data.cabinClass} has been recorded in this session. It has not been sent to the airline because the change service is not connected yet.`,
    );
  };

  const handlePassengerSubmit = (
    passenger: ManageTripPassenger,
  ) => {
    setLocalPassengers((current) =>
      (current ?? passengers).map((item) =>
        item.id === passenger.id ? passenger : item,
      ),
    );

    showConfirmation(
      "Passenger edit preview",
      `${passenger.firstName} ${passenger.lastName}'s edited details are shown for this session only. They have not been saved to the airline booking.`,
    );
  };

  const handleSeatSubmit = (seat: string) => {
    setCurrentSeat(seat);

    setLocalPassengers((current) =>
      (current ?? passengers).map((passenger, index) =>
        index === 0 ? { ...passenger, seat } : passenger,
      ),
    );

    showConfirmation(
      "Seat change request recorded",
      `Seat ${seat} is selected for this session. The airline booking has not been changed because the seat-change service is not connected yet.`,
    );
  };

  const handleBaggageSubmit = () => {
    showConfirmation(
      "Additional baggage request",
      "Your baggage selection has not been sent to the airline. Baggage purchasing will be enabled when the baggage service is connected.",
    );
  };

  const handleViewTrip = () => {
    setConfirmation(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDone = () => setConfirmation(null);

  const handleBackToBookings = () => router.push("/users/bookings");

  const handleNewLookup = () => {
    clearSelectedBooking();
    clearError();
    setLocalPassengers(null);
    setCurrentSeat("");
    setActiveForm(null);
    setConfirmation(null);
  };

  if (!booking || !tripData) {
    return (
      <div className="min-h-full bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={handleBackToBookings}
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </button>

          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Plane className="h-7 w-7" />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Manage your trip
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Retrieve your reservation using the booking reference and
              surname of any passenger on the booking.
            </p>
          </div>

          <TripLookupForm
            key={initialBookingReference}
            onSubmit={handleLookup}
            loading={loading}
            error={error ?? undefined}
            onBack={handleBackToBookings}
            initialBookingReference={initialBookingReference}
            title="Find your booking"
            description="Enter the details exactly as they appear in your booking confirmation."
          />

          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            Your booking details are checked against the currently configured
            booking data. Flight, seat, passenger, and baggage changes are
            previews until the relevant airline services are connected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <ManageTripHeader
        bookingReference={tripData.bookingReference}
        status={tripData.status}
        tripType={tripData.tripType}
        departureDate={tripData.flight.departureDate}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleNewLookup}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Find another booking
          </button>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Viewing booking{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {tripData.bookingReference}
            </span>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <TripOverview
              trip={{
                ...tripData,
                passengers,
              }}
            />

            <TripFlightDetails flight={tripData.flight} />

            <BaggageManagment
              baggage={tripData.baggage}
              onManageBaggage={() => setActiveForm("baggage")}
            />

            <TripAction
              onChangeFlight={() => setActiveForm("flight")}
              onChangePassenger={() => setActiveForm("passenger")}
              onChangeSeat={() => setActiveForm("seat")}
              onManageBaggage={() => setActiveForm("baggage")}
            />
          </div>

          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Trip summary
              </p>

              <div className="mt-4 space-y-4">
                <SummaryRow
                  label="Booking"
                  value={tripData.bookingReference}
                />
                <SummaryRow
                  label="Passengers"
                  value={String(passengers.length)}
                />
                <SummaryRow
                  label="Cabin"
                  value={tripData.flight.cabinClass}
                />
                <SummaryRow
                  label="Payment"
                  value={tripData.paymentStatus}
                />

                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {tripData.currency}{" "}
                      {tripData.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackToBookings}
                className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back to Bookings
              </button>
            </motion.div>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {activeForm === "flight" && (
          <ModalShell onClose={closeForm}>
            <ChangeFlightForm
              flight={tripData.flight}
              onCancel={closeForm}
              onSubmit={handleFlightSubmit}
            />
          </ModalShell>
        )}

        {activeForm === "passenger" && (
          <ModalShell onClose={closeForm}>
            <ChangePassengerForm
              passengers={passengers}
              onCancel={closeForm}
              onSubmit={handlePassengerSubmit}
            />
          </ModalShell>
        )}

        {activeForm === "seat" && (
          <ModalShell onClose={closeForm}>
            <SeatChangeForm
              currentSeat={currentSeat}
              onCancel={closeForm}
              onSubmit={handleSeatSubmit}
            />
          </ModalShell>
        )}

        {activeForm === "baggage" && (
          <ModalShell onClose={closeForm}>
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Manage Baggage
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The baggage allowance is not available in this booking record.
                Check your ticket or contact SOG Airways before purchasing
                additional baggage.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleBaggageSubmit}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {confirmation && (
          <ModalShell onClose={handleDone}>
            <TripConfarmation
              bookingReference={tripData.bookingReference}
              title={confirmation.title}
              description={confirmation.description}
              onDone={handleDone}
              onViewTrip={handleViewTrip}
            />
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ManageTripPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full bg-slate-50 dark:bg-slate-950" />
      }
    >
      <ManageTripContent />
    </Suspense>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-right text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div
        className="flex w-full justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  );
}