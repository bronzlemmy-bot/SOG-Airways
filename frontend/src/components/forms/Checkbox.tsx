import { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
  helperText?: string;
}

export default function Checkbox({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          id={id}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />

        <span className="text-sm leading-5 text-slate-700">
          {label}
        </span>
      </label>

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