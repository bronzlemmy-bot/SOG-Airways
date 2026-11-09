"use client";

import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  value: string;
  onSearchChange: (value: string) => void;
  onClear?: () => void;
  leftIcon?: ReactNode;
  showClear?: boolean;
  containerClassName?: string;
}

export default function SearchInput({
  value,
  onSearchChange,
  onClear,
  leftIcon,
  showClear = true,
  containerClassName = "",
  className = "",
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(event.target.value);
  };

  const handleClear = () => {
    onClear?.();

    if (!onClear) {
      onSearchChange("");
    }
  };

  const hasValue = value.length > 0;

  return (
    <div
      className={`relative w-full ${containerClassName}`}
    >
      <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
        {leftIcon ?? <Search className="h-5 w-5" />}
      </span>

      <input
        {...props}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
      />

      {showClear && hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}