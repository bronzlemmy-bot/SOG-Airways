interface StatusDotProps {
  status:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusStyles = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-400",
};

const sizeStyles = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

export default function StatusDot({
  status,
  label,
  showLabel = false,
  size = "md",
  className = "",
}: StatusDotProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span
        className={`shrink-0 rounded-full ${statusStyles[status]} ${sizeStyles[size]}`}
        aria-hidden="true"
      />

      {showLabel && label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
    </span>
  );
}