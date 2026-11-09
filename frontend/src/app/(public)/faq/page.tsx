"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BaggageClaim,
  CalendarCheck,
  ChevronDown,
  CircleHelp,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const categories = [
  "All",
  "Booking",
  "Check-in",
  "Baggage",
  "Flights",
  "Payments",
  "Manage Booking",
  "Travel",
];

const faqs: FAQ[] = [
  {
    id: "booking-1",
    question: "How do I book a flight with SOG Airways?",
    answer:
      "You can search for available flights from the Flights page by entering your departure city, destination, travel dates, passengers, and cabin class. Select the flight that works for you and continue to the booking process.",
    category: "Booking",
  },
  {
    id: "booking-2",
    question: "Can I book a flight online?",
    answer:
      "Yes. SOG Airways is designed to let you search for flights and complete your booking online. You can also use the Manage Booking section to access your reservation after booking.",
    category: "Booking",
  },
  {
    id: "booking-3",
    question: "Can I choose my seat when booking?",
    answer:
      "Seat selection may be available depending on your flight, cabin, and fare type. Available seat options can be shown during the booking process.",
    category: "Booking",
  },
  {
    id: "checkin-1",
    question: "How do I check in for my flight?",
    answer:
      "Visit the Check-in page and enter your booking reference and last name. Follow the instructions to retrieve your booking and continue with the check-in process.",
    category: "Check-in",
  },
  {
    id: "checkin-2",
    question: "When can I check in?",
    answer:
      "Online check-in availability depends on your flight and route. We recommend checking the information provided with your booking and completing check-in within the available check-in window.",
    category: "Check-in",
  },
  {
    id: "checkin-3",
    question: "What do I need for online check-in?",
    answer:
      "You will generally need your booking reference or reservation details and the passenger's last name. Keep your travel documents available as you complete the process.",
    category: "Check-in",
  },
  {
    id: "baggage-1",
    question: "How much baggage can I take?",
    answer:
      "Baggage allowances depend on your fare, cabin, route, and booking. Visit our Baggage page for information about carry-on and checked baggage allowances.",
    category: "Baggage",
  },
  {
    id: "baggage-2",
    question: "What is the carry-on baggage allowance?",
    answer:
      "Our standard baggage information currently highlights a carry-on allowance of up to 7 kg. Always check the baggage terms associated with your specific booking before traveling.",
    category: "Baggage",
  },
  {
    id: "baggage-3",
    question: "What items are not allowed in my baggage?",
    answer:
      "Certain dangerous, restricted, or regulated items cannot be carried in checked or cabin baggage. Visit the Baggage page for the restricted-items guidance before packing.",
    category: "Baggage",
  },
  {
    id: "flights-1",
    question: "How can I track my flight?",
    answer:
      "Use the Track Flight page to search for a flight using its flight number or tracking information. The page provides the available flight status and journey information.",
    category: "Flights",
  },
  {
    id: "flights-2",
    question: "What do the different flight statuses mean?",
    answer:
      "Flight statuses can include scheduled, boarding, in flight, delayed, landed, or other operational updates. The exact status displayed depends on the latest available flight information.",
    category: "Flights",
  },
  {
    id: "payments-1",
    question: "What payment methods can I use?",
    answer:
      "Available payment methods can depend on the booking flow and applicable market. Payment information is presented during the booking process before you complete your reservation.",
    category: "Payments",
  },
  {
    id: "payments-2",
    question: "Will I receive confirmation after payment?",
    answer:
      "After a successful booking, your reservation information and confirmation details should be provided through the booking process. Keep your booking reference available for future access.",
    category: "Payments",
  },
  {
    id: "manage-1",
    question: "How can I manage my booking?",
    answer:
      "Go to Manage Booking and enter your booking reference and passenger information. Depending on your reservation, you may be able to review or manage available booking details.",
    category: "Manage Booking",
  },
  {
    id: "manage-2",
    question: "Can I change my travel date?",
    answer:
      "Changes may be possible depending on your fare conditions, route, and booking. Review the terms associated with your reservation or contact SOG Airways support for assistance.",
    category: "Manage Booking",
  },
  {
    id: "travel-1",
    question: "What travel documents do I need?",
    answer:
      "Travel document requirements depend on your destination, nationality, and itinerary. Passengers are responsible for ensuring that they have the required passport, visa, and other travel documents before departure.",
    category: "Travel",
  },
  {
    id: "travel-2",
    question: "How early should I arrive at the airport?",
    answer:
      "The recommended airport arrival time depends on your route and airport. For international travel, allow sufficient time for check-in, baggage drop, security, immigration, and boarding.",
    category: "Travel",
  },
];

