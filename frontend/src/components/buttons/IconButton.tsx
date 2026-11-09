import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function IconButton({
  icon: Icon,
  label,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "default",
  size = "md",
  className = "",
}: IconButtonProps) {
  const variants = {
    default:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
  };

  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      ) : (
        <Icon className="h-5 w-5" />
      )}
    </button>
  );
}