import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PageSection from "@/components/ui/PageSection";

import TestimonialCarousel from "./TestimonialCarousel";

export default function TestimonialsSection() {
  return (
    <PageSection className="relative overflow-hidden bg-slate-50 px-6 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
            The SOG experience
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            What Travellers Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Thoughtful details can make every part of a journey feel easier.
          </p>
          <p className="mt-3 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Illustrative sample stories, not customer reviews.
          </p>
        </div>

        <TestimonialCarousel />

        <div className="mt-8 text-center">
          <Link
            href="/testimonials"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-bold text-slate-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 dark:text-white dark:hover:bg-white/5"
          >
            Explore more stories
            <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
