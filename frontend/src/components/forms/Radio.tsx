import { InputHTMLAttributes, ReactNode } from "react";

interface RadioOption {
  label: ReactNode;
  value: string;
}

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  name: string;
  options: RadioOption[];
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Radio({
  name,
  options,
  label,
  error,
  helperText,
  className = "",
  ...props
}: RadioProps) {
  return (
    <div className="w-full">
      {label && (
        <p className="mb-3 text-sm font-medium text-slate-700">
          {label}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              {...props}
              type="radio"
              name={name}
              value={option.value}
              className={`h-4 w-4 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            />

            <span className="text-sm text-slate-700">
              {option.label}
            </span>
          </label>
        ))}
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