const quickHelp = [
  {
    title: "Manage your booking",
    description:
      "Find your reservation and review the available booking options.",
    href: "/manage-booking",
    icon: <Ticket className="h-6 w-6" />,
  },
  {
    title: "Check in",
    description:
      "Get ready for your journey with our online check-in experience.",
    href: "/check-in",
    icon: <CalendarCheck className="h-6 w-6" />,
  },
  {
    title: "Baggage information",
    description:
      "Review baggage allowances, restrictions, and packing guidance.",
    href: "/baggage",
    icon: <BaggageClaim className="h-6 w-6" />,
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        faq.question.toLowerCase().includes(normalizedSearch) ||
        faq.answer.toLowerCase().includes(normalizedSearch) ||
        faq.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85"
            alt="SOG Airways aircraft flying above the clouds"
            fill
            priority
            className="object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200 backdrop-blur">
              <CircleHelp className="h-4 w-4" />
              How can we help?
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frequently asked{" "}
              <span className="text-sky-400">questions.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Find answers to common questions about bookings, flights,
              baggage, check-in, payments, and traveling with SOG Airways.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="flex h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 shrink-0 text-sky-600" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your question..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="hidden h-10 items-center rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-500 sm:flex">
                {filteredFAQs.length}{" "}
                {filteredFAQs.length === 1 ? "answer" : "answers"}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-start">
          {/* Categories */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                  Browse topics
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  FAQ categories
                </h2>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setOpenId(null);
                    }}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Help card */}
            <div className="mt-5 hidden overflow-hidden rounded-3xl bg-sky-600 p-6 text-white lg:block">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <MessageCircle className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Still need help?
              </h3>

              <p className="mt-2 text-sm leading-6 text-sky-100">
                Our support team can help you with questions that are not
                answered here.
              </p>

              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Contact support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                  {selectedCategory === "All"
                    ? "All questions"
                    : selectedCategory}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  How can we help?
                </h2>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredFAQs.length}{" "}
                {filteredFAQs.length === 1 ? "question" : "questions"} found
              </p>
            </div>

            {filteredFAQs.length > 0 ? (
              <div className="space-y-3">
                {filteredFAQs.map((faq, index) => {
                  const isOpen = openId === faq.id;

                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.04, 0.2),
                      }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(isOpen ? null : faq.id)
                        }
                        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                        aria-expanded={isOpen}
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                              {faq.category}
                            </span>
                          </div>

                          <h3 className="text-base font-bold leading-6 text-slate-900 dark:text-white sm:text-lg">
                            {faq.question}
                          </h3>
                        </div>

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            isOpen
                              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="border-t border-slate-100 px-5 pb-6 pt-4 dark:border-slate-800 sm:px-6">
                              <p className="max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Search className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No questions found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Try a different search term or select another FAQ
                  category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setOpenId(null);
                  }}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Reset search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Quick help */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Quick help
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Looking for something specific?
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Jump directly to the service or information you need.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {quickHelp.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={item.href}
                  className="group block h-full rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-sky-200 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800 dark:hover:shadow-black/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-600">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel confidence */}
      <section className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-4xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85"
                alt="Aircraft flying above clouds"
                width={1400}
                height={900}
                className="h-96 w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-sm font-semibold text-sky-200">
                  Your journey matters
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  Travel with confidence.
                </h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                <ShieldCheck className="h-4 w-4" />
                Travel confidence
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need before takeoff.
              </h2>

              <p className="mt-5 leading-7 text-slate-500 dark:text-slate-400">
                From checking your booking to preparing your baggage and
                documents, SOG Airways gives you easy access to the
                information you need throughout your journey.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <Ticket className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Keep your booking details ready
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Your booking reference makes it easier to access your
                      reservation and manage your trip.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <BaggageClaim className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Prepare your baggage early
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Review baggage allowances and restricted items before
                      heading to the airport.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Check your travel documents
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Make sure your passport, visa, and other required
                      documents are ready for your journey.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/travel-information"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Travel information
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support cards */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Need more assistance?
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              We are here to help.
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Choose the support option that works best for you.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <SupportCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="WhatsApp support"
              description="Reach our support team through WhatsApp for quick assistance."
              href="https://wa.me/2347038915140"
              label="Open WhatsApp"
            />

            <SupportCard
              icon={<Mail className="h-6 w-6" />}
              title="Email support"
              description="Send us your question and our team can help with your request."
              href="mailto:bronzlemmy@gmail.com"
              label="Send an email"
            />

            <SupportCard
              icon={<CircleHelp className="h-6 w-6" />}
              title="Contact center"
              description="Visit our contact page for additional support options and information."
              href="/contact"
              label="Contact us"
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
                  Ready to travel?
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Your next journey starts here.
                </h2>

                <p className="mt-4 leading-7 text-sky-100">
                  Search flights, discover destinations, and start planning
                  your next adventure with SOG Airways.
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

function SupportCard({
  icon,
  title,
  description,
  href,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link
        href={href}
        className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-sky-200 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800 dark:hover:shadow-black/20"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
          {icon}
        </div>

        <h3 className="mt-5 text-lg font-bold">{title}</h3>

        <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-600">
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}