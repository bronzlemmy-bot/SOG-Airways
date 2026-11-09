"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Plane,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { newsletterService } from "@/services/newsletterService";

interface NewsletterFeedback {
  type: "success" | "error";
  message: string;
}

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Destinations", href: "/destinations" },
    { label: "Offers", href: "/offers" },
    { label: "Deals", href: "/deals" },
    { label: "Contact Us", href: "/contact" },
  ],
  travel: [
    { label: "Flights", href: "/flights" },
    { label: "Booking", href: "/booking" },
    { label: "Check-in", href: "/check-in" },
    { label: "Manage Booking", href: "/manage-booking" },
    { label: "Track Flight", href: "/track-flight" },
  ],
  support: [
    { label: "Baggage", href: "/baggage" },
    { label: "Travel Information", href: "/travel-information" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    label: "X",
    href: "#",
    icon: FaXTwitter,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: FaLinkedinIn,
  },
];

export default function PublicFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [newsletterFeedback, setNewsletterFeedback] =
    useState<NewsletterFeedback | null>(null);

  async function handleNewsletterSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (isSubscribing) return;

    setIsSubscribing(true);
    setNewsletterFeedback(null);

    try {
      await newsletterService.subscribe({
        email: newsletterEmail.trim(),
        consentGiven: true,
      });
      setNewsletterEmail("");
      setNewsletterConsent(false);
      setNewsletterFeedback({
        type: "success",
        message: "Thanks for subscribing to SOG Airways updates.",
      });
    } catch (error: unknown) {
      setNewsletterFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't complete your subscription. Please try again.",
      });
    } finally {
      setIsSubscribing(false);
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white dark:border-slate-800">
      {/* Newsletter */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                <Mail className="h-4 w-4" />
                Stay connected
              </div>

              <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                Get travel inspiration delivered to your inbox.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Receive flight deals, destination inspiration, travel updates,
                and special offers from SOG Airways.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.currentTarget.value);
                      setNewsletterFeedback(null);
                    }}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <label className="flex items-start gap-2 text-sm leading-6 text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={newsletterConsent}
                  onChange={(event) => {
                    setNewsletterConsent(event.currentTarget.checked);
                    setNewsletterFeedback(null);
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-white"
                />
                <span>
                  I agree to receive SOG Airways emails about flights, deals,
                  destinations, and travel updates.
                </span>
              </label>

              {newsletterFeedback && (
                <p
                  role={
                    newsletterFeedback.type === "error"
                      ? "alert"
                      : "status"
                  }
                  className={
                    newsletterFeedback.type === "error"
                      ? "text-sm text-red-300"
                      : "text-sm text-emerald-300"
                  }
                >
                  {newsletterFeedback.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                <Plane className="h-5 w-5" />
              </span>

              <span className="text-xl font-bold tracking-tight">
                SOG Airways
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Connecting people and places around the world with comfortable,
              reliable, and memorable journeys.
            </p>

            {/* Contact */}
            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                <span>Worldwide destinations</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-5 w-5 shrink-0 text-slate-300" />
                <span>24/7 Customer Support</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Globe2 className="h-5 w-5 shrink-0 text-slate-300" />
                <span>Travel around the world</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    onClick={(event) => {
                      if (social.href === "#") {
                        event.preventDefault();
                      }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Travel
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.travel.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SOG Airways. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy"
              className="text-sm text-slate-500 transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-slate-500 transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-sm text-slate-500 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}