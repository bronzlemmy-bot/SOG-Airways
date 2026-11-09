import Image from "next/image";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";

interface OfferCardProps {
  title: string;
  description?: string;
  image: string;
  discount?: string;
  price?: string;
  validUntil?: string;
  buttonText?: string;
  onSelect?: () => void;
  className?: string;
}

export default function OfferCard({
  title,
  description,
  image,
  discount,
  price,
  validUntil,
  buttonText = "View Offer",
  onSelect,
  className = "",
}: OfferCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {/* Offer Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {discount && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
            <Tag className="h-3.5 w-3.5" />
            {discount}
          </div>
        )}
      </div>

      {/* Offer Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {/* Price */}
        {price && (
          <div className="mt-4">
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-2xl font-bold text-slate-900">{price}</p>
          </div>
        )}

        {/* Valid Until */}
        {validUntil && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span>Valid until {validUntil}</span>
          </div>
        )}

        {/* Action */}
        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}