import { CalendarDays, MapPin, Plane } from "lucide-react";

interface BookingCardProps {
  bookingReference: string;
  passengerName: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  date: string;
  status: string;
  className?: string;
  onView?: () => void;
}

export default function BookingCard({
  bookingReference,
  passengerName,
  airline,
  flightNumber,
  departureAirport,
  departureCity,
  departureTime,
  arrivalAirport,
  arrivalCity,
  arrivalTime,
  date,
  status,
  className = "",
  onView,
}: BookingCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Booking Reference
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {bookingReference}
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {status}
        </span>
      </div>

      {/* Passenger */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">Passenger</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {passengerName}
        </p>
      </div>

      {/* Flight Information */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{airline}</p>
            <p className="mt-1 text-xs text-slate-500">{flightNumber}</p>
          </div>

          <Plane className="h-5 w-5 text-slate-600" />
        </div>

        <div className="mt-5 flex items-center gap-4">
          {/* Departure */}
          <div className="min-w-0">
            <p className="text-lg font-bold text-slate-900">
              {departureTime}
            </p>

            <div className="mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />

              <span className="text-sm font-semibold text-slate-800">
                {departureAirport}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">{departureCity}</p>
          </div>

          {/* Route */}
          <div className="flex flex-1 items-center">
            <div className="h-px flex-1 bg-slate-200" />

            <Plane className="mx-2 h-4 w-4 shrink-0 text-slate-500" />

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Arrival */}
          <div className="min-w-0 text-right">
            <p className="text-lg font-bold text-slate-900">
              {arrivalTime}
            </p>

            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="text-sm font-semibold text-slate-800">
                {arrivalAirport}
              </span>

              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            </div>

            <p className="mt-1 text-xs text-slate-500">{arrivalCity}</p>
          </div>
        </div>
      </div>

      {/* Date and Action */}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-500" />

          <span className="text-sm font-medium text-slate-600">{date}</span>
        </div>

        {onView && (
          <button
            type="button"
            onClick={onView}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            View Booking
          </button>
        )}
      </div>
    </div>
  );
}