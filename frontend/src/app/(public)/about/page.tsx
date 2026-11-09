"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Globe2,
  HeartHandshake,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Globe2,
    title: "Connected to the world",
    description:
      "We bring cities, cultures, families, and opportunities closer together through air travel.",
  },
  {
    icon: HeartHandshake,
    title: "People first",
    description:
      "Every journey is designed around the people who trust us to take them where they need to go.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & trust",
    description:
      "We believe confidence is part of every great journey, from booking to arrival.",
  },
  {
    icon: Sparkles,
    title: "Better journeys",
    description:
      "We continuously look for thoughtful ways to make flying simpler, smoother, and more enjoyable.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "The journey begins",
    description:
      "SOG Airways begins with a simple idea: make international travel feel more connected and accessible.",
  },
  {
    year: "2023",
    title: "Growing connections",
    description:
      "Our vision expands toward connecting travelers with more cities and destinations around the world.",
  },
  {
    year: "2025",
    title: "A global vision",
    description:
      "SOG Airways evolves into a modern travel platform built around discovery, convenience, and service.",
  },
  {
    year: "2026",
    title: "The next chapter",
    description:
      "We continue building a world-class digital travel experience for the journeys ahead.",
  },
];

const stats = [
  { value: "40+", label: "Destinations" },
  { value: "24/7", label: "Customer support" },
  { value: "1M+", label: "Travelers" },
  { value: "98%", label: "Customer satisfaction" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* HERO */}
      <section className="relative min-h-175 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85"
          alt="Airplane flying above the clouds"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/65 to-slate-950" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-transparent to-blue-950/30" />

        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 4, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[7%] top-44 hidden h-44 w-44 rounded-full border border-white/10 lg:block"
        />

        <div className="relative mx-auto flex min-h-175 max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
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
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200 backdrop-blur-md">
                <Globe2 className="h-4 w-4" />
                About SOG Airways
              </span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-7 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              We connect people
              <span className="block text-sky-300">
                with the world.
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
            >
              SOG Airways is built around a simple belief: traveling should
              open doors to new places, new experiences, and the people who
              matter most.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/flights"
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-white px-7 text-sm font-black text-slate-950 shadow-2xl transition hover:-translate-y-1 hover:bg-slate-100"
              >
                Start your journey
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
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 text-center sm:p-6"
              >
                <p className="text-2xl font-black text-white sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="relative overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-28">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky-100 blur-3xl dark:bg-sky-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative overflow-hidden rounded-4xl">
                <Image
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85"
                  alt="Travelers exploring a new destination"
                  width={1200}
                  height={900}
                  className="h-105 w-full object-cover transition duration-700 hover:scale-105 sm:h-130"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-sky-200">
                    Our philosophy
                  </p>

                  <p className="mt-2 text-lg font-black">
                    Every journey has a story worth discovering.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Our story
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Built for travelers with somewhere to go.
              </h2>

              <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                SOG Airways was created with a modern traveler in mind. We
                believe booking a flight should be simple, transparent, and
                enjoyable from the first search to the final arrival.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Our vision goes beyond moving people between airports. We want
                to help people discover new cultures, reconnect with loved
                ones, explore opportunities, and create memories around the
                world.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-sky-400">
                    <Users className="h-5 w-5" />
                  </div>

                  <p className="mt-4 font-black">People powered</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Designed around the needs of real travelers.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-sky-400">
                    <Award className="h-5 w-5" />
                  </div>

                  <p className="mt-4 font-black">Service focused</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Every detail matters throughout your journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative overflow-hidden bg-slate-950 py-18 sm:py-22 lg:py-28">
        <div className="absolute inset-0 bg-linear-to-br from-sky-950 via-slate-950 to-indigo-950" />

        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-white/5"
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-sky-300 backdrop-blur-md">
              <Sparkles className="h-7 w-7" />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-sky-300">
              Our mission
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Make the world feel a little closer.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              We are building an airline experience where technology,
              thoughtful service, and a passion for travel come together to
              make every journey feel easier and more meaningful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="relative overflow-hidden bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-900 sm:py-20 lg:py-24">
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-sky-100 blur-3xl dark:bg-sky-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              What guides us
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Our values
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              The principles behind the way we build our service and the
              experiences we create for travelers.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-allhover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-black">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Our journey
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              From an idea to a global vision
            </h2>
          </div>

          <div className="relative mt-14">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200 dark:bg-slate-800 sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -30 : 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`relative grid gap-6 sm:grid-cols-2 sm:gap-12 ${
                    index % 2 === 0
                      ? ""
                      : "sm:[&>div:first-child]:order-2"
                  }`}
                >
                  <div
                    className={`pl-14 sm:pl-0 ${
                      index % 2 === 0
                        ? "sm:text-right"
                        : "sm:text-left"
                    }`}
                  >
                    <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                      {milestone.year}
                    </span>

                    <h3 className="mt-2 text-xl font-black">
                      {milestone.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="hidden sm:block" />

                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-sky-500 text-white shadow-lg dark:border-slate-950">
                    <Globe2 className="h-4 w-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="relative overflow-hidden bg-slate-100 py-16 transition-colors duration-300 dark:bg-slate-900 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-white to-indigo-50 dark:from-sky-950/30 dark:via-slate-900 dark:to-indigo-950/30" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid items-center gap-8 rounded-4xl border border-slate-200 bg-white p-7 shadow-xl transition-colors dark:border-slate-800 dark:bg-slate-950 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400">
                <Headphones className="h-4 w-4" />
                We&apos;re here for you
              </div>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Have questions about SOG Airways?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Whether you need help with a booking, travel information, or
                something else, our support team is ready to help.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/contact"
                className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:w-auto"
              >
                Contact our team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-sky-950" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
              <Globe2 className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your world is waiting.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Find your next destination and let SOG Airways be part of the
              journey.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/flights"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Find a flight
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
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