"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { contactService } from "@/services/contactService";

const contactOptions = [
  {
    icon: Phone,
    title: "Call us",
    description: "Speak directly with SOG Airways support.",
    value: "07038915140",
    href: "tel:+2347038915140",
    action: "Call support",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Message us on WhatsApp for assistance.",
    value: "07038915140",
    href: "https://wa.me/2347038915140",
    action: "Chat on WhatsApp",
  },
  {
    icon: Mail,
    title: "Email us",
    description: "Send us your question or travel request.",
    value: "bronzlemmy@gmail.com",
    href: "mailto:bronzlemmy@gmail.com",
    action: "Send an email",
  },
];

const quickLinks = [
  {
    title: "Manage your booking",
    description: "Review or update your trip details.",
    href: "/manage-booking",
  },
  {
    title: "Check-in online",
    description: "Get ready for your flight before reaching the airport.",
    href: "/check-in",
  },
  {
    title: "Baggage information",
    description: "Learn about baggage allowances and restrictions.",
    href: "/baggage",
  },
  {
    title: "Frequently asked questions",
    description: "Find answers to common travel questions.",
    href: "/faq",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bookingReference: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionReference, setSubmissionReference] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const bookingReference = form.bookingReference.trim();
      const submission = await contactService.createContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: [
          form.message.trim(),
          ...(bookingReference
            ? [`Booking reference: ${bookingReference}`]
            : []),
        ].join("\n\n"),
        category: bookingReference ? "booking" : "general_inquiry",
      });

      setSubmissionReference(submission.reference);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        bookingReference: "",
        subject: "",
        message: "",
      });
    } catch (error: unknown) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmissionError("");
    if (submitted) {
      setSubmitted(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative isolate min-h-180 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2200&q=90"
          alt="Traveler preparing for a journey"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/40 to-slate-950/85" />

        <div className="relative mx-auto flex min-h-180 max-w-7xl items-center px-6 pb-24 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <MessageCircle size={16} />
              We&apos;re here to help
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Let&apos;s talk about your journey.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl"
            >
              Whether you need help with a booking, baggage, check-in, or your
              next destination, the SOG Airways team is here for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#contact-options"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Contact us
                <ArrowRight size={18} />
              </a>

              <a
                href="https://wa.me/2347038915140"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                WhatsApp us
                <MessageCircle size={18} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section
        id="contact-options"
        className="relative z-10 -mt-16 px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-4xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon size={22} />
                </div>

                <h2 className="mt-6 text-xl font-bold">{option.title}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {option.description}
                </p>

                <p className="mt-5 break-all font-semibold text-slate-900 dark:text-white">
                  {option.value}
                </p>

                <a
                  href={option.href}
                  target={
                    option.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    option.href.startsWith("https://")
                      ? "noreferrer"
                      : undefined
                  }
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:gap-3 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {option.action}
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Send us a message
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              How can we help?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Send us your question and include your booking reference if your
              message is related to an existing trip.
            </p>

            <div className="mt-9 space-y-4">
              <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h3 className="font-bold">Customer support</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Contact us by phone, WhatsApp or email for assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className="font-bold">Booking information</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Never send passwords or sensitive payment information
                    through the contact form.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-9"
          >
            {submitted ? (
              <div className="flex min-h-105 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Message received
                </h3>

                <p className="mt-3 max-w-md leading-7 text-slate-600 dark:text-slate-300">
                  Your message was saved for the SOG Airways support team.
                  Keep this reference for your records:{" "}
                  <span className="font-semibold">{submissionReference}</span>
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Return to the form
                  <Send size={17} />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                    Contact form
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Tell us what you need.
                  </h3>
                  <p
                    role="note"
                    className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                  >
                    Your message will be sent to SOG Airways support. Do not
                    include passwords or sensitive payment information.
                  </p>
                </div>

                {submissionError && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
                  >
                    {submissionError}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Full name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="bookingReference"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Booking reference
                        <span className="ml-1 font-normal text-slate-400">
                          (optional)
                        </span>
                      </label>

                      <input
                        id="bookingReference"
                        name="bookingReference"
                        type="text"
                        value={form.bookingReference}
                        onChange={handleChange}
                        placeholder="e.g. SOG8K4"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Subject
                      </label>

                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={6}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    {isSubmitting ? "Sending message..." : "Send message"}
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="bg-white px-6 py-24 transition-colors duration-300 dark:bg-slate-900/70 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Quick help
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Looking for something specific?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              You may be able to find what you need immediately through one of
              these travel services.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="group flex h-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <div>
                    <h3 className="text-lg font-bold">{link.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {link.description}
                    </p>
                  </div>

                  <div className="ml-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white transition-all group-hover:bg-slate-950 group-hover:text-white dark:bg-slate-800 dark:group-hover:bg-white dark:group-hover:text-slate-950">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Support */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-4xl bg-slate-950 text-white dark:bg-black">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-14">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <MapPin size={25} />
                </div>

                <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-white/45">
                  SOG Airways
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Wherever your journey takes you, we&apos;re here.
                </h2>

                <p className="mt-5 leading-8 text-white/60">
                  From booking your first flight to preparing for your return
                  journey, our support channels are available to help you
                  navigate your trip.
                </p>

                <div className="mt-8 space-y-4">
                  <a
                    href="tel:+2347038915140"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <Phone size={20} />

                    <div>
                      <p className="text-sm text-white/45">Phone</p>
                      <p className="font-semibold">07038915140</p>
                    </div>
                  </a>

                  <a
                    href="mailto:bronzlemmy@gmail.com"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <Mail size={20} />

                    <div>
                      <p className="text-sm text-white/45">Email</p>
                      <p className="break-all font-semibold">
                        bronzlemmy@gmail.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="relative min-h-80">
                <Image
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85"
                  alt="Airplane flying through the sky"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-slate-950/25" />

                <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/20 bg-slate-950/50 p-5 backdrop-blur-md">
                  <p className="text-sm text-white/60">
                    Start your next adventure
                  </p>

                  <Link
                    href="/flights"
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-white transition hover:gap-3"
                  >
                    Explore available flights
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white dark:bg-black lg:px-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/45">
            SOG Airways
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to take your journey further?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Find a flight, explore new destinations or get in touch with our
            team whenever you need us.
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