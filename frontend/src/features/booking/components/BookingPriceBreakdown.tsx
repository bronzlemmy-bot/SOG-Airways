import { motion } from "framer-motion";
import {
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";

interface BookingPriceBreakdownProps {
  fare: number;
  taxes?: number;
  fees?: number;
  baggage?: number;
  discount?: number;
  currency?: string;
  passengerCount?: number;
  showPassengerCount?: boolean;
}

export default function BookingPriceBreakdown({
  fare,
  taxes = 0,
  fees = 0,
  baggage = 0,
  discount = 0,
  currency = "NGN",
  passengerCount = 1,
  showPassengerCount = true,
}: BookingPriceBreakdownProps) {
  const subtotal =
    fare + taxes + fees + baggage;

  const total = Math.max(
    0,
    subtotal - discount,
  );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          <Receipt className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Price Breakdown
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review your booking costs before payment.
          </p>
        </div>
      </div>

      {/* Price Details */}
      <div className="space-y-4 p-5 sm:p-6">
        {/* Fare */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Flight Fare
            </p>

            {showPassengerCount && (
              <p className="mt-1 text-xs text-slate-400">
                {passengerCount} passenger
                {passengerCount !== 1
                  ? "s"
                  : ""}
              </p>
            )}
          </div>

          <p className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(
              fare,
              currency,
            )}
          </p>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Taxes
          </p>

          <p className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(
              taxes,
              currency,
            )}
          </p>
        </div>

        {/* Fees */}
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Service Fees
          </p>

          <p className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(
              fees,
              currency,
            )}
          </p>
        </div>

        {/* Baggage */}
        {baggage > 0 && (
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Additional Baggage
            </p>

            <p className="font-medium text-slate-900 dark:text-white">
              {formatCurrency(
                baggage,
                currency,
              )}
            </p>
          </div>
        )}

        {/* Subtotal */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Subtotal
            </p>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(
                subtotal,
                currency,
              )}
            </p>
          </div>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

              <p className="font-medium text-emerald-700 dark:text-emerald-400">
                Discount
              </p>
            </div>

            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              -{" "}
              {formatCurrency(
                discount,
                currency,
              )}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="rounded-2xl bg-slate-900 p-5 dark:bg-slate-800">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Total Amount
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {passengerCount} passenger
                {passengerCount !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <p className="text-2xl font-bold text-white sm:text-3xl">
              {formatCurrency(
                total,
                currency,
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}