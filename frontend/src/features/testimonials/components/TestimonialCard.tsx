import { Quote } from "lucide-react";

import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({
  testimonial,
  className = "",
}: TestimonialCardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-7 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.38)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white/80 hover:shadow-[0_28px_70px_-32px_rgba(15,23,42,0.4)] dark:border-white/15 dark:bg-slate-900/55 dark:shadow-[0_18px_54px_-30px_rgba(0,0,0,0.7)] dark:hover:border-amber-300/30 dark:hover:bg-slate-900/75 sm:p-9 ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-amber-300/30 to-sky-300/20 blur-2xl transition-opacity group-hover:opacity-100 dark:from-amber-300/15 dark:to-sky-300/10" />
      <div className="relative flex items-center justify-between gap-3">
        <Quote
          className="h-8 w-8 fill-amber-400/15 text-amber-500 dark:text-amber-300"
          aria-hidden="true"
        />
        <span className="h-px flex-1 bg-gradient-to-r from-amber-300/80 via-sky-300/50 to-transparent dark:from-amber-400/50 dark:via-sky-300/30" />
      </div>

      <blockquote className="relative mt-7 flex-1 font-serif text-xl leading-9 tracking-[0.01em] text-slate-800 dark:text-slate-100 sm:text-2xl sm:leading-10">
        “{testimonial.quote}”
      </blockquote>

      <footer className="relative mt-8 border-t border-slate-300/60 pt-5 dark:border-white/10">
        <p className="font-semibold tracking-wide text-slate-950 dark:text-white">
          {testimonial.traveler}
        </p>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {testimonial.route}
        </p>
      </footer>
    </article>
  );
}
