import type { Metadata } from "next";
import { Plane } from "lucide-react";

import PageSection from "@/components/ui/PageSection";
import { TestimonialCarousel } from "@/features/testimonials";

export const metadata: Metadata = {
  title: "Traveller Stories | SOG Airways",
  description:
    "Explore illustrative SOG Airways travel stories and the details that make a journey feel easy.",
};

export default function TestimonialsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-amber-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -right-36 top-[30rem] h-[28rem] w-[28rem] rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-400/10" />
      </div>

      <header className="relative isolate overflow-hidden border-b border-white/50 bg-white/35 px-6 py-24 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.2),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.2),transparent_45%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-900 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/5 dark:text-sky-200 sm:text-sm">
            <Plane className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden="true" />
            SOG Airways · In good company
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl dark:from-white dark:via-sky-100 dark:to-slate-300">
            Every journey has a story.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg dark:text-slate-300">
            A few moments that show how thoughtful details can make travel
            feel easier, from the first search to the final arrival.
          </p>
          <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-gradient-to-r from-sky-500 via-amber-400 to-orange-400" />
        </div>
      </header>

      <PageSection className="relative bg-white/25 px-6 backdrop-blur-[2px] dark:bg-slate-950/20">
        <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/65 bg-white/40 p-5 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300 sm:text-sm">
                The traveller perspective
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Small details. Better journeys.
              </h2>
            </div>
            <p className="max-w-sm rounded-2xl border border-sky-200/70 bg-sky-50/55 px-4 py-3 text-sm leading-6 text-slate-700 backdrop-blur-md dark:border-sky-300/10 dark:bg-sky-300/[0.06] dark:text-slate-300">
              These are illustrative sample stories, not reviews from
              identifiable customers.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </PageSection>
    </main>
  );
}
