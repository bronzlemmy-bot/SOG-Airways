import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BaggageClaim,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Globe2,
  HeartPulse,
  Info,
  Landmark,
  MapPin,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";

const travelSections = [
  {
    icon: FileCheck2,
    title: "Travel documents",
    description:
      "Make sure your passport, visa, and other required travel documents are ready before departure.",
    href: "#documents",
  },
  {
    icon: Globe2,
    title: "Destination requirements",
    description:
      "Check the entry requirements and travel information that apply to your destination.",
    href: "#destination",
  },
  {
    icon: BaggageClaim,
    title: "Baggage",
    description:
      "Review baggage allowances, size limits, restricted items, and packing guidance.",
    href: "/baggage",
  },
  {
    icon: TicketCheck,
    title: "Check-in",
    description:
      "Complete your check-in and prepare your boarding information before heading to the airport.",
    href: "/check-in",
  },
];

const preparationSteps = [
  {
    number: "01",
    title: "Check your booking",
    description:
      "Confirm your destination, travel date, passenger information, and flight details.",
    href: "/manage-booking",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Prepare your documents",
    description:
      "Make sure you have the documents required for your destination and journey.",
    href: "#documents",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Review baggage",
    description:
      "Check your baggage allowance and make sure your luggage meets the applicable requirements.",
    href: "/baggage",
    icon: BaggageClaim,
  },
  {
    number: "04",
    title: "Check in",
    description:
      "Complete online check-in when available and allow enough time for airport procedures.",
    href: "/check-in",
    icon: TicketCheck,
  },
];

export default function TravelInformationPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-190 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90"
          alt="Travel destination with mountains and clouds"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90" />

        <div className="relative mx-auto flex min-h-190 max-w-7xl items-center px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Globe2 className="h-4 w-4 text-sky-300" />
              Travel information
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              Everything you need before you travel.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Prepare for your journey with useful information about travel
              documents, destination requirements, baggage, airport
              preparation, and check-in.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#documents"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
              >
                Start preparing
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Explore destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Plan ahead
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Start with the essentials.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              Use these quick links to find the information you need before
              your journey.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {travelSections.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-900 dark:hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600 dark:text-slate-600 dark:group-hover:text-sky-400" />
                  </div>

                  <h3 className="mt-6 font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section
        id="documents"
        className="scroll-mt-8 bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Before departure
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Get your travel documents ready.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                Requirements can vary depending on your nationality,
                destination, transit points, and purpose of travel. Make sure
                you verify the current requirements that apply to your journey.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Valid passport or accepted travel document.",
                  "Visa or entry authorization when required.",
                  "Flight booking and travel confirmation.",
                  "Any destination-specific health or entry documents.",
                  "Additional documents required for transit or connecting flights.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-7 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                <FileCheck2 className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
                Important reminder
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                SOG Airways travel information is intended to help you prepare.
                Entry and visa requirements can change, so travelers should
                confirm the latest requirements with the relevant official
                government, embassy, consulate, or border authority before
                traveling.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
                  Make sure your documents remain valid for the entire period
                  required by your destination.
                </p>
              </div>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Need assistance?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destination */}
      <section
        id="destination"
        className="scroll-mt-8 bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="relative overflow-hidden rounded-4xl">
              <Image
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=85"
                alt="Beautiful international travel destination"
                width={1400}
                height={1000}
                className="h-105 w-full object-cover sm:h-125"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                  <MapPin className="h-4 w-4" />
                  Around the world
                </div>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  Explore your destination before you fly.
                </h3>
              </div>
            </div>

            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Destination information
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Know what to expect when you arrive.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                Every destination is different. Before traveling, review the
                requirements and practical information that may affect your
                journey.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Landmark,
                    title: "Entry requirements",
                    text: "Review the applicable visa and entry requirements.",
                  },
                  {
                    icon: HeartPulse,
                    title: "Health information",
                    text: "Check whether health documents or precautions may apply.",
                  },
                  {
                    icon: Globe2,
                    title: "Local information",
                    text: "Learn about the destination and important travel considerations.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-950 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/destinations"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Explore destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Airport preparation */}
      <section className="bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Airport preparation
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Give yourself time for every step.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Airport procedures can take time. Plan ahead for check-in,
              baggage, security, immigration, and boarding.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock3,
                title: "Arrive early",
                text: "Allow sufficient time for airport and security procedures.",
              },
              {
                icon: TicketCheck,
                title: "Check in",
                text: "Complete check-in and have your boarding information ready.",
              },
              {
                icon: BaggageClaim,
                title: "Drop your bags",
                text: "Allow enough time for baggage drop when you have checked luggage.",
              },
              {
                icon: ShieldCheck,
                title: "Pass security",
                text: "Follow airport security requirements and instructions.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preparation steps */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Your travel checklist
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Prepare your journey step by step.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                A little preparation can make your airport experience much
                easier. Work through the checklist before departure.
              </p>

              <Link
                href="/manage-booking"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Manage your booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {preparationSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.number}
                    href={item.href}
                    className="group flex gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-sky-200 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-900 dark:hover:bg-slate-900 sm:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                      {item.number}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-sky-600 dark:text-sky-400" />

                            <h3 className="font-bold text-slate-950 dark:text-white">
                              {item.title}
                            </h3>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600 dark:text-slate-600 dark:group-hover:text-sky-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important links */}
      <section className="bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl bg-slate-950 p-7 text-white dark:bg-slate-900 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
                  <BadgeCheck className="h-4 w-4 text-sky-300" />
                  Ready when you are
                </div>

                <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                  Your next adventure is waiting.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Search flights, manage an existing booking, or get answers
                  to your travel questions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/flights"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
                >
                  Search flights
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Travel FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}