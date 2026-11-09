import type { Testimonial } from "@/types";

import TestimonialCard from "./TestimonialCard";

interface TestimonialGridProps {
  testimonials: Testimonial[];
}

export default function TestimonialGrid({
  testimonials,
}: TestimonialGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
        />
      ))}
    </div>
  );
}
