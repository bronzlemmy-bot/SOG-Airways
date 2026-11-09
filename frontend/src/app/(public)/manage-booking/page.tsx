"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BaggageClaim,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  HelpCircle,
  KeyRound,
  Mail,
  Plane,
  Search,
  ShieldCheck,
  TicketCheck,
  UserRound,
  X,
} from "lucide-react";

import { ApiError } from "@/services/api";
import { bookingService } from "@/services/bookingService";
import type { CustomerBookingDetails } from "@/types";

export default function ManageBookingPage() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundBooking, setFoundBooking] =
    useState<CustomerBookingDetails | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reference = bookingReference.trim().toUpperCase();
    const surname = lastName.trim();

    if (!reference || !surname) {
      setError(
        "Please enter your booking reference and passenger last name.",
      );
      setRequiresSignIn(false);
      setSearched(false);
      setFoundBooking(null);
      return;
    }

    if (reference.length < 5) {
      setError("Please enter a valid booking reference.");
      setRequiresSignIn(false);
      setSearched(false);
      setFoundBooking(null);
      return;
    }

    setBookingReference(reference);
    setError("");
    setFoundBooking(null);
    setSearched(false);
    setIsSearching(true);

    try {
      const booking = await bookingService.findManageBooking(
        reference,
        surname,
      );

      if (!booking) {
        setError(
          "We couldn't find a booking matching those details. Check your booking reference and passenger surname, then try again.",
        );
        return;
      }

      setFoundBooking(booking);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        setError("Sign in to view bookings linked to your account.");
        setRequiresSignIn(true);
      } else if (caughtError instanceof ApiError && caughtError.status === 404) {
        setError(
          "We couldn't find a booking matching those details. Check your booking reference and passenger surname, then try again.",
        );
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "We couldn't retrieve your booking. Please try again.",
        );
      }
    } finally {
      setSearched(true);
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setBookingReference("");
    setLastName("");
    setError("");
    setRequiresSignIn(false);
    setSearched(false);
    setIsSearching(false);
    setFoundBooking(null);
  };

  const handleReferenceChange = (value: string) => {
    setBookingReference(value.toUpperCase());
    setError("");
    setRequiresSignIn(false);
    setSearched(false);
    setFoundBooking(null);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    setError("");
    setRequiresSignIn(false);
    setSearched(false);
    setFoundBooking(null);
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toLocaleString("en-NG")}`;
    }
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const getStatusClasses = (
    status: CustomerBookingDetails["booking"]["status"],
  ) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      case "completed":
        return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
      case "expired":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-190 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=90"
          alt="Passenger aircraft flying above the clouds"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/45 to-slate-950/85" />

        <div className="relative mx-auto flex min-h-190 max-w-7xl items-center px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl text-white"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                <TicketCheck className="h-4 w-4 text-sky-300" />
                Manage your journey
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
                Manage your booking with ease.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
                View your trip details, prepare for your journey, check in,
                manage baggage, and get the help you need — all from one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
                >
                  Find my booking
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/check-in"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Check in
                </Link>
              </div>
            </motion.div>

            {/* Booking Form and Results */}
            <motion.div
              id="booking-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-4xl border border-white/20 bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-7"
            >
              <div className="mb-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                  <Search className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  Find your booking
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Enter your booking reference and passenger surname to access
                  your trip.
                </p>
                <p
                  role="note"
                  className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Demo lookup only: sample records are fictional and are not
                  real reservations. Use fictional details; nothing is sent
                  to an airline system.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Booking Reference */}
                <div>
                  <label
                    htmlFor="booking-reference"
                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Booking reference
                  </label>

                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="booking-reference"
                      name="bookingReference"
                      type="text"
                      autoComplete="off"
                      required
                      maxLength={20}
                      value={bookingReference}
                      onChange={(event) =>
                        handleReferenceChange(event.target.value)
                      }
                      placeholder="e.g. SOG7K2"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-950 dark:focus:ring-sky-950/50"
                    />
                  </div>
                </div>

                {/* Passenger Last Name */}
                <div>
                  <label
                    htmlFor="last-name"
                    className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Passenger last name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(event) =>
                        handleLastNameChange(event.target.value)
                      }
                      placeholder="Enter passenger surname"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-950 dark:focus:ring-sky-950/50"
                    />
                  </div>
                </div>

                {/* Search Error */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="booking-error"
                      role="alert"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {error}{" "}
                        {requiresSignIn && (
                          <Link
                            href="/login"
                            className="font-bold underline underline-offset-2"
                          >
                            Sign in
                          </Link>
                        )}
                      </span>
                    </motion.div>
                  )}

                  {searched && foundBooking && !error && (
                    <motion.div
                      key="booking-success"
                      role="status"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                        <div>
                          <p className="font-bold text-emerald-800 dark:text-emerald-300">
                            Booking found successfully
                          </p>

                          <p className="mt-1 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                            We found booking{" "}
                            <strong>
                              {foundBooking.booking.bookingReference}
                            </strong>
                            .
                            Your booking details are displayed below.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {isSearching ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Searching booking...
                    </>
                  ) : (
                    <>
                      Find my booking
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {searched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Search className="h-4 w-4" />
                    Search another booking
                  </button>
                )}
              </form>

              {/* Actual Booking Results */}
              <AnimatePresence>
                {foundBooking && (
                  <motion.div
                    key={foundBooking.booking.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.35 }}
                    className="mt-7 space-y-6 border-t border-slate-200 pt-6 dark:border-slate-700"
                  >
                    {/* Reference and Status */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Booking reference
                        </p>

                        <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                          {foundBooking.booking.bookingReference}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusClasses(
                          foundBooking.booking.status,
                        )}`}
                      >
                        {foundBooking.booking.status}
                      </span>
                    </div>

                    {/* Booking Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Passengers
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                          {foundBooking.booking.passengerCount}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Total amount
                        </p>

                        <p className="mt-1 wrap-break-words text-lg font-bold text-slate-950 dark:text-white">
                          {formatAmount(
                            foundBooking.booking.totalAmount,
                            foundBooking.booking.currency,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Plane className="h-5 w-5 text-sky-600 dark:text-sky-400" />

                        <h4 className="font-bold text-slate-950 dark:text-white">
                          Flight details
                        </h4>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-slate-950 dark:text-white">
                            {foundBooking.flight.flightNumber}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {foundBooking.booking.bookingClass.replaceAll(
                              "_",
                              " ",
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <p className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
                              {foundBooking.flight.departureAirportName ??
                                foundBooking.flight.departureAirportCode ??
                                foundBooking.flight.departureAirport}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {formatTime(
                                foundBooking.flight.scheduledDeparture,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(
                                foundBooking.flight.scheduledDeparture.slice(
                                  0,
                                  10,
                                ),
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-1 text-sky-600 dark:text-sky-400">
                            <Plane className="h-5 w-5" />

                            <span className="text-[10px] font-medium text-slate-400">
                              Flight
                            </span>
                          </div>

                          <div className="min-w-0 text-right">
                            <p className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
                              {foundBooking.flight.arrivalAirportName ??
                                foundBooking.flight.arrivalAirportCode ??
                                foundBooking.flight.arrivalAirport}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {formatTime(
                                foundBooking.flight.scheduledArrival,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(
                                foundBooking.flight.scheduledArrival.slice(
                                  0,
                                  10,
                                ),
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passenger Details */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-sky-600 dark:text-sky-400" />

                        <h4 className="font-bold text-slate-950 dark:text-white">
                          Passenger details
                        </h4>
                      </div>

                      {foundBooking.passengers.length > 0 ? (
                        <div className="space-y-2">
                          {foundBooking.passengers.map((passenger) => {
                            const ticket = foundBooking.tickets.find(
                              (item) => item.passenger === passenger.id,
                            );

                            return (
                            <div
                              key={passenger.id}
                              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                <UserRound className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="wrap-break-words font-semibold text-slate-950 dark:text-white">
                                  {passenger.firstName} {passenger.lastName}
                                </p>

                                <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                                  Passenger
                                  {ticket?.seatNumber
                                    ? ` · Seat ${ticket.seatNumber}`
                                    : ""}
                                </p>

                                {ticket?.ticketNumber && (
                                  <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                                    Ticket: {ticket.ticketNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No passenger details are available for this booking.
                        </p>
                      )}
                    </div>

                    {/* Status Guidance */}
                    {foundBooking.booking.status === "cancelled" && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        This booking has been cancelled. Contact our support
                        team if you need help with the cancellation.
                      </div>
                    )}

                    {foundBooking.booking.paymentStatus === "refunded" && (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
                        This booking is marked as refunded.
                      </div>
                    )}

                    {foundBooking.booking.status === "pending" && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                        This booking is pending confirmation.
                      </div>
                    )}

                    {foundBooking.booking.status === "completed" && (
                      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
                        This booking is marked as completed.
                      </div>
                    )}

                    {foundBooking.booking.status === "confirmed" && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Your booking is confirmed. Please review your flight
                        details and prepare for your journey.
                      </div>
                    )}

                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Booked on{" "}
                      {formatDate(
                        foundBooking.booking.bookedAt.split("T")[0] ?? "",
                      )}
                      . Booking details are retrieved from your account.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Quick access
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Everything you need before you fly.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Get to the most important travel tools without searching through
              the site.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Online check-in",
                description:
                  "Check in before your flight and get ready for departure.",
                icon: TicketCheck,
                href: "/check-in",
              },
              {
                title: "Baggage",
                description:
                  "Review baggage allowances, packing guidance, and restrictions.",
                icon: BaggageClaim,
                href: "/baggage",
              },
              {
                title: "Travel information",
                description:
                  "Prepare for your destination and upcoming journey.",
                icon: FileText,
                href: "/travel-information",
              },
              {
                title: "Need help?",
                description:
                  "Get answers or contact the SOG Airways support team.",
                icon: CircleHelp,
                href: "/faq",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="group block h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800 dark:hover:bg-slate-900 dark:hover:shadow-black/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 transition-all group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-950/60 dark:group-hover:text-sky-300">
                        <Icon className="h-6 w-6" />
                      </div>

                      <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-600 dark:text-slate-600" />
                    </div>

                    <h3 className="mt-6 font-bold text-slate-950 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Information */}
      <section className="bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-4xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1400&q=85"
                alt="Passenger aircraft at an airport"
                width={1400}
                height={1000}
                className="h-105 w-full object-cover sm:h-130"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <p className="text-sm font-semibold text-sky-200">
                  Your journey starts here
                </p>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  Stay in control from booking to boarding.
                </h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pl-6"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Your booking
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                What you can manage
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                Find your booking above to review your reservation and travel
                details. Additional booking management actions can be connected
                as their services become available.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: CalendarDays,
                    title: "Flight details",
                    description:
                      "Review your route, departure information, and journey details.",
                  },
                  {
                    icon: UserRound,
                    title: "Passenger information",
                    description:
                      "Review passenger details associated with your booking.",
                  },
                  {
                    icon: BaggageClaim,
                    title: "Baggage options",
                    description:
                      "Review baggage information and prepare your luggage.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Travel preparation",
                    description:
                      "Check important requirements before heading to the airport.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-950 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before You Travel */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl bg-slate-950 p-7 text-white sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
                  <Clock3 className="h-4 w-4 text-sky-300" />
                  Before you travel
                </div>

                <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                  Give yourself enough time for a smooth airport experience.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Review your check-in requirements, baggage information, and
                  travel documents before your departure.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/check-in"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
                >
                  Check-in
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/baggage"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Baggage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/faq"
              className="group rounded-4xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                <HelpCircle className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
                Visit our FAQ
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Find answers to common questions about bookings, baggage,
                check-in, and travel.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700 dark:text-sky-400">
                View FAQs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="group rounded-4xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Mail className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
                Contact support
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Need assistance with your journey? Get in touch with the SOG
                Airways support team.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Contact us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/flights"
              className="group rounded-4xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                <Plane className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
                Book another flight
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Search available routes and start a new journey with SOG
                Airways.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-400">
                Search flights
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
              <BadgeCheck className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Ready for your next journey?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Search flights, explore destinations, or get help preparing for
              your trip.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/flights"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Search flights
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Explore destinations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}