import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const columnStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

const gapStyles = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
};

export default function ResponsiveGrid({
  children,
  columns = 3,
  gap = "md",
  className = "",
}: ResponsiveGridProps) {
  return (
    <div
      className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`}
    >
      {children}
    </div>
  );
}