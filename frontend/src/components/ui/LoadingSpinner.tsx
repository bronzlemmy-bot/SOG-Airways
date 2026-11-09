interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function LoadingSpinner({
  size = "md",
  className = "",
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <span
        className={`animate-spin rounded-full border-slate-200 border-t-slate-900 ${sizeStyles[size]}`}
      />

      <span className="sr-only">{label}</span>
    </div>
  );
}