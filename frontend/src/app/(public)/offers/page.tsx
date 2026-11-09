"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Globe2,
  Headphones,
  Luggage,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

const offers = [
  {
    id: 1,
    from: "LOS",
    fromCity: "Lagos",
    to: "LHR",
    toCity: "London",
    region: "Europe",
    price: 685,
    oldPrice: 920,
    discount: "26% OFF",
    duration: "6h 55m",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    color: "from-sky-500 to-blue-700",
  },
  {
    id: 2,
    from: "LOS",
    fromCity: "Lagos",
    to: "DXB",
    toCity: "Dubai",
    region: "Middle East",
    price: 545,
    oldPrice: 720,
    discount: "24% OFF",
    duration: "7h 35m",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: 3,
    from: "LOS",
    fromCity: "Lagos",
    to: "JFK",
    toCity: "New York",
    region: "North America",
    price: 790,
    oldPrice: 1040,
    discount: "24% OFF",
    duration: "11h 20m",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80",
    color: "from-indigo-500 to-purple-700",
  },
  {
    id: 4,
    from: "LOS",
    fromCity: "Lagos",
    to: "NRT",
    toCity: "Tokyo",
    region: "Asia",
    price: 980,
    oldPrice: 1280,
    discount: "23% OFF",
    duration: "16h 40m",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    color: "from-pink-500 to-rose-700",
  },
  {
    id: 5,
    from: "LOS",
    fromCity: "Lagos",
    to: "CDG",
    toCity: "Paris",
    region: "Europe",
    price: 650,
    oldPrice: 850,
    discount: "24% OFF",
    duration: "6h 40m",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    color: "from-violet-500 to-indigo-700",
  },
  {
    id: 6,
    from: "LOS",
    fromCity: "Lagos",
    to: "CPT",
    toCity: "Cape Town",
    region: "Africa",
    price: 390,
    oldPrice: 510,
    discount: "24% OFF",
    duration: "5h 10m",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
    color: "from-emerald-500 to-teal-700",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure booking",
    description:
      "Your journey details are protected from booking to boarding.",
  },
  {
    icon: Luggage,
    title: "Flexible baggage",
    description:
      "Choose baggage options that fit the way you travel.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    description:
      "Our support team is ready whenever your journey needs us.",
  },
  {
    icon: Sparkles,
    title: "Travel in comfort",
    description:
      "Enjoy thoughtful services designed around your journey.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function OffersPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* HERO */}
      <section className="relative min-h-170 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85"
          alt="Airplane flying above clouds"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-slate-950/85 via-slate-950/60 to-slate-950/95" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-transparent to-blue-950/40" />

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute right-[8%] top-40 hidden h-40 w-40 rounded-full border border-white/10 lg:block"
        />

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-24 left-[5%] hidden h-28 w-28 rounded-full border border-white/10 lg:block"
        />

        <div className="relative mx-auto flex min-h-170 max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200 backdrop-blur-md">
                <Tag className="h-4 w-4" />
                Special offers
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              More destinations.
              <span className="block text-sky-300">Better fares.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
            >
              Discover limited-time fares and special travel offers from SOG
              Airways. Your next adventure could be closer than you think.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/flights"
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-white px-7 text-sm font-black text-slate-950 shadow-2xl transition hover:-translate-y-1 hover:bg-slate-100"
              >
                Search all flights
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <Globe2 className="h-4 w-4" />
                Explore destinations
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* HERO STATS */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            <div className="p-4 text-center sm:p-5">
              <p className="text-xl font-black text-white">40+</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Destinations
              </p>
            </div>

            <div className="p-4 text-center sm:p-5">
              <p className="text-xl font-black text-white">24/7</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Support
              </p>
            </div>

            <div className="border-t border-white/10 p-4 text-center sm:border-t-0 sm:p-5">
              <p className="text-xl font-black text-white">1M+</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Travelers
              </p>
            </div>

            <div className="border-t border-white/10 p-4 text-center sm:border-t-0 sm:p-5">
              <p className="text-xl font-black text-white">98%</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="relative overflow-hidden bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-sky-100 blur-3xl dark:bg-sky-950/30" />
        <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-indigo-100 blur-3xl dark:bg-indigo-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Fly for less
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Current flight deals
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Save on selected routes and turn your travel plans into
                unforgettable journeys.
              </p>
            </div>

            <Link
              href="/flights"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            >
              View all flights
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -7 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={`${offer.toCity} travel offer`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div
                    className={`absolute inset-0 bg-linear-to-t ${offer.color} opacity-30`}
                  />

                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-900 shadow-lg">
                      <Tag className="h-3.5 w-3.5" />
                      {offer.discount}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-xs font-semibold text-white/70">
                          From
                        </p>

                        <p className="text-2xl font-black">
                          {offer.from} → {offer.to}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/15 px-3 py-2 text-right backdrop-blur-md">
                        <p className="text-[10px] font-semibold text-white/70">
                          From
                        </p>

                        <p className="text-lg font-black">
                          ${offer.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black">
                        {offer.fromCity} → {offer.toCity}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {offer.region}

                        <span className="text-slate-300 dark:text-slate-700">
                          •
                        </span>

                        <Clock3 className="h-3.5 w-3.5" />
                        {offer.duration}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-slate-400">Was</p>

                      <p className="text-sm font-bold text-slate-400 line-through">
                        ${offer.oldPrice}
                      </p>
                    </div>

                    <Link
                      href={`/booking?from=${offer.from}&to=${offer.to}&trip=round-trip&passengers=1&cabin=Economy`}
                      className="group/btn inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-400"
                    >
                      Book this fare
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-sky-950 via-slate-950 to-indigo-950" />

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -right-20 top-10 h-80 w-80 rounded-full border border-white/5"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-sky-300">
                <Sparkles className="h-4 w-4" />
                SOG Weekend Escape
              </div>

              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your next adventure deserves a better fare.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Discover selected weekend routes and turn a few days away
                into a memory you&apos;ll keep forever.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Check className="h-3.5 w-3.5 text-sky-300" />
                  Selected routes
                </span>

                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Check className="h-3.5 w-3.5 text-sky-300" />
                  Flexible options
                </span>

                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Check className="h-3.5 w-3.5 text-sky-300" />
                  Limited availability
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                  <CalendarDays className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Start exploring
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    Find your next flight
                  </p>
                </div>
              </div>

              <Link
                href="/flights"
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Search flights
                <Search className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-slate-900 sm:py-20 lg:py-24">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-50 blur-3xl dark:bg-sky-950/20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Why SOG Airways
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              More than just a flight
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              We want every part of your journey to feel simple, comfortable,
              and connected.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-black">{benefit.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-white to-indigo-50 dark:from-sky-950/30 dark:via-slate-950 dark:to-indigo-950/30" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl dark:bg-white dark:text-slate-950">
              <Globe2 className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Where will you go next?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Browse our destinations, find a fare that works for you, and
              start planning your next journey.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/flights"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Find a flight
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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