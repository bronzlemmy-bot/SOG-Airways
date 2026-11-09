import { Plane } from "lucide-react";

interface FlightCardProps {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  duration: string;
  date?: string;
  price?: string;
  stops?: string;
  onSelect?: () => void;
  className?: string;
}

export default function FlightCard({
  airline,
  flightNumber,
  departureAirport,
  departureCity,
  departureTime,
  arrivalAirport,
  arrivalCity,
  arrivalTime,
  duration,
  date,
  price,
  stops = "Direct",
  onSelect,
  className = "",
}: FlightCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="flex flex-col gap-5">
        {/* Airline Information */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{airline}</p>
            <p className="mt-1 text-xs text-slate-500">{flightNumber}</p>
          </div>

          {date && (
            <p className="text-sm font-medium text-slate-500">{date}</p>
          )}
        </div>

        {/* Flight Route */}
        <div className="flex items-center gap-4">
          <div className="min-w-0 text-left">
            <p className="text-2xl font-bold text-slate-900">
              {departureTime}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {departureAirport}
            </p>

            <p className="mt-1 text-xs text-slate-500">{departureCity}</p>
          </div>

          <div className="flex flex-1 flex-col items-center">
            <p className="text-xs text-slate-500">{duration}</p>

            <div className="my-2 flex w-full items-center">
              <div className="h-px flex-1 bg-slate-200" />

              <div className="mx-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                <Plane className="h-4 w-4 text-slate-700" />
              </div>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-xs font-medium text-slate-500">{stops}</p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-2xl font-bold text-slate-900">
              {arrivalTime}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {arrivalAirport}
            </p>

            <p className="mt-1 text-xs text-slate-500">{arrivalCity}</p>
          </div>
        </div>

        {/* Price and Action */}
        {(price || onSelect) && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            {price ? (
              <div>
                <p className="text-xs text-slate-500">From</p>
                <p className="text-xl font-bold text-slate-900">{price}</p>
              </div>
            ) : (
              <div />
            )}

            {onSelect && (
              <button
                type="button"
                onClick={onSelect}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Select Flight
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}