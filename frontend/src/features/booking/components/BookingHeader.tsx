import { ArrowLeft, Plane } from "lucide-react";

interface BookingHeaderProps {
  title?: string;
  description?: string;
  bookingReference?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function BookingHeader({
  title = "Book Your Flight",
  description = "Search for a flight and complete your booking in a few simple steps.",
  bookingReference,
  showBackButton = false,
  onBack,
}: BookingHeaderProps) {
  return (
    <header className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {showBackButton && onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Go back"
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <Plane className="h-5 w-5" />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          {bookingReference && (
            <div className="shrink-0 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-900/60 dark:bg-sky-500/10">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Booking Reference
              </p>

              <p className="mt-1 font-bold tracking-wider text-slate-900 dark:text-white">
                {bookingReference}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}