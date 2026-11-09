import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Globe2,
  Luggage,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { TestimonialsSection } from "@/features/testimonials";

const destinations = [
  {
    city: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
    price: "$489",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    price: "$399",
  },
  {
    city: "New York",
    country: "United States",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80",
    price: "$599",
  },
  {
    city: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    price: "$729",
  },
];

const offers = [
  {
    title: "Explore Europe",
    description:
      "Discover iconic cities, rich history, and unforgettable experiences.",
    discount: "Up to 25% OFF",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Discover Asia",
    description:
      "Experience vibrant cultures, incredible food, and beautiful landscapes.",
    discount: "From $399",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative min-h-190 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85"
          alt="SOG Airways aircraft flying above the clouds"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-950/55" />

        <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-slate-950/20 to-slate-950/70" />

        <div className="relative mx-auto flex min-h-190 max-w-7xl flex-col justify-center px-6 pb-20 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              <Globe2 className="h-4 w-4" />
              Connecting you to the world
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your journey begins
              <span className="block text-sky-300">with SOG Airways.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Discover the world with comfortable flights, seamless booking,
              and unforgettable experiences from takeoff to touchdown.
            </p>
          </div>

          {/* Flight Search */}
          <div className="mt-12 w-full max-w-6xl rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center gap-6 border-b border-slate-200 pb-5 dark:border-slate-700">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <input
                  type="radio"
                  name="trip"
                  defaultChecked
                  className="h-4 w-4 accent-sky-600"
                />
                Round trip
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <input
                  type="radio"
                  name="trip"
                  className="h-4 w-4 accent-sky-600"
                />
                One way
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <input
                  type="radio"
                  name="trip"
                  className="h-4 w-4 accent-sky-600"
                />
                Multi-city
              </label>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_auto]">
              <SearchField
                icon={<MapPin className="h-5 w-5" />}
                label="From"
                value="Lagos (LOS)"
              />

              <SearchField
                icon={<MapPin className="h-5 w-5" />}
                label="To"
                value="Where to?"
              />

              <SearchField
                icon={<CalendarDays className="h-5 w-5" />}
                label="Departure"
                value="Select date"
              />

              <SearchField
                icon={<CalendarDays className="h-5 w-5" />}
                label="Return"
                value="Select date"
              />

              <SearchField
                icon={<Users className="h-5 w-5" />}
                label="Passengers"
                value="1 Adult"
              />

              <Link
                href="/flights"
                className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 font-bold text-white transition hover:bg-sky-700"
              >
                <Search className="h-5 w-5" />
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Popular destinations
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Where will you go next?
            </h2>

            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Explore some of the world&apos;s most exciting destinations with
              SOG Airways.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            View all destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link
              key={destination.city}
              href="/booking"
              className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={`${destination.city}, ${destination.country}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 text-white">
                  <p className="text-2xl font-bold">{destination.city}</p>

                  <p className="text-sm text-white/75">
                    {destination.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Flights from
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {destination.price}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white dark:bg-sky-950/60 dark:text-sky-400">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="bg-slate-50 py-24 transition-colors duration-300 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Special offers
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              More travel. Better value.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Take advantage of our latest fares and start planning your next
              adventure.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {offers.map((offer) => (
              <div
                key={offer.title}
                className="group relative min-h-90 overflow-hidden rounded-3xl"
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                <div className="relative flex min-h-90 flex-col justify-end p-8 text-white">
                  <span className="mb-4 w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-md">
                    {offer.discount}
                  </span>

                  <h3 className="text-3xl font-bold">{offer.title}</h3>

                  <p className="mt-2 max-w-lg text-white/75">
                    {offer.description}
                  </p>

                  <Link
                    href="/offers"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-white"
                  >
                    Explore offer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SOG Airways */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              The SOG experience
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Travel with confidence.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500 dark:text-slate-400">
              From the moment you book your ticket to the moment you arrive,
              we&apos;re focused on making your journey simple, comfortable,
              and memorable.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 font-bold text-white transition hover:bg-sky-700"
            >
              Discover SOG Airways
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <BenefitCard
              icon={<Globe2 />}
              title="Worldwide Network"
              text="Connect to destinations across continents with convenient routes."
            />

            <BenefitCard
              icon={<ShieldCheck />}
              title="Secure Booking"
              text="Book with confidence using a safe and straightforward experience."
            />

            <BenefitCard
              icon={<Luggage />}
              title="Travel Made Easy"
              text="Manage your journey, baggage, and booking from one place."
            />

            <BenefitCard
              icon={<Users />}
              title="Here for You"
              text="Our customer support team is ready to help throughout your journey."
            />
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Call To Action */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-sky-600 px-8 py-16 text-center text-white sm:px-16">
          <Globe2 className="mx-auto h-10 w-10 text-sky-200" />

          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            The world is waiting.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-100">
            Find your next destination and start your journey with SOG Airways
            today.
          </p>

          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-sky-700 shadow-lg transition hover:bg-sky-50"
          >
            Start your journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function SearchField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-left transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-700"
    >
      <span className="text-sky-600 dark:text-sky-400">{icon}</span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-slate-400">
          {label}
        </span>

        <span className="mt-1 block truncate text-sm font-bold text-slate-800 dark:text-slate-100">
          {value}
        </span>
      </span>

      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}