"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Hand,
  Info,
  Luggage,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

const baggageCategories = [
  {
    title: "Carry-on baggage",
    description:
      "Keep your essentials close during the flight with our convenient cabin baggage allowance.",
    icon: ShoppingBag,
    weight: "Up to 7 kg",
    size: "55 × 40 × 20 cm",
    details: [
      "One cabin bag per passenger",
      "Must fit safely in the overhead compartment",
      "Personal item may be placed under the seat",
      "Keep important documents and valuables with you",
    ],
  },
  {
    title: "Checked baggage",
    description:
      "Pack more for your journey and check your larger bags before boarding your flight.",
    icon: Luggage,
    weight: "Up to 23 kg",
    size: "158 cm total",
    details: [
      "Standard allowance depends on your fare",
      "Individual bags should stay within the permitted weight",
      "Use sturdy luggage with secure locks",
      "Attach your baggage tag before handing it over",
    ],
  },
];

const baggageTips = [
  {
    icon: ShieldCheck,
    title: "Protect your valuables",
    description:
      "Keep passports, cash, electronics, medication and important documents in your cabin baggage.",
  },
  {
    icon: Scale,
    title: "Check your weight",
    description:
      "Weigh your bags before leaving home so you can avoid surprises at the airport.",
  },
  {
    icon: Sparkles,
    title: "Pack smart",
    description:
      "Leave room for essentials and organize your belongings so they are easy to access.",
  },
];

const restrictedItems = [
  "Explosives and fireworks",
  "Flammable materials",
  "Certain chemicals and hazardous substances",
  "Items that may pose a safety risk",
  "Damaged or unsafe batteries",
  "Other items restricted by applicable aviation regulations",
];

export default function BaggagePage() {
  const [activeTab, setActiveTab] = useState<"carry-on" | "checked">(
    "carry-on",
  );
  const [search, setSearch] = useState("");

  const activeCategory =
    activeTab === "carry-on" ? baggageCategories[0] : baggageCategories[1];

  const filteredRestrictedItems = restrictedItems.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-190 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=90"
          alt="Airplane flying above the clouds"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/35 to-slate-950/80" />

        <div className="relative mx-auto flex min-h-190 max-w-7xl items-center px-6 pb-20 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <Luggage size={16} />
              Baggage information
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Pack with confidence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl"
            >
              Know what you can bring, how much you can pack, and how to
              prepare your bags before your SOG Airways journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/manage-booking"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Manage your booking
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Baggage FAQs
                <CircleHelp size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="relative z-10 -mt-16 px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              icon: ShoppingBag,
              title: "Cabin bag",
              value: "Up to 7 kg",
              text: "Keep your essentials with you.",
            },
            {
              icon: Luggage,
              title: "Checked bag",
              value: "Up to 23 kg",
              text: "For your larger travel items.",
            },
            {
              icon: Scale,
              title: "Size guide",
              value: "158 cm",
              text: "Checked bag total dimensions.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 transition-colors dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Icon size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xl font-bold">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Baggage Allowance */}
      <section className="px-6 py-24 transition-colors duration-300 dark:bg-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Baggage allowance
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Choose the right bag for your journey.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Your baggage allowance can vary depending on your fare,
              destination and booking. Use these guidelines as a simple
              starting point before your trip.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {baggageCategories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      <Icon size={26} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {category.weight}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {category.description}
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Weight
                      </p>
                      <p className="mt-1 font-bold">{category.weight}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Maximum size
                      </p>
                      <p className="mt-1 font-bold">{category.size}</p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-3">
                    {category.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                          <Check size={12} />
                        </div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Baggage Guide */}
      <section className="bg-white px-6 py-24 transition-colors duration-300 dark:bg-slate-900 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Baggage guide
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              What are you taking with you?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Select a baggage type to see the key information at a glance.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-full bg-slate-100 p-1.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("carry-on")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeTab === "carry-on"
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                Carry-on
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("checked")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeTab === "checked"
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                Checked baggage
              </button>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-10 rounded-4xl bg-slate-950 p-8 text-white sm:p-10"
          >
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <activeCategory.icon size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-white/60">Selected baggage</p>
                    <h3 className="text-2xl font-bold">
                      {activeCategory.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-white/50">Weight</p>
                    <p className="mt-1 text-2xl font-bold">
                      {activeCategory.weight}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-white/50">Dimensions</p>
                    <p className="mt-1 text-2xl font-bold">
                      {activeCategory.size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Luggage size={56} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packing Tips */}
      <section className="px-6 py-24 transition-colors duration-300 dark:bg-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Before you fly
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                A little preparation goes a long way.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Make your airport experience easier by checking your baggage
                before you leave home.
              </p>

              <Link
                href="/check-in"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Check in online
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4">
              {baggageTips.map((tip, index) => {
                const Icon = tip.icon;

                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">{tip.title}</h3>
                      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Restricted Items */}
      <section className="bg-slate-950 px-6 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Info size={26} />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-white/50">
                Safety first
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Know what you can bring.
              </h2>

              <p className="mt-5 leading-8 text-white/65">
                Aviation safety regulations restrict certain items from
                passenger baggage. Always check the rules that apply to your
                itinerary before packing.
              </p>

              <Link
                href="/travel-information"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Travel information
                <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  size={19}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search restricted items..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-white outline-none placeholder:text-white/35 focus:border-white/30"
                />
              </div>

              <div className="mt-5 space-y-3">
                {filteredRestrictedItems.length > 0 ? (
                  filteredRestrictedItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <X size={15} />
                      </div>

                      <span className="text-sm text-white/75">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    No matching item found. Please check the official
                    regulations for your itinerary.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Assistance */}
      <section className="px-6 py-24 transition-colors duration-300 dark:bg-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Hand size={25} />
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                  Traveling with special baggage?
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Sports equipment, mobility aids, musical instruments and
                  other special items may have different handling requirements.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Contact support
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white lg:px-8">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">
            Ready for takeoff?
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Your journey starts with the right preparation.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Check your baggage, complete your check-in and get ready to explore
            the world with SOG Airways.
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
              href="/check-in"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Check-in online
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}