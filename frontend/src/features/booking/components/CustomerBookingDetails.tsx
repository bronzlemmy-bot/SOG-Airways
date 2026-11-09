"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BookingActions from "@/components/user/booking-details/BookingActions";
import BaggageDetails from "@/components/user/booking-details/BaggageDetails";
import BookingDetails from "@/components/user/booking-details/BookingDetails";
import BookingDetailsHeader from "@/components/user/booking-details/BookingDetailsHeader";
import BookingTimeline from "@/components/user/booking-details/BookingTimeline";
import FlightDetails from "@/components/user/booking-details/FlightDetails";
import PassengerDetails from "@/components/user/booking-details/PassengerDetails";
import PaymentDetails from "@/components/user/booking-details/PaymentDetails";
import { airportService } from "@/services/airportService";
import { bookingService } from "@/services/bookingService";
import { ticketService } from "@/services/ticketService";
import type {
  CheckoutAirport,
  CustomerBookingDetails as CustomerBookingDetailsResponse,
} from "@/types";

interface CustomerBookingDetailsProps {
  bookingId: string;
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function CustomerBookingDetails({
  bookingId,
}: CustomerBookingDetailsProps) {
  const [details, setDetails] =
    useState<CustomerBookingDetailsResponse | null>(null);
  const [airports, setAirports] = useState<CheckoutAirport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingTicketId, setDownloadingTicketId] = useState<string | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      bookingService.getCustomerBookingDetails(bookingId),
      airportService.getCheckoutAirports(),
    ])
      .then(([bookingDetails, checkoutAirports]) => {
        if (!active) return;
        setDetails(bookingDetails);
        setAirports(checkoutAirports);
      })
      .catch((fetchError: unknown) => {
        if (!active) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load this booking.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookingId]);

  async function downloadTicket(ticketId: string, ticketNumber: string) {
    setDownloadError("");
    setDownloadingTicketId(ticketId);
    try {
      const pdf = await ticketService.downloadTicketPdf(ticketId);
      if (pdf.type !== "application/pdf") {
        throw new Error("The ticket service did not return a PDF document.");
      }

      const objectUrl = URL.createObjectURL(pdf);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `SOG-Airways-Ticket-${ticketNumber}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (downloadFailure) {
      setDownloadError(
        downloadFailure instanceof Error
          ? downloadFailure.message
          : "Unable to download the ticket PDF.",
      );
    } finally {
      setDownloadingTicketId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
        <p role="status" className="mx-auto max-w-7xl text-sm text-slate-600 dark:text-slate-300">
          Loading booking details from SOG Airways…
        </p>
      </main>
    );
  }

  if (error || !details) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
        <section className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Booking unavailable
          </h1>
          <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error || "The backend did not return this booking."}
          </p>
          <Link
            href="/users/bookings"
            className="mt-5 inline-flex font-semibold text-sky-700 dark:text-sky-300"
          >
            Return to my bookings
          </Link>
        </section>
      </main>
    );
  }

  const departureAirport = airports.find(
    (airport) => airport.id === details.flight.departureAirport,
  );
  const arrivalAirport = airports.find(
    (airport) => airport.id === details.flight.arrivalAirport,
  );
  const ticketByPassenger = new Map(
    details.tickets.map((ticket) => [ticket.passenger, ticket]),
  );
  const paymentMethod = details.payment?.metadata.method;
  const timeline = [
    {
      id: "created",
      title: "Booking created",
      description: `Reference ${details.booking.bookingReference}`,
      date: details.booking.bookedAt,
      completed: true,
      status: details.booking.status,
    },
    ...(details.payment
      ? [
          {
            id: "payment",
            title: "DEMO payment",
            description:
              details.payment.status === "completed"
                ? "The simulated payment was approved. No money moved."
                : "The simulated payment was not approved.",
            date: details.payment.paidAt ?? details.payment.createdAt,
            completed: details.payment.status === "completed",
            status: details.payment.status,
          },
        ]
      : []),
    ...details.tickets.map((ticket) => ({
      id: ticket.id,
      title: "DEMO ticket issued",
      description: `${ticket.ticketNumber} · not valid for travel`,
      date: ticket.issuedAt,
      completed: true,
      status: ticket.status,
    })),
    {
      id: "departure",
      title: "Scheduled departure",
      description: "Flight schedule provided by SOG Airways.",
      date: details.flight.scheduledDeparture,
      completed: false,
      status: "scheduled",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Payments are simulated DEMO transactions. DEMO tickets are not valid
          for travel or boarding.
        </p>
        <BookingDetailsHeader
          bookingReference={details.booking.bookingReference}
          status={details.booking.status}
          departureDate={details.flight.scheduledDeparture}
        />
        <BookingDetails
          booking={{
            id: details.booking.id,
            bookingReference: details.booking.bookingReference,
            status: details.booking.status,
            airline: "SOG Airways",
            flightNumber: details.flight.flightNumber,
            origin: {
              code: departureAirport?.airportCode ?? "Unavailable",
              city: departureAirport?.city ?? "Airport details unavailable",
              airport: departureAirport?.name,
            },
            destination: {
              code: arrivalAirport?.airportCode ?? "Unavailable",
              city: arrivalAirport?.city ?? "Airport details unavailable",
              airport: arrivalAirport?.name,
            },
            departureDate: details.flight.scheduledDeparture,
            departureTime: formatTime(details.flight.scheduledDeparture),
            arrivalDate: details.flight.scheduledArrival,
            arrivalTime: formatTime(details.flight.scheduledArrival),
            cabinClass: details.booking.bookingClass.replaceAll("_", " "),
            passengerCount: details.booking.passengerCount,
          }}
        />
        <FlightDetails
          flight={{
            airline: "SOG Airways",
            flightNumber: details.flight.flightNumber,
            origin: {
              code: departureAirport?.airportCode ?? "—",
              city: departureAirport?.city ?? "Unavailable",
              airport: departureAirport?.name,
            },
            destination: {
              code: arrivalAirport?.airportCode ?? "—",
              city: arrivalAirport?.city ?? "Unavailable",
              airport: arrivalAirport?.name,
            },
            departureDate: details.flight.scheduledDeparture,
            departureTime: formatTime(details.flight.scheduledDeparture),
            arrivalDate: details.flight.scheduledArrival,
            arrivalTime: formatTime(details.flight.scheduledArrival),
            cabinClass: details.booking.bookingClass.replaceAll("_", " "),
          }}
        />
        <PassengerDetails
          passengers={details.passengers.map((passenger) => ({
            id: passenger.id,
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            email: passenger.email ?? undefined,
            phone: passenger.phoneNumber ?? undefined,
            passengerType: "Passenger",
            seatNumber: ticketByPassenger.get(passenger.id)?.seatNumber,
          }))}
        />
        <BaggageDetails baggage={[]} />
        <PaymentDetails
          payment={
            details.payment
              ? {
                  demoOnly: true,
                  paymentMethod:
                    paymentMethod === "demo-wallet"
                      ? "Demo wallet"
                      : paymentMethod === "demo-bank-transfer"
                        ? "Demo bank transfer"
                        : "DEMO",
                  paymentStatus: details.payment.status,
                  transactionId: details.payment.paymentReference,
                  currency: details.payment.currency,
                  subtotal: details.booking.baseFare,
                  taxes: details.booking.taxes,
                  fees: details.booking.fees,
                  total: details.payment.amount,
                }
              : undefined
          }
        />
        {details.tickets.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold">DEMO tickets</h2>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Not valid for travel or boarding.
            </p>
            <div className="mt-4 space-y-3">
              {details.tickets.map((ticket) => {
                const passenger = details.passengers.find(
                  (item) => item.id === ticket.passenger,
                );
                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
                  >
                    <div>
                      <p className="font-semibold">
                        {passenger
                          ? `${passenger.firstName} ${passenger.lastName}`
                          : "Passenger"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {ticket.ticketNumber} · {details.flight.flightNumber}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Tracking reference: {ticket.trackingReference ?? "Unavailable"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={downloadingTicketId === ticket.id}
                      onClick={() =>
                        downloadTicket(ticket.id, ticket.ticketNumber)
                      }
                      className="min-h-11 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"
                    >
                      {downloadingTicketId === ticket.id
                        ? "Preparing PDF…"
                        : "Download ticket PDF"}
                    </button>
                  </div>
                );
              })}
            </div>
            {downloadError && (
              <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">
                {downloadError}
              </p>
            )}
            <Link
              href={`/track-flight?flight=${encodeURIComponent(details.flight.flightNumber)}&trackingReference=${encodeURIComponent(details.trackingReference ?? "")}`}
              className="mt-5 inline-flex font-semibold text-sky-700 dark:text-sky-300"
            >
              Track flight
            </Link>
          </section>
        )}
        <BookingTimeline timeline={timeline} />
        <BookingActions
          bookingId={details.booking.id}
          canCheckIn={false}
          canManageTrip={false}
          canViewPayment={false}
        />
      </div>
    </main>
  );
}
