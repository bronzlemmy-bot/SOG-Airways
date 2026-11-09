import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "1. Information we collect",
    content: (
      <>
        <p>
          When you use SOG Airways services, we may collect information that
          you provide directly to us, such as your name, contact details,
          passenger information, booking details, and other information needed
          to provide travel services.
        </p>

        <p>
          We may also collect information about how you interact with our
          website, such as pages visited, device information, browser
          information, and technical information used to keep our website
          secure and functional.
        </p>
      </>
    ),
  },
  {
    id: "booking",
    title: "2. Booking and travel information",
    content: (
      <>
        <p>
          Information associated with a flight booking may include passenger
          names, contact details, travel dates, flight selections, booking
          references, baggage selections, and other information necessary to
          manage a journey.
        </p>

        <p>
          When our booking and customer-management systems are connected to a
          backend, this information will be handled according to the security
          and privacy controls implemented for those systems.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "3. How we use information",
    content: (
      <>
        <p>Information may be used to:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Process and manage flight bookings.</li>
          <li>Provide customer support.</li>
          <li>Provide check-in and travel-related services.</li>
          <li>Communicate important booking or service information.</li>
          <li>Improve website functionality and user experience.</li>
          <li>
            Protect our services against fraud, abuse, and security threats.
          </li>
          <li>Meet applicable legal or regulatory requirements.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. When information may be shared",
    content: (
      <>
        <p>
          Information may need to be shared with service providers or
          organizations that help provide travel, payment, technology,
          communications, security, or other services.
        </p>

        <p>
          Where required, information may also be disclosed to government
          authorities, airports, border agencies, law-enforcement organizations,
          or other authorized parties in accordance with applicable laws.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "5. Payments",
    content: (
      <>
        <p>
          Payment information may be processed through third-party payment
          providers when payment functionality is connected to the SOG Airways
          platform.
        </p>

        <p>
          SOG Airways should not store sensitive payment-card information
          directly unless the appropriate security, compliance, and technical
          controls have been implemented.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies and similar technologies",
    content: (
      <>
        <p>
          Our website may use cookies or similar technologies to remember
          preferences, support essential functionality, improve performance,
          and understand how visitors interact with the website.
        </p>

        <p>
          The exact cookies and technologies used will depend on the services
          enabled on the website.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "7. Information security",
    content: (
      <>
        <p>
          We take reasonable measures to protect information from unauthorized
          access, alteration, disclosure, or destruction.
        </p>

        <p>
          No website, application, or internet transmission can be guaranteed
          to be completely secure. Security practices should therefore be
          reviewed and updated as the SOG Airways platform develops.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "8. Data retention",
    content: (
      <>
        <p>
          Personal information should only be retained for as long as
          reasonably necessary for the purposes for which it was collected,
          including providing services, maintaining records, resolving
          disputes, preventing abuse, and meeting legal obligations.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "9. Your privacy choices",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights concerning your
          personal information. These may include requesting access to,
          correction of, or deletion of certain information.
        </p>

        <p>
          You can contact SOG Airways if you have a privacy-related request or
          question about information associated with your interaction with our
          services.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children and young travelers",
    content: (
      <>
        <p>
          Our services are intended to be used with appropriate involvement of
          a parent, guardian, or responsible adult where required. Additional
          rules may apply to bookings involving children or young travelers.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to this privacy policy",
    content: (
      <>
        <p>
          This privacy policy may be updated as SOG Airways develops its
          services, technology, and operating processes.
        </p>

        <p>
          When changes are made, the updated version should be published on
          this page together with the applicable effective date.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "12. Contact us",
    content: (
      <>
        <p>
          If you have questions about this privacy policy or how information is
          handled, please contact SOG Airways.
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

const privacyFeatures = [
  {
    icon: LockKeyhole,
    title: "Protect information",
    text: "Use appropriate safeguards as the platform and its backend systems develop.",
  },
  {
    icon: UserRound,
    title: "Respect your choices",
    text: "Provide appropriate ways for customers to ask questions about their information.",
  },
  {
    icon: ShieldCheck,
    title: "Secure the journey",
    text: "Security and privacy considerations should remain part of the product development process.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-sky-950" />

          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              Privacy &amp; data protection
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your privacy matters to us.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              This Privacy Policy explains the types of information that may
              be collected through SOG Airways services, how it may be used,
              and the choices available to you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <FileText className="h-4 w-4 text-sky-300" />
                Privacy Policy
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
                      Privacy information
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

            {/* POLICY */}
            <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-9 lg:p-12">
              <div className="mb-10 rounded-3xl border border-sky-100 bg-sky-50 p-6 transition-colors duration-300 dark:border-sky-900/60 dark:bg-sky-950/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-400">
                    <LockKeyhole className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      About this policy
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      This page is designed as the privacy-policy section of
                      the SOG Airways website. The final policy should be
                      reviewed and updated to reflect the actual services,
                      technologies, partners, and legal requirements used when
                      the platform goes live.
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

      {/* PRIVACY FEATURES */}
      <section className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Privacy principles
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Built around responsible data handling.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {privacyFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-4xl border border-slate-200 bg-slate-50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
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
                </div>
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
              Have a privacy question?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Contact the SOG Airways support team if you have a question about
              this policy or information associated with your use of our
              services.
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