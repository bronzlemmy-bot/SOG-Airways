"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Globe2,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type Destination = {
  id: string;
  city: string;
  country: string;
  code: string;
  region: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  popular?: boolean;
};

const destinations: Destination[] = [
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    code: "LHR",
    region: "Europe",
    description:
      "Discover historic landmarks, royal heritage, world-class museums, and vibrant neighborhoods.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    price: 690,
    rating: 4.9,
    popular: true,
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    code: "DXB",
    region: "Middle East",
    description:
      "Experience futuristic architecture, luxury shopping, desert adventures, and unforgettable skylines.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    price: 520,
    rating: 4.8,
    popular: true,
  },
  {
    id: "new-york",
    city: "New York",
    country: "United States",
    code: "JFK",
    region: "North America",
    description:
      "Explore iconic streets, legendary entertainment, diverse food, and the energy of the city that never sleeps.",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85",
    price: 649,
    rating: 4.9,
    popular: true,
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    region: "Asia",
    description:
      "A fascinating blend of ancient traditions, modern technology, incredible cuisine, and vibrant culture.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
    price: 782,
    rating: 4.9,
    popular: true,
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    code: "CDG",
    region: "Europe",
    description:
      "Enjoy timeless architecture, artistic treasures, charming cafés, and the romance of the French capital.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    price: 719,
    rating: 4.8,
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    region: "Asia",
    description:
      "Discover futuristic gardens, incredible cuisine, tropical scenery, and a beautifully modern city.",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    price: 488,
    rating: 4.8,
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    code: "SYD",
    region: "Oceania",
    description:
      "Relax beside beautiful beaches while discovering iconic architecture and Australia's unique lifestyle.",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d1?auto=format&fit=crop&w=1200&q=85",
    price: 535,
    rating: 4.9,
  },
  {
    id: "cape-town",
    city: "Cape Town",
    country: "South Africa",
    code: "CPT",
    region: "Africa",
    description:
      "Experience dramatic mountains, beautiful coastlines, vibrant culture, and incredible African landscapes.",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=85",
    price: 410,
    rating: 4.8,
  },
  {
    id: "lagos",
    city: "Lagos",
    country: "Nigeria",
    code: "LOS",
    region: "Africa",
    description:
      "Experience one of Africa's most energetic cities, from its beaches and nightlife to its creative culture.",
    image:
      "https://images.unsplash.com/photo-1598343175499-a8f24e3f6b7b?auto=format&fit=crop&w=1200&q=85",
    price: 320,
    rating: 4.7,
  },
  {
    id: "istanbul",
    city: "Istanbul",
    country: "Türkiye",
    code: "IST",
    region: "Europe",
    description:
      "Cross two continents while exploring historic mosques, colorful markets, and remarkable cuisine.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    price: 475,
    rating: 4.8,
  },
  {
    id: "maldives",
    city: "Malé",
    country: "Maldives",
    code: "MLE",
    region: "Asia",
    description:
      "Escape to turquoise waters, tropical islands, white sand beaches, and peaceful luxury resorts.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85",
    price: 610,
    rating: 4.9,
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
    region: "North America",
    description:
      "Explore Canada's diverse cultural capital, iconic skyline, neighborhoods, and waterfront.",
    image:
      "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1200&q=85",
    price: 675,
    rating: 4.7,
  },
];

const regions = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "Middle East",
  "North America",
  "Oceania",
];

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        destination.city.toLowerCase().includes(searchTerm) ||
        destination.country.toLowerCase().includes(searchTerm) ||
        destination.code.toLowerCase().includes(searchTerm);

      const matchesRegion =
        selectedRegion === "All" || destination.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.2),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200 backdrop-blur">
              <Globe2 className="h-4 w-4" />
              The world is waiting
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore the world with{" "}
              <span className="text-sky-400">SOG Airways.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              From vibrant cities to tropical escapes, discover destinations
              worth traveling for and find your next unforgettable journey.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl sm:flex-row">
              <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-white px-4 dark:bg-slate-900">
                <Search className="h-5 w-5 shrink-0 text-sky-600" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search a city, country or airport..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <Link
                href="/flights"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                <Plane className="h-5 w-5" />
                Find flights
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region filter */}
      <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
        >
          <div className="flex min-w-max gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  selectedRegion === region
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured destinations */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Popular destinations
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Where will you go next?
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Explore some of the most exciting destinations available through
              the SOG Airways network.
            </p>
          </div>

          <Link
            href="/flights"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition hover:text-sky-700"
          >
            Search all flights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Destination grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Globe2 className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold">Destination not found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Try searching for another city, country, airport code, or
              region.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedRegion("All");
              }}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Reset search
            </button>
          </motion.div>
        )}
      </section>

      {/* Travel inspiration */}
      <section className="border-y border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Sparkles className="h-4 w-4" />
                Travel inspiration
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                More places. More memories. More possibilities.
              </h2>

              <p className="mt-5 leading-7 text-slate-500 dark:text-slate-400">
                Whether you are planning a business trip, family vacation,
                romantic getaway, or solo adventure, SOG Airways connects you
                with destinations around the world.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/flights"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-400"
                >
                  Explore flights
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-400"
                >
                  View offers
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-4xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85"
                alt="Beautiful mountain destination"
                width={1400}
                height={900}
                className="h-96 w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-sm font-semibold text-sky-200">
                  Your journey starts with a destination
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  Go beyond the ordinary.
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why travel with SOG */}
      <section className="bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Why SOG Airways
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Travel with confidence
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Everything you need for a smoother journey from search to
              arrival.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <BenefitCard
              icon={<Plane className="h-6 w-6" />}
              title="Global connections"
              description="Discover routes connecting major cities and exciting destinations around the world."
            />

            <BenefitCard
              icon={<Users className="h-6 w-6" />}
              title="Travel your way"
              description="Choose the cabin, dates, and journey style that fit your travel plans."
            />

            <BenefitCard
              icon={<CalendarDays className="h-6 w-6" />}
              title="Simple booking"
              description="Search, compare, and move toward your next adventure with an easy booking experience."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-4xl bg-sky-600 p-8 sm:p-10 lg:p-14"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-950/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-sky-100">
                  Ready for takeoff?
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Find your next destination today.
                </h2>

                <p className="mt-4 leading-7 text-sky-100">
                  Search available flights and start planning your journey
                  with SOG Airways.
                </p>
              </div>

              <Link
                href="/flights"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Search flights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function DestinationCard({
  destination,
  index,
}: {
  destination: Destination;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
      }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-2xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900 dark:hover:shadow-black/30"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          width={1200}
          height={800}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

        {destination.popular && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            Popular
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-200">
              {destination.region}
            </p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              {destination.city}
            </h3>

            <p className="mt-1 text-xs text-slate-200">
              {destination.country}
            </p>
          </div>

          <span className="rounded-xl bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur">
            {destination.code}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            {destination.rating}
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Flights from</p>

            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ${destination.price}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {destination.description}
        </p>

        <div className="mt-5 flex gap-2">
          <Link
            href={`/flights?to=${destination.code}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-400"
          >
            Find flights
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`/booking?to=${destination.code}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
            aria-label={`Book a flight to ${destination.city}`}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
        Learn more
        <MapPin className="h-3.5 w-3.5" />
      </div>
    </motion.div>
  );
}