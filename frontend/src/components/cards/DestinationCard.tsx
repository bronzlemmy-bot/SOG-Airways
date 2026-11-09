import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

interface DestinationsCardProps {
  name: string;
  country: string;
  image: string;
  description?: string;
  flightCount?: number;
  onExplore?: () => void;
  className?: string;
}

export default function DestinationsCard({
  name,
  country,
  image,
  description,
  flightCount,
  onExplore,
  className = "",
}: DestinationsCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {/* Destination Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={`${name}, ${country}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{country}</span>
          </div>

          <h3 className="mt-1 text-2xl font-bold">{name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {description && (
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          {flightCount !== undefined ? (
            <p className="text-sm font-medium text-slate-600">
              {flightCount} {flightCount === 1 ? "flight" : "flights"}
            </p>
          ) : (
            <div />
          )}

          {onExplore && (
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}