"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  FileText,
  Luggage,
  Plane,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

const checkInSteps = [
  {
    number: "01",
    icon: FileText,
    title: "Have your booking ready",
    description:
      "Keep your booking reference and passenger surname available before starting check-in.",
  },
  {
    number: "02",
    icon: UserRound,
    title: "Confirm your details",
    description:
      "Review your passenger information and make sure your travel details are correct.",
  },
  {
    number: "03",
    icon: Smartphone,
    title: "Get your boarding pass",
    description:
      "Complete the check-in process and keep your boarding pass ready on your device.",
  },
];

const requirements = [
  "Your SOG Airways booking reference",
  "Passenger surname exactly as shown on the booking",
  "Valid travel documents for your destination",
  "Any required visa or entry documents",
];

export default function CheckInPage() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const reference = bookingReference.trim().toUpperCase();
    const surname = lastName.trim();

    if (!reference || !surname) {
      setSubmitted(false);
      setMessage("Please enter your booking reference and last name.");
      return;
    }

    if (reference.length < 5) {
      setSubmitted(false);
      setMessage("Please enter a valid booking reference.");
      return;
    }

    setSubmitted(true);
    setMessage(
      "Demo only: the form was validated locally. No details were sent or saved, and no operational check-in was performed.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-190 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2200&q=90"
          alt="Airplane at an airport"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/40 to-slate-950/85" />

        <div className="relative mx-auto flex min-h-190 max-w-7xl items-center px-6 pb-28 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <Check size={16} />
              Online check-in
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Preview the check-in flow.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl"
            >
              This demo shows the check-in interface only. It cannot check
              you in or create a valid boarding pass.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#check-in-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start check-in
                <ArrowRight size={18} />
              </a>

              <Link
                href="/manage-booking"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Manage booking
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Check-in Form */}
      <section
        id="check-in-form"
        className="relative z-10 -mt-20 px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 sm:p-10"
          >
            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                <Search size={22} />
              </div>

              <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Find your trip
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start your online check-in
              </h2>

              <p className="max-w-2xl text-slate-500 dark:text-slate-400">
                Enter the details from your booking to begin.
              </p>
              <p
                role="note"
                className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
              >
                Demo only: use fictional details. Nothing is sent or saved,
                and this preview does not check in an operational booking.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="bookingReference"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Booking reference
                </label>

                <input
                  id="bookingReference"
                  type="text"
                  value={bookingReference}
                  onChange={(event) =>
                    setBookingReference(event.target.value.toUpperCase())
                  }
                  placeholder="e.g. SOG8K4"
                  maxLength={12}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-500 dark:focus:bg-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Passenger last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Enter your last name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-500 dark:focus:bg-slate-950"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                >
                  Find my booking
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                  submitted
                    ? "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                }`}
              >
                {message}
              </motion.div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <ShieldCheck className="mt-0.5 shrink-0" size={18} />

              <p>
                Your booking information should match the details on your
                travel documents.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timing */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-4xl bg-slate-950 p-8 text-white dark:bg-slate-900 dark:ring-1 dark:ring-slate-800 lg:col-span-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Clock3 size={24} />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-white/45">
                Timing
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Give yourself enough time.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-white/65">
                Check-in and airport processing times can vary depending on
                your route, airport and travel requirements. Always allow
                enough time for baggage drop, security and boarding.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/45">Before leaving home</p>

                  <p className="mt-2 font-semibold">
                    Complete your online check-in
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/45">At the airport</p>

                  <p className="mt-2 font-semibold">
                    Allow time for bags and security
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Luggage size={23} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">Checking a bag?</h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                Online check-in does not replace the need to drop off checked
                baggage at the airport.
              </p>

              <Link
                href="/baggage"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-slate-950 transition hover:gap-3 dark:text-white"
              >
                View baggage information
                <ArrowRight size={17} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-6 py-24 dark:bg-slate-900 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Simple process
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Check in in three simple steps.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Prepare your trip before you arrive at the airport.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {checkInSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-4xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                      <Icon size={22} />
                    </div>

                    <span className="text-sm font-bold text-slate-300 dark:text-slate-700">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold">{step.title}</h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Before you check in
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Have these things ready.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
                A few minutes of preparation can make your airport experience
                much smoother.
              </p>

              <Link
                href="/travel-information"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Travel information
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={requirement}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                    <Check size={16} />
                  </div>

                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {requirement}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manage Booking CTA */}
      <section className="bg-slate-100 px-6 py-24 dark:bg-slate-900/70 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-4xl bg-white p-8 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-950 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                  <Plane size={25} />
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                  Need to change something first?
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                  Review your itinerary, passenger information and booking
                  details before checking in.
                </p>
              </div>

              <Link
                href="/manage-booking"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Manage my booking
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="bg-slate-950 px-6 py-24 text-white dark:bg-black lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <CircleHelp size={26} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-white/45">
            Need help?
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            We&apos;re here to help you get ready.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Find answers to common travel questions or contact the SOG Airways
            support team.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Visit FAQ
              <CircleHelp size={18} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Contact support
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white dark:bg-slate-950 lg:px-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/45">
            Your journey awaits
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Ready for your next destination?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Find your flight, explore destinations and start planning your
            journey with SOG Airways.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/flights"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Find a flight
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Explore destinations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}