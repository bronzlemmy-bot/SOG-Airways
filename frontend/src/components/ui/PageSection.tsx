import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function PageSection({
  children,
  className = "",
  id,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={`w-full py-12 md:py-16 lg:py-20 ${className}`}
    >
      {children}
    </section>
  );
}