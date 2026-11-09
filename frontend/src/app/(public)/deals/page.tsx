"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Search,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

type Deal = {
  id: number;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  country: string;
  region: string;
  price: number;
  oldPrice: number;
  discount: number;
  cabin: string;
  duration: string;
  image: string;
  dates: string;
};

const deals: Deal[] = [
  {
    id: 1,
    from: "Lagos",
    fromCode: "LOS",
    to: "London",
    toCode: "LHR",
    country: "United Kingdom",
    region: "Europe",
    price: 685,
    oldPrice: 920,
    discount: 26,
    cabin: "Economy",
    duration: "7h 10m",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    dates: "Sep 2026 – Nov 2026",
  },
  {
    id: 2,
    from: "Lagos",
    fromCode: "LOS",
    to: "Dubai",
    toCode: "DXB",
    country: "United Arab Emirates",
    region: "Middle East",
    price: 545,
    oldPrice: 720,
    discount: 24,
    cabin: "Economy",
    duration: "7h 05m",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    dates: "Oct 2026 – Dec 2026",
  },
  {
    id: 3,
    from: "Lagos",
    fromCode: "LOS",
    to: "New York",
    toCode: "JFK",
    country: "United States",
    region: "North America",
    price: 790,
    oldPrice: 1040,
    discount: 24,
    cabin: "Economy",
    duration: "11h 35m",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85",
    dates: "Sep 2026 – Jan 2027",
  },
  {
    id: 4,
    from: "Lagos",
    fromCode: "LOS",
    to: "Tokyo",
    toCode: "NRT",
    country: "Japan",
    region: "Asia",
    price: 980,
    oldPrice: 1280,
    discount: 23,
    cabin: "Economy",
    duration: "18h 25m",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
    dates: "Oct 2026 – Feb 2027",
  },
  {
    id: 5,
    from: "Lagos",
    fromCode: "LOS",
    to: "Paris",
    toCode: "CDG",
    country: "France",
    region: "Europe",
    price: 650,
    oldPrice: 850,
    discount: 24,
    cabin: "Economy",
    duration: "6h 55m",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    dates: "Sep 2026 – Dec 2026",
  },
  {
    id: 6,
    from: "Lagos",
    fromCode: "LOS",
    to: "Cape Town",
    toCode: "CPT",
    country: "South Africa",
    region: "Africa",
    price: 390,
    oldPrice: 510,
    discount: 24,
    cabin: "Economy",
    duration: "5h 10m",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=85",
    dates: "Sep 2026 – Nov 2026",
  },
  {
    id: 7,
    from: "Lagos",
    fromCode: "LOS",
    to: "Singapore",
    toCode: "SIN",
    country: "Singapore",
    region: "Asia",
    price: 895,
    oldPrice: 1160,
    discount: 23,
    cabin: "Economy",
    duration: "16h 45m",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    dates: "Nov 2026 – Mar 2027",
  },
  {
    id: 8,
    from: "Lagos",
    fromCode: "LOS",
    to: "Nairobi",
    toCode: "NBO",
    country: "Kenya",
    region: "Africa",
    price: 320,
    oldPrice: 425,
    discount: 25,
    cabin: "Economy",
    duration: "5h 05m",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
    dates: "Sep 2026 – Dec 2026",
  },
];

const regions = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "Middle East",
  "North America",
];

export default function DealsPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredDeals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = deals.filter((deal) => {
      const matchesRegion =
        selectedRegion === "All" || deal.region === selectedRegion;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${deal.from} ${deal.to} ${deal.fromCode} ${deal.toCode} ${deal.country} ${deal.region}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesRegion && matchesSearch;
    });

    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "discount") {
      return [...filtered].sort((a, b) => b.discount - a.discount);
    }

    return filtered;
  }, [search, selectedRegion, sortBy]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-170 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=90"
          alt="Airplane flying above the clouds"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/45 to-slate-950/90" />

        <div className="relative mx-auto flex min-h-170 max-w-7xl items-center px-6 pb-20 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <Sparkles size={16} />
              Limited-time flight deals
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Go further for less.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl"
            >
              Discover special fares from Lagos to destinations across
              Africa, Europe, Asia, the Middle East and North America.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/flights"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Search all flights
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Explore destinations
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="relative z-10 -mt-14 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-4xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-7">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search destination, airport or region..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 lg:w-56"
              >
                <option value="featured">Featured deals</option>
                <option value="price-low">Lowest price</option>
                <option value="price-high">Highest price</option>
                <option value="discount">Biggest discount</option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedRegion === region
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Current deals
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Your next adventure starts here.
              </h2>

              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                Browse our featured fares and choose the destination that fits
                your next journey.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Tag size={17} />
              {filteredDeals.length} deals available
            </div>
          </div>

          {filteredDeals.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal, index) => (
                <motion.article
                  key={deal.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={`${deal.to}, ${deal.country}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-950 shadow-lg">
                      Save {deal.discount}%
                    </div>

                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                          Fly to
                        </p>

                        <h3 className="mt-1 text-2xl font-bold">
                          {deal.to}
                        </h3>
                      </div>

                      <p className="text-sm font-semibold text-white/80">
                        {deal.toCode}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
                          From
                        </p>

                        <p className="mt-1 font-bold">
                          {deal.from}{" "}
                          <span className="text-slate-400">
                            ({deal.fromCode})
                          </span>
                        </p>
                      </div>

                      <ArrowRight size={18} className="text-slate-400" />

                      <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
                          To
                        </p>

                        <p className="mt-1 font-bold">{deal.toCode}</p>
                      </div>
                    </div>

                    <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarDays size={16} />
                        <span>{deal.dates}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock3 size={16} />
                        <span>{deal.duration}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Users size={16} />
                        <span>{deal.cabin}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Globe2 size={16} />
                        <span>{deal.region}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-400">From</p>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-3xl font-bold">
                            ${deal.price}
                          </span>

                          <span className="text-sm text-slate-400 line-through">
                            ${deal.oldPrice}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/booking?from=${deal.fromCode}&to=${deal.toCode}&trip=round-trip&passengers=1&cabin=${deal.cabin}`}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                      >
                        Book deal
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search size={23} />
              </div>

              <h3 className="mt-5 text-xl font-bold">No deals found</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Try another destination, airport code or region.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedRegion("All");
                }}
                className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Deal benefits */}
      <section className="bg-white px-6 py-24 transition-colors duration-300 dark:bg-slate-900/70 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Tag,
                title: "Special fares",
                text: "Discover selected routes with promotional pricing.",
              },
              {
                icon: Check,
                title: "Simple booking",
                text: "Choose your deal and continue directly to booking.",
              },
              {
                icon: Globe2,
                title: "Worldwide travel",
                text: "Explore destinations across multiple regions.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-4xl border border-slate-200 bg-slate-50 p-7 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                  <p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-4xl bg-slate-950 px-8 py-14 text-white dark:bg-black sm:px-12 lg:px-16">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
                  <Sparkles size={16} />
                  Keep exploring
                </div>

                <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Didn&apos;t find the right deal?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/55">
                  Search all available flights and build a trip around the
                  destination and dates that work for you.
                </p>
              </div>

              <Link
                href="/flights"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Search flights
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white dark:bg-black lg:px-8">
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/45">
            SOG Airways
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Your next destination is waiting.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Explore our destinations and discover where your next journey
            could take you.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Explore destinations
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}