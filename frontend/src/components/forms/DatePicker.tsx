import { CalendarDays } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function DatePicker({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          id={id}
          type="date"
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          } disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
        />

        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : (
        helperText && (
          <p className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}