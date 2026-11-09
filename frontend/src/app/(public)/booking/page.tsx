"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Luggage,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import PaymentForm from "@/components/forms/booking/PaymentForm";
import { airportService } from "@/services/airportService";
import { bookingService } from "@/services/bookingService";
import { flightService } from "@/services/flightService";
import { paymentService } from "@/services/paymentService";
import { ticketService } from "@/services/ticketService";
import type {
  CheckoutAirport,
  CheckoutCabinClass,
  CheckoutFlight,
  CustomerBookingDetails,
  DemoPaymentOutcome,
  DemoPaymentWorkflowResult,
} from "@/types";

type BookingStep = 1 | 2 | 3 | 4 | 5;

type Passenger = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "" | "male" | "female" | "other";
  nationality: string;
};

type Seat = {
  id: string;
  row: number;
  letter: string;
  type: "standard" | "preferred" | "extra";
  price: number;
  occupied?: boolean;
};

const steps = [
  { number: 1, label: "Passengers" },
  { number: 2, label: "Seats & Extras" },
  { number: 3, label: "Review" },
  { number: 4, label: "Demo payment" },
  { number: 5, label: "Complete" },
];

const seats: Seat[] = [
  { id: "1A", row: 1, letter: "A", type: "preferred", price: 35 },
  { id: "1B", row: 1, letter: "B", type: "preferred", price: 35 },
  { id: "1C", row: 1, letter: "C", type: "preferred", price: 35 },
  { id: "1D", row: 1, letter: "D", type: "preferred", price: 35 },
  { id: "2A", row: 2, letter: "A", type: "preferred", price: 30 },
  {
    id: "2B",
    row: 2,
    letter: "B",
    type: "preferred",
    price: 30,
    occupied: true,
  },
  { id: "2C", row: 2, letter: "C", type: "preferred", price: 30 },
  { id: "2D", row: 2, letter: "D", type: "preferred", price: 30 },
  { id: "3A", row: 3, letter: "A", type: "standard", price: 20 },
  { id: "3B", row: 3, letter: "B", type: "standard", price: 20 },
  {
    id: "3C",
    row: 3,
    letter: "C",
    type: "standard",
    price: 20,
    occupied: true,
  },
  { id: "3D", row: 3, letter: "D", type: "standard", price: 20 },
  { id: "4A", row: 4, letter: "A", type: "standard", price: 15 },
  { id: "4B", row: 4, letter: "B", type: "standard", price: 15 },
  { id: "4C", row: 4, letter: "C", type: "standard", price: 15 },
  { id: "4D", row: 4, letter: "D", type: "standard", price: 15 },
  { id: "5A", row: 5, letter: "A", type: "extra", price: 45 },
  { id: "5B", row: 5, letter: "B", type: "extra", price: 45 },
  { id: "5C", row: 5, letter: "C", type: "extra", price: 45 },
  { id: "5D", row: 5, letter: "D", type: "extra", price: 45 },
];

const addOns = [
  {
    id: "baggage",
    title: "Extra baggage",
    description: "Add 20kg additional checked baggage.",
    price: 55,
    icon: Luggage,
  },
  {
    id: "priority",
    title: "Priority boarding",
    description: "Board early and settle in before the crowd.",
    price: 25,
    icon: Sparkles,
  },
  {
    id: "insurance",
    title: "Travel protection",
    description: "Protection for unexpected travel disruptions.",
    price: 39,
    icon: ShieldCheck,
  },
];

function formatAirport(value: string) {
  if (!value) return "LOS";

  const airports: Record<string, string> = {
    LOS: "Lagos",
    LHR: "London",
    DXB: "Dubai",
    JFK: "New York",
    NRT: "Tokyo",
    CDG: "Paris",
    SIN: "Singapore",
    SYD: "Sydney",
    CPT: "Cape Town",
    IST: "Istanbul",
    MLE: "Malé",
    YYZ: "Toronto",
  };

  return airports[value.toUpperCase()] || value.toUpperCase();
}

