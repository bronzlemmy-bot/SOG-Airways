"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { demoTestimonials } from "../data/demoTestimonials";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeTestimonial = demoTestimonials[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      (current - 1 + demoTestimonials.length) % demoTestimonials.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % demoTestimonials.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <section
      aria-label="Illustrative traveller stories"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      className="mx-auto w-full max-w-3xl"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Sample story {activeIndex + 1} of {demoTestimonials.length}:{" "}
        {activeTestimonial.traveler}
      </p>

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTestimonial.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Sample story ${activeIndex + 1} of ${demoTestimonials.length}`}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <TestimonialCard testimonial={activeTestimonial} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
            Illustrative sample
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
            {activeIndex + 1} / {demoTestimonials.length}
          </span>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Show previous sample story"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 transition hover:border-amber-500 hover:bg-amber-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-amber-300 dark:hover:bg-amber-300/10 dark:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Show next sample story"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 transition hover:border-amber-500 hover:bg-amber-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-amber-300 dark:hover:bg-amber-300/10 dark:hover:text-white"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
