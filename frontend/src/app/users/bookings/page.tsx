"use client";

import { useEffect, useMemo, useState } from "react";

import BookingFilters, {
  type BookingFilterValues,
} from "@/components/user/bookings/BookingFilters";
import BookingHeader from "@/components/user/bookings/BookingHeader";
import BookingList from "@/components/user/bookings/BookingList";
import type { Booking as BookingCardData } from "@/components/user/bookings/BookingCard";
import { airportService } from "@/services/airportService";
import { bookingService } from "@/services/bookingService";
import { flightService } from "@/services/flightService";

export default function BookingPage() {
  const [filters, setFilters] = useState<BookingFilterValues>({
    search: "",
    status: "all",
    date: "",
  });
  const [bookings, setBookings] = useState<BookingCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      bookingService.getMyBookings(),
      flightService.getCheckoutFlights(),
      airportService.getCheckoutAirports(),
    ])
      .then(([customerBookings, flights, airports]) => {
        if (!active) return;
        const flightById = new Map(flights.map((flight) => [flight.id, flight]));
        const airportById = new Map(airports.map((airport) => [airport.id, airport]));
        setBookings(
          customerBookings.map((booking) => {
            const flight = flightById.get(booking.flight);
            const departureAirport = flight
              ? airportById.get(flight.departureAirport)
              : undefined;
            const arrivalAirport = flight
              ? airportById.get(flight.arrivalAirport)
              : undefined;

            return {
              id: booking.id,
              bookingReference: booking.bookingReference,
              status: booking.status,
              airline: "SOG Airways",
              flightNumber: flight?.flightNumber,
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
              departureDate: flight?.scheduledDeparture,
              departureTime: flight
                ? new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  }).format(new Date(flight.scheduledDeparture))
                : undefined,
              arrivalDate: flight?.scheduledArrival,
              arrivalTime: flight
                ? new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  }).format(new Date(flight.scheduledArrival))
                : undefined,
              cabinClass: booking.bookingClass.replaceAll("_", " "),
              passengerCount: booking.passengerCount,
            };
          }),
        );
      })
      .catch((fetchError: unknown) => {
        if (!active) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load your bookings.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch =
        !search ||
        booking.bookingReference?.toLowerCase().includes(search) ||
        booking.flightNumber?.toLowerCase().includes(search) ||
        booking.destination.city.toLowerCase().includes(search);
      const matchesStatus =
        filters.status === "all" ||
        booking.status.toLowerCase() === filters.status;
      const matchesDate =
        !filters.date ||
        booking.departureDate?.slice(0, 10) === filters.date;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, filters]);

  const handleClearFilters = () => {
    setFilters({ search: "", status: "all", date: "" });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <BookingHeader />
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}
          {loading && (
            <p role="status" className="text-sm text-slate-600">
              Loading your backend bookings…
            </p>
          )}
          <BookingFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClear={handleClearFilters}
          />
          {!loading && !error && (
            <BookingList bookings={filteredBookings} />
          )}
        </div>
      </section>
    </main>
  );
}