function normalizeAirportCode(value: string | null, fallback: string) {
  const normalized = value?.trim() ?? "";
  const code = normalized.match(/\(([A-Z]{3})\)$/i)?.[1];
  return (code ?? (normalized || fallback)).toUpperCase();
}

function formatDemoDate(value: string | null) {
  if (!value) return "Date not available";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getBookingClass(value: string): CheckoutCabinClass {
  switch (value.trim().toLowerCase().replace(/[\s-]+/g, "_")) {
    case "premium_economy":
      return "premium_economy";
    case "business":
      return "business";
    case "first":
      return "first";
    default:
      return "economy";
  }
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getPassengerGender(value: string): Passenger["gender"] {
  if (value === "male" || value === "female" || value === "other") {
    return value;
  }
  return "";
}

function BookingContent() {
  const searchParams = useSearchParams();

  const flightId = searchParams.get("flightId") ?? "";
  const fromCode = normalizeAirportCode(searchParams.get("from"), "");
  const toCode = normalizeAirportCode(searchParams.get("to"), "");
  const tripType = searchParams.get("trip") || "One way";
  const cabin = searchParams.get("cabin") || "Economy";
  const bookingClass = getBookingClass(cabin);
  const parsedPassengerCount = Number(
    searchParams.get("passengers") || "1",
  );
  const passengerCount =
    Number.isSafeInteger(parsedPassengerCount) &&
    parsedPassengerCount > 0 &&
    parsedPassengerCount <= 9
      ? parsedPassengerCount
      : 1;

  const [step, setStep] = useState<BookingStep>(1);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [createdBooking, setCreatedBooking] =
    useState<CustomerBookingDetails | null>(null);
  const [paymentResult, setPaymentResult] =
    useState<DemoPaymentWorkflowResult | null>(null);
  const [checkoutFlight, setCheckoutFlight] =
    useState<CheckoutFlight | null>(null);
  const [checkoutAirports, setCheckoutAirports] =
    useState<CheckoutAirport[]>([]);
  const [flightLoading, setFlightLoading] = useState(Boolean(flightId));
  const [flightError, setFlightError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadingTicketId, setDownloadingTicketId] = useState<string | null>(
    null,
  );
  const bookingIdempotencyKey = useRef<string | null>(null);
  const paymentIdempotencyKey = useRef<string | null>(null);

  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    Array.from({ length: passengerCount }, () => ({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
    })),
  );

  const [contact, setContact] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    let active = true;
    if (!flightId) {
      return () => {
        active = false;
      };
    }

    Promise.all([
      flightService.getCheckoutFlightById(flightId),
      airportService.getCheckoutAirports(),
    ])
      .then(([flight, airports]) => {
        if (!active) return;
        setCheckoutFlight(flight);
        setCheckoutAirports(airports);
        setFlightError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setFlightError(
          error instanceof Error
            ? error.message
            : "Unable to load the selected flight.",
        );
      })
      .finally(() => {
        if (active) setFlightLoading(false);
      });

    return () => {
      active = false;
    };
  }, [flightId]);

  const fare = checkoutFlight?.fareSchedule?.[bookingClass];
  const currency = fare?.currency ?? createdBooking?.booking.currency ?? "USD";
  const baseFare = fare ? fare.baseFare * passengerCount : 0;
  const taxes = fare ? fare.taxes * passengerCount : 0;
  const fees = fare ? fare.fees * passengerCount : 0;

  const total =
    createdBooking?.booking.totalAmount ?? baseFare + taxes + fees;

  const flightNumber =
    checkoutFlight?.flightNumber ?? searchParams.get("flightNumber") ?? "—";
  const departureTime = checkoutFlight?.scheduledDeparture
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(checkoutFlight.scheduledDeparture))
    : searchParams.get("departureTime") ?? "—";
  const arrivalTime = checkoutFlight?.scheduledArrival
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(checkoutFlight.scheduledArrival))
    : searchParams.get("arrivalTime") ?? "—";
  const duration = checkoutFlight
    ? `${Math.floor(checkoutFlight.durationMinutes / 60)}h ${checkoutFlight.durationMinutes % 60}m`
    : searchParams.get("duration") ?? "—";
  const departureDate = formatDemoDate(
    checkoutFlight?.scheduledDeparture
      ? new Date(checkoutFlight.scheduledDeparture).toISOString()
      : searchParams.get("departure"),
  );

  const selectedDepartureAirport = checkoutAirports.find(
    (airport) => airport.id === checkoutFlight?.departureAirport,
  );
  const selectedArrivalAirport = checkoutAirports.find(
    (airport) => airport.id === checkoutFlight?.arrivalAirport,
  );
  const selectedFromCode = selectedDepartureAirport?.airportCode ?? fromCode;
  const selectedToCode = selectedArrivalAirport?.airportCode ?? toCode;
  const bookingReference =
    paymentResult?.booking.bookingReference ??
    createdBooking?.booking.bookingReference ??
    "";
  const paymentApproved = paymentResult?.payment.status === "completed";

  const progressWidth = useMemo(() => {
    return `${(step / steps.length) * 100}%`;
  }, [step]);

  function updatePassenger<Field extends keyof Passenger>(
    index: number,
    field: Field,
    value: Passenger[Field],
  ) {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index
          ? { ...passenger, [field]: value }
          : passenger,
      ),
    );
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function nextStep() {
    setValidationError("");

    if (step === 1) {
      const missingPassengerDetails = passengers.some(
        (passenger) =>
          !passenger.firstName.trim() ||
          !passenger.lastName.trim() ||
          !passenger.dateOfBirth ||
          !passenger.nationality.trim(),
      );
      if (missingPassengerDetails) {
        setValidationError(
          "Enter each passenger's name, date of birth, and nationality.",
        );
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
        setValidationError("Enter a valid contact email address to continue.");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!flightId || !checkoutFlight || !fare) {
        setValidationError(
          "The selected flight does not have a bookable fare. Return to flight search and choose another flight.",
        );
        return;
      }

      setBookingLoading(true);
      try {
        bookingIdempotencyKey.current ??= window.crypto.randomUUID();
        const booking = await bookingService.createCustomerBooking({
          flightId,
          bookingClass,
          passengers: passengers.map((passenger, index) => ({
            firstName: passenger.firstName.trim(),
            lastName: passenger.lastName.trim(),
            dateOfBirth: passenger.dateOfBirth,
            nationality: passenger.nationality.trim(),
            ...(passenger.gender ? { gender: passenger.gender } : {}),
            ...(index === 0 && contact.email.trim()
              ? { email: contact.email.trim() }
              : {}),
            ...(index === 0 && contact.phone.trim()
              ? { phoneNumber: contact.phone.trim() }
              : {}),
          })),
          idempotencyKey: bookingIdempotencyKey.current,
        });
        setCreatedBooking(booking);
        setStep(4);
      } catch (error) {
        setValidationError(
          error instanceof Error
            ? error.message
            : "Unable to create the booking. Please try again.",
        );
      } finally {
        setBookingLoading(false);
      }
    }
  }

  async function completeDemoPayment(
    values: {
      outcome: DemoPaymentOutcome;
      paymentMethod: "demo-wallet" | "demo-bank-transfer";
    },
  ) {
    setPaymentError("");
    if (!createdBooking) {
      setPaymentError("Create the booking before submitting demo payment.");
      return;
    }

    setPaymentLoading(true);
    try {
      paymentIdempotencyKey.current ??= window.crypto.randomUUID();
      const result = await paymentService.processDemoBookingPayment(
        createdBooking.booking.id,
        {
          idempotencyKey: paymentIdempotencyKey.current,
          outcome: values.outcome,
          method: values.paymentMethod,
        },
      );
      setPaymentResult(result);
      setStep(5);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to process the demo payment. Retry safely.",
      );
    } finally {
      setPaymentLoading(false);
    }
  }

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
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download the ticket PDF.",
      );
    } finally {
      setDownloadingTicketId(null);
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep((current) => (current - 1) as BookingStep);
    }
  }

  const demoTrackingHref = `/track-flight?flight=${encodeURIComponent(
    flightNumber,
  )}&trackingReference=${encodeURIComponent(
    paymentResult?.trackingReference ??
      createdBooking?.trackingReference ??
      "",
  )}`;

  if (flightLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <p role="status" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading selected flight and backend-configured fare…
        </p>
      </main>
    );
  }

  if (flightError || !checkoutFlight) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <section className="max-w-lg rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-900 dark:bg-slate-900">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Select an available flight
          </h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {flightError ||
              (flightId
                ? "Flight details are unavailable."
                : "Choose a live flight from the flight search page first.")}
          </p>
          <Link
            href="/flights"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
          >
            Return to flight search
          </Link>
        </section>
      </main>
    );
  }

  if (!fare) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <section className="max-w-lg rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-900 dark:bg-slate-900">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Fare unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            SOG Airways has not configured a fare for this flight and cabin.
            No booking or payment can be created.
          </p>
          <Link
            href="/flights"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
          >
            Return to flight search
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Booking Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-300">
              <Globe2 className="h-4 w-4" />
              Your journey starts here
            </div>

            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Complete your booking
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Review your flight and passenger details, then create a backend
              booking and complete the simulated payment.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-amber-200">
              Demo payment only · booking and ticket records are persisted
            </p>
          </motion.div>

          {/* Progress */}
          <div className="mt-10">
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/10" />

              <motion.div
                className="absolute left-0 top-5 h-0.5 bg-sky-400"
                animate={{ width: progressWidth }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative grid grid-cols-5">
                {steps.map((item) => {
                  const active = item.number <= step;

                  return (
                    <div
                      key={item.number}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{
                          scale: item.number === step ? 1.08 : 1,
                        }}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          active
                            ? "border-sky-400 bg-sky-400 text-slate-950"
                            : "border-white/20 bg-slate-900 text-slate-500"
                        }`}
                      >
                        {item.number < step ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          item.number
                        )}
                      </motion.div>

                      <span
                        className={`text-center text-xs font-semibold sm:text-sm ${
                          active ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main Content */}
          <section>
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="passengers"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Flight summary */}
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                            Your flight
                          </p>

                          <h2 className="mt-1 text-xl font-black">
                            {selectedFromCode} → {selectedToCode}
                          </h2>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {flightNumber}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto_1fr] sm:p-6">
                      <div>
                        <p className="text-3xl font-black">{departureTime}</p>

                        <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                          {selectedFromCode}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedDepartureAirport?.city ?? formatAirport(selectedFromCode)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:justify-center">
                        <div className="hidden h-px w-24 bg-slate-200 dark:bg-slate-700 sm:block" />

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                          <Plane className="h-5 w-5" />
                        </div>

                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {duration}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-3xl font-black">{arrivalTime}</p>

                        <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                          {selectedToCode}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedArrivalAirport?.city ?? formatAirport(selectedToCode)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <div className="p-4">
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="mt-1 text-sm font-bold">{departureDate}</p>
                      </div>

                      <div className="border-l border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-xs text-slate-400">Trip</p>
                        <p className="mt-1 text-sm font-bold capitalize">
                          {tripType.replace("-", " ")}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 p-4 sm:border-l sm:border-t-0 dark:border-slate-700">
                        <p className="text-xs text-slate-400">Passengers</p>
                        <p className="mt-1 text-sm font-bold">
                          {passengerCount}
                        </p>
                      </div>

                      <div className="border-l border-t border-slate-200 p-4 sm:border-t-0 dark:border-slate-700">
                        <p className="text-xs text-slate-400">Cabin</p>
                        <p className="mt-1 text-sm font-bold">{cabin}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passenger */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                            <Users className="h-5 w-5" />
                          </div>

                          <div>
                            <h2 className="text-xl font-black">
                              Passenger details
                            </h2>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Enter the details exactly as they appear on the
                              travel document.
                            </p>
                          </div>
                        </div>
                      </div>

                      <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 sm:block dark:bg-slate-800 dark:text-slate-400">
                        {passengerCount} passenger{passengerCount === 1 ? "" : "s"}
                      </span>
                    </div>

                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                      Demo only: use fictional passenger and contact details.
                      Do not enter real travel-document or personal information.
                    </p>

                    {passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                      >
                        <h3 className="mb-4 text-sm font-black">
                          Passenger {index + 1}
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              First name
                            </span>
                            <input
                              required
                              value={passenger.firstName}
                              onChange={(event) =>
                                updatePassenger(index, "firstName", event.target.value)
                              }
                              autoComplete="given-name"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Last name
                            </span>
                            <input
                              required
                              value={passenger.lastName}
                              onChange={(event) =>
                                updatePassenger(index, "lastName", event.target.value)
                              }
                              autoComplete="family-name"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Date of birth
                            </span>
                            <input
                              required
                              type="date"
                              value={passenger.dateOfBirth}
                              onChange={(event) =>
                                updatePassenger(index, "dateOfBirth", event.target.value)
                              }
                              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Gender
                            </span>
                            <div className="relative">
                              <select
                                value={passenger.gender}
                                onChange={(event) =>
                                  updatePassenger(
                                    index,
                                    "gender",
                                    getPassengerGender(event.target.value),
                                  )
                                }
                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
                            </div>
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Nationality
                            </span>
                            <input
                              required
                              value={passenger.nationality}
                              onChange={(event) =>
                                updatePassenger(index, "nationality", event.target.value)
                              }
                              autoComplete="country-name"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-black">Contact information</h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      We&apos;ll send your booking confirmation and travel
                      updates here.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                          Email address
                        </span>

                        <input
                          type="email"
                          value={contact.email}
                          onChange={(event) =>
                            setContact({
                              ...contact,
                              email: event.target.value,
                            })
                          }
                          placeholder="you@example.com"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                          Phone number
                        </span>

                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(event) =>
                            setContact({
                              ...contact,
                              phone: event.target.value,
                            })
                          }
                          placeholder="+234 800 000 0000"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="extras"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                    Seat selection and add-on choices are previews only. They
                    are not saved to the backend booking or included in the
                    backend-configured fare.
                  </p>
                  {/* Seat selection */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                        Make it yours
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        Choose your seat
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Select the seat you&apos;d like for your journey.
                        Prices vary by location.
                      </p>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-5 border-y border-slate-100 py-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-700" />
                        Available
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-sky-500" />
                        Selected
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-slate-300 dark:bg-slate-600" />
                        Occupied
                      </span>
                    </div>

                    <div className="mx-auto mt-8 max-w-md">
                      <div className="mb-6 rounded-t-[3rem] bg-slate-100 px-8 py-5 text-center dark:bg-slate-800">
                        <Plane className="mx-auto h-6 w-6 -rotate-90 text-slate-500 dark:text-slate-400" />

                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                          Front of aircraft
                        </p>
                      </div>

                      <div className="grid grid-cols-[28px_1fr_1fr_1fr_1fr] gap-2 sm:gap-3">
                        <div />

                        {["A", "B", "C", "D"].map((letter) => (
                          <div
                            key={letter}
                            className="text-center text-xs font-bold text-slate-400"
                          >
                            {letter}
                          </div>
                        ))}

                        {seats.map((seat, index) => {
                          const selected = selectedSeat === seat.id;

                          return (
                            <div key={seat.id} className="contents">
                              {index % 4 === 0 && (
                                <div className="flex items-center justify-center text-xs font-bold text-slate-400">
                                  {seat.row}
                                </div>
                              )}

                              <button
                                type="button"
                                disabled={seat.occupied}
                                onClick={() =>
                                  !seat.occupied &&
                                  setSelectedSeat(
                                    selected ? null : seat.id,
                                  )
                                }
                                className={`h-11 rounded-lg text-xs font-bold transition sm:h-12 ${
                                  seat.occupied
                                    ? "cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-500"
                                    : selected
                                      ? "scale-105 bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                                      : "bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-950/50 dark:hover:text-sky-300"
                                }`}
                              >
                                {seat.id}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {selectedSeat && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 rounded-2xl bg-sky-50 p-4 text-center dark:bg-sky-950/40"
                        >
                          <p className="text-sm font-bold text-sky-900 dark:text-sky-200">
                            Seat {selectedSeat} selected
                          </p>

                          <p className="mt-1 text-xs text-sky-700 dark:text-sky-300">
                            Preview only · not included in the booking
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-2xl font-black">Enhance your trip</h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Add optional services to make your journey more
                      comfortable.
                    </p>

                    <div className="mt-6 space-y-3">
                      {addOns.map((addon) => {
                        const Icon = addon.icon;
                        const selected = selectedAddOns.includes(addon.id);

                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleAddOn(addon.id)}
                            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                              selected
                                ? "border-sky-400 bg-sky-50 dark:border-sky-500 dark:bg-sky-950/40"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-sky-500 text-white"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold">{addon.title}</p>

                              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {addon.description}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-500">
                                Preview only
                              </p>

                              <div
                                className={`mt-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-sky-500 bg-sky-500 text-white"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {selected && <Check className="h-3 w-3" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Check className="h-7 w-7" />
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                      Review your booking
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Everything looks good? Review your details before
                      completing your reservation.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black">Passengers</h3>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {passengers.map((passenger, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                        >
                          <p className="text-xs text-slate-400">
                            Passenger {index + 1}
                          </p>
                          <p className="mt-1 font-bold">
                            {passenger.firstName} {passenger.lastName}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {passenger.nationality}
                          </p>
                          {index === 0 && (
                            <>
                              <p className="mt-3 text-xs text-slate-400">
                                Contact email
                              </p>
                              <p className="mt-1 break-all font-bold">
                                {contact.email}
                              </p>
                              {contact.phone && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {contact.phone}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ))}

                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black">Flight & extras</h3>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-sm font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedFromCode} → {selectedToCode}
                        </span>

                        <span className="font-bold">
                          {formatCurrency(baseFare, currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Taxes & fees
                        </span>

                        <span className="font-bold">
                          {formatCurrency(taxes + fees, currency)}
                        </span>
                      </div>

                      {selectedSeat && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Seat {selectedSeat}
                          </span>

                          <span className="font-bold">Not included</span>
                        </div>
                      )}

                      {selectedAddOns.map((id) => {
                        const addon = addOns.find((item) => item.id === id);

                        if (!addon) return null;

                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {addon.title}
                            </span>

                            <span className="font-bold">Not included</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                    <div className="flex gap-3">
                      <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                      <p className="text-sm leading-6 text-amber-900 dark:text-amber-200">
                        Your booking will be saved by SOG Airways before the
                        demo payment screen. Seat and add-on previews are not
                        part of this backend booking.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div
                  key="demo-payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7 dark:border-amber-900/60 dark:bg-amber-950/30">
                    <h2 className="text-2xl font-black text-amber-950 dark:text-amber-100">
                      Demo payment simulation
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-200">
                      Booking {createdBooking?.booking.bookingReference} is
                      awaiting payment. The selected outcome is sent to the
                      backend as a DEMO transaction. No payment provider is
                      contacted and no money moves. Tickets are issued only
                      after backend approval.
                    </p>
                  </div>

                  <PaymentForm
                    onSubmit={({ outcome, paymentMethod }) =>
                      completeDemoPayment({ outcome, paymentMethod })
                    }
                    loading={paymentLoading}
                    error={paymentError}
                  />
                </motion.div>
              )}

              {/* STEP 5 */}
              {step === 5 && paymentResult && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-colors duration-300 sm:p-12 dark:border-slate-800 dark:bg-slate-900"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.15,
                      type: "spring",
                      stiffness: 180,
                    }}
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                      paymentApproved
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                    }`}
                  >
                    {paymentApproved ? (
                      <Check className="h-10 w-10" />
                    ) : (
                      <CircleHelp className="h-10 w-10" />
                    )}
                  </motion.div>

                  <p className={`mt-7 text-xs font-bold uppercase tracking-[0.2em] ${
                    paymentApproved
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {paymentApproved
                      ? "Backend demo payment approved"
                      : "Backend demo payment declined"}
                  </p>

                  <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                    {paymentApproved
                      ? "Your demo ticket is ready"
                      : "No ticket was issued"}
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                    The booking and payment outcome were returned by the
                    backend. Any ticket shown below is a DEMO document only
                    and is not valid for travel.
                  </p>

                  <div className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Booking reference
                      </p>
                      <p className="mt-2 break-all text-lg font-black">
                        {bookingReference}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Flight tracking reference
                      </p>
                      <p className="mt-2 break-all text-lg font-black">
                        {paymentResult.trackingReference}
                      </p>
                    </div>
                  </div>

                  <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                    DEMO payment reference: {paymentResult.payment.paymentReference}
                  </p>

                  {paymentResult.tickets.length > 0 ? (
                    <div className="mx-auto mt-8 max-w-2xl space-y-3 text-left">
                      {paymentResult.tickets.map((ticket) => {
                        const passenger = createdBooking?.passengers.find(
                          (item) => item.id === ticket.passenger,
                        );
                        return (
                          <div
                            key={ticket.id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
                          >
                            <div>
                              <p className="font-bold">
                                {passenger
                                  ? `${passenger.firstName} ${passenger.lastName}`
                                  : "Passenger ticket"}
                              </p>
                              <p className="mt-1 break-all text-sm text-slate-500">
                                Ticket {ticket.ticketNumber} · {flightNumber}
                              </p>
                              <p className="mt-1 text-xs font-bold uppercase text-amber-700 dark:text-amber-300">
                                DEMO TICKET · NOT VALID FOR TRAVEL
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={downloadingTicketId === ticket.id}
                              onClick={() =>
                                downloadTicket(ticket.id, ticket.ticketNumber)
                              }
                              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"
                            >
                              {downloadingTicketId === ticket.id
                                ? "Preparing PDF…"
                                : "Download ticket PDF"}
                            </button>
                          </div>
                        );
                      })}
                      {downloadError && (
                        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                          {downloadError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                      The payment was not approved. The booking is not ticketed
                      and no ticket PDF is available.
                    </p>
                  )}

                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    {paymentApproved && (
                    <Link
                      href={demoTrackingHref}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Track flight
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    )}

                    <Link
                      href="/users/bookings"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      View my bookings
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Return home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom navigation */}
            {step < 5 && (
              <div className="mt-6">
                {(validationError || paymentError) && (
                  <p
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                  >
                    {validationError || paymentError}
                  </p>
                )}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 1 || bookingLoading || paymentLoading}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition ${
                    step === 1
                      ? "cursor-not-allowed text-slate-300 dark:text-slate-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={bookingLoading}
                    className="group inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    {bookingLoading
                      ? "Creating booking…"
                      : step === 3
                        ? "Create booking & continue to demo payment"
                        : "Continue"}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                </div>
              </div>
            )}
          </section>

          {/* Price Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  Your trip
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-black">
                      {selectedFromCode} → {selectedToCode}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {flightNumber} · {cabin}
                    </p>
                  </div>

                  <Plane className="h-6 w-6 text-sky-300" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-black">
                  {createdBooking ? "Backend booking total" : "Backend fare estimate"}
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Base fare
                    </span>

                    <span className="font-bold">
                      {formatCurrency(baseFare, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Taxes & fees
                    </span>

                    <span className="font-bold">
                      {formatCurrency(taxes + fees, currency)}
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-dashed border-slate-200 dark:border-slate-700" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Total · {createdBooking ? "backend calculated" : "estimate"}
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      {formatCurrency(total, currency)}
                    </p>
                  </div>

                  <span className="mb-1 text-xs font-semibold text-slate-400">
                    {currency}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <p className="text-xs leading-5 text-emerald-800 dark:text-emerald-200">
                      Final fare is calculated by the backend when the booking
                      is created. Payment remains DEMO ONLY.
                    </p>
                  </div>

                  <div className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                    <ShoppingBag className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />

                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                      Baggage allowance is not configured in the booking API.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-3">
                <CircleHelp className="h-5 w-5 shrink-0 text-slate-400" />

                <div>
                  <p className="text-sm font-bold">Need help?</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Our support team can help with your booking.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-3 inline-flex text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Contact support
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950" />
      }
    >
      <BookingContent />
    </Suspense>
  );
}