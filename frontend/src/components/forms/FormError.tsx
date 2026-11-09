import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({
  message,
  className = "",
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

      <p>{message}</p>
    </div>
  );
}