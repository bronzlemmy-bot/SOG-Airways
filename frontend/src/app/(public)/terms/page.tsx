import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  FileCheck2,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    content: (
      <>
        <p>
          By accessing or using the SOG Airways website and its services, you
          agree to comply with these Terms &amp; Conditions and any additional
          terms that may apply to specific services.
        </p>

        <p>
          If you do not agree with these terms, you should not use the services
          provided through the website.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "2. Our services",
    content: (
      <>
        <p>
          SOG Airways provides an online platform for exploring destinations,
          searching for flights, making travel-related requests, managing
          bookings, and accessing travel information.
        </p>

        <p>
          Certain features shown on the website may remain unavailable until
          the relevant booking, payment, customer-management, or airline
          systems are connected and operational.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    title: "3. Flight bookings",
    content: (
      <>
        <p>
          Flight bookings are subject to availability, applicable fares,
          airline rules, passenger requirements, and any additional terms
          presented during the booking process.
        </p>

        <p>
          A booking should not be considered confirmed until the applicable
          booking process has been completed and the required confirmation has
          been issued.
        </p>
      </>
    ),
  },
  {
    id: "passengers",
    title: "4. Passenger information",
    content: (
      <>
        <p>
          Customers are responsible for providing accurate passenger
          information when making a booking.
        </p>

        <p>
          Names, travel documents, dates, destinations, and other information
          should be checked carefully before completing a booking.
        </p>
      </>
    ),
  },
  {
    id: "fares",
    title: "5. Fares and prices",
    content: (
      <>
        <p>
          Flight prices and availability may change before a booking is
          completed. Prices displayed on the website may depend on the
          selected route, travel dates, cabin, passenger count, and other
          booking conditions.
        </p>

        <p>
          Any applicable taxes, fees, baggage charges, or additional services
          should be reviewed before completing a transaction.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "6. Payments",
    content: (
      <>
        <p>
          Where online payment functionality is available, customers are
          responsible for providing valid payment information and completing
          any required payment authorization.
        </p>

        <p>
          Payments may be processed through third-party payment providers.
          Additional terms from those providers may apply.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "7. Changes and cancellations",
    content: (
      <>
        <p>
          Changes, cancellations, refunds, and other modifications to a
          booking may be subject to the fare conditions and rules applicable
          to the specific booking.
        </p>

        <p>
          Customers should review the conditions associated with their booking
          before requesting a change or cancellation.
        </p>
      </>
    ),
  },
  {
    id: "baggage",
    title: "8. Baggage",
    content: (
      <>
        <p>
          Baggage allowances, fees, size limits, weight limits, and restricted
          items may vary depending on the flight, fare, destination, and
          applicable airline rules.
        </p>

        <p>
          Customers are responsible for reviewing the applicable baggage
          requirements before traveling.
        </p>
      </>
    ),
  },
  {
    id: "travel-documents",
    title: "9. Travel documents and entry requirements",
    content: (
      <>
        <p>
          Travelers are responsible for obtaining the passports, visas,
          permits, vaccinations, certificates, and other documents required
          for their journey.
        </p>

        <p>
          Entry requirements can vary by destination and may change over time.
          Travelers should verify requirements with the appropriate official
          authorities before departure.
        </p>
      </>
    ),
  },
  {
    id: "check-in",
    title: "10. Check-in and airport requirements",
    content: (
      <>
        <p>
          Passengers are responsible for completing check-in within the
          applicable time period and arriving at the airport with sufficient
          time to complete security, baggage, immigration, and boarding
          procedures.
        </p>

        <p>
          Specific check-in and boarding requirements may vary by flight and
          airport.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "11. Acceptable use",
    content: (
      <>
        <p>
          You agree not to misuse the website, interfere with its operation,
          attempt unauthorized access, introduce malicious software, or use
          the platform for unlawful purposes.
        </p>

        <p>
          We may restrict or suspend access where reasonably necessary to
          protect the website, customers, systems, or other users.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "12. Intellectual property",
    content: (
      <>
        <p>
          Unless otherwise stated, content displayed on the SOG Airways
          website, including branding, graphics, text, interface elements, and
          other materials, may be protected by intellectual-property laws.
        </p>

        <p>
          You may not reproduce, modify, distribute, or commercially exploit
          protected content without appropriate authorization.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "13. Third-party services and links",
    content: (
      <>
        <p>
          The website may contain links or integrations involving third-party
          services, including payment providers, communication services, travel
          resources, or other external platforms.
        </p>

        <p>
          Third-party services may have their own terms and privacy policies.
          SOG Airways is not responsible for terms that are controlled by
          independent third parties.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "14. Website availability",
    content: (
      <>
        <p>
          We aim to keep the website available and functional, but continuous
          availability cannot be guaranteed. Maintenance, updates, technical
          problems, security events, or circumstances outside our control may
          temporarily affect access.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "15. Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, the use of the website
          and its services is subject to reasonable limitations of liability.
        </p>

        <p>
          Specific liability relating to transportation, flight disruptions,
          cancellations, baggage, refunds, or other travel services may also be
          governed by applicable airline rules and laws.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "16. Privacy",
    content: (
      <>
        <p>
          Information collected through the website may be handled according
          to the SOG Airways Privacy Policy.
        </p>

        <p>
          Please review our Privacy Policy to understand how personal
          information may be collected and used.
        </p>

        <Link
          href="/privacy"
          className="mt-4 inline-flex items-center gap-2 font-bold text-sky-700 transition hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
        >
          Read our Privacy Policy
          <ArrowRight className="h-4 w-4" />
        </Link>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "17. Changes to these terms",
    content: (
      <>
        <p>
          These Terms &amp; Conditions may be updated as SOG Airways develops
          its services, systems, and operating processes.
        </p>

        <p>
          The updated version will be published on this page together with
          the applicable effective date.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "18. Applicable law",
    content: (
      <>
        <p>
          The interpretation and enforcement of these terms will depend on the
          applicable laws and regulations governing the relevant SOG Airways
          service and transaction.
        </p>

        <p>
          The final version of these terms should identify the applicable
          jurisdiction and governing law before the platform is launched as a
          commercial service.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "19. Contact us",
    content: (
      <>
        <p>
          If you have questions about these Terms &amp; Conditions or need
          assistance with a booking, please contact SOG Airways.
        </p>

        <div className="mt-5 rounded-3xl bg-slate-50 p-5 transition-colors duration-300 dark:bg-slate-800">
          <p className="font-bold text-slate-950 dark:text-white">
            SOG Airways
          </p>

          <a
            href="mailto:bronzlemmy@gmail.com"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
          >
            <Mail className="h-4 w-4" />
            bronzlemmy@gmail.com
          </a>

          <a
            href="tel:+2347038915140"
            className="mt-2 flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
          >
            <UserRound className="h-4 w-4" />
            +234 703 891 5140
          </a>
        </div>
      </>
    ),
  },
];

const travelResponsibility = [
  {
    icon: TicketCheck,
    title: "Check your booking",
    text: "Review your flight details and passenger information before departure.",
    href: "/manage-booking",
  },
  {
    icon: CalendarDays,
    title: "Prepare for travel",
    text: "Review check-in times, baggage information, and travel requirements.",
    href: "/check-in",
  },
  {
    icon: ShieldCheck,
    title: "Know the requirements",
    text: "Make sure you have the documents and information needed for your journey.",
    href: "/travel-information",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-sky-950" />

          <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <FileCheck2 className="h-4 w-4 text-sky-300" />
              Terms &amp; Conditions
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              The terms that guide your journey.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              These Terms &amp; Conditions describe the general rules for using
              SOG Airways services, booking travel, and accessing our website.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Scale className="h-4 w-4 text-sky-300" />
                Terms of service
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Last updated: September 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
            {/* SIDE NAVIGATION */}
            <aside className="lg:sticky lg:top-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      On this page
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Terms overview
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
                    >
                      <span className="line-clamp-1">{section.title}</span>

                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* TERMS */}
            <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-9 lg:p-12">
              <div className="mb-10 rounded-3xl border border-sky-100 bg-sky-50 p-6 transition-colors duration-300 dark:border-sky-900/60 dark:bg-sky-950/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400">
                    <BadgeCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      About these terms
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      This page is a general SOG Airways terms template for the
                      current website project. The final commercial terms
                      should be reviewed and updated to reflect the actual
                      airline operations, booking system, payment services,
                      applicable laws, and customer policies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-8"
                  >
                    <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* TRAVEL RESPONSIBILITY */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Travel responsibility
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              A smooth journey starts with preparation.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Before traveling, review your booking, travel documents,
              baggage requirements, and applicable destination information.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {travelResponsibility.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-4xl border border-slate-200 bg-slate-50 p-7 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700 dark:text-sky-400">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HELP CTA */}
      <section className="bg-slate-50 py-20 transition-colors duration-300 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl bg-slate-950 p-8 text-center text-white transition-all dark:bg-slate-900 sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Mail className="h-7 w-7 text-sky-300" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Need help with your booking?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Visit our help center or contact the SOG Airways support team
              if you have questions about a booking or our services.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-100"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Visit FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}