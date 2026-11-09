"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Luggage,
  BriefcaseBusiness,
  Check,
  Plus,
  Minus,
  Info,
  ShieldCheck,
  Weight,
} from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";



export interface BaggageOption {
  id: string;
  name: string;
  description: string;
  weightKg: number;
  price: number;
  currency: string;
}

export interface BaggageSelection {
  optionId: string;
  quantity: number;
}

interface BaggageManagementProps {
  bookingReference?: string;
  includedCheckedBags?: number;
  includedCabinBags?: number;
  maxAdditionalBags?: number;
  currency?: string;
  onConfirm?: (selection: BaggageSelection[], total: number) => void;
}

const DEFAULT_BAGGAGE_OPTIONS: BaggageOption[] = [
  {
    id: "checked-10",
    name: "Extra 10 kg",
    description: "Additional checked baggage",
    weightKg: 10,
    price: 12000,
    currency: "NGN",
  },
  {
    id: "checked-20",
    name: "Extra 20 kg",
    description: "Ideal for longer journeys",
    weightKg: 20,
    price: 22000,
    currency: "NGN",
  },
  {
    id: "checked-30",
    name: "Extra 30 kg",
    description: "More room for your essentials",
    weightKg: 30,
    price: 32000,
    currency: "NGN",
  },
];

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function BaggageManagement({
  bookingReference,
  includedCheckedBags = 1,
  includedCabinBags = 1,
  maxAdditionalBags = 3,
  currency = "NGN",
  onConfirm,
}: BaggageManagementProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [confirmed, setConfirmed] = useState(false);

  const selectedOptions = useMemo(
    () =>
      DEFAULT_BAGGAGE_OPTIONS.map((option) => ({
        ...option,
        currency,
        quantity: quantities[option.id] ?? 0,
      })).filter((option) => option.quantity > 0),
    [quantities, currency],
  );

  const totalQuantity = selectedOptions.reduce(
    (sum, option) => sum + option.quantity,
    0,
  );

  const totalPrice = selectedOptions.reduce(
    (sum, option) => sum + option.price * option.quantity,
    0,
  );

  const updateQuantity = (optionId: string, change: number) => {
    setConfirmed(false);

    setQuantities((current) => {
      const currentQuantity = current[optionId] ?? 0;
      const nextQuantity = currentQuantity + change;

      if (nextQuantity < 0) return current;
      if (totalQuantity + change > maxAdditionalBags) return current;

      return {
        ...current,
        [optionId]: nextQuantity,
      };
    });
  };

  const handleConfirm = () => {
    const selection = selectedOptions.map((option) => ({
      optionId: option.id,
      quantity: option.quantity,
    }));

    onConfirm?.(selection, totalPrice);
    setConfirmed(true);
  };

  const handleReset = () => {
    setQuantities({});
    setConfirmed(false);
  };

  return (
    <section className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Badge variant="info">Baggage services</Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Travel with everything you need
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Review your included baggage and add extra weight before your
              journey.
            </p>
            {bookingReference && (
              <p className="mt-4 text-sm text-blue-200">
                Booking reference:{" "}
                <span className="font-semibold text-white">
                  {bookingReference}
                </span>
              </p>
            )}
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Luggage className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Luggage className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Included checked baggage
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {includedCheckedBags} {includedCheckedBags === 1 ? "bag" : "bags"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Allowance depends on your ticket and route.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Included cabin baggage
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {includedCabinBags} {includedCabinBags === 1 ? "bag" : "bags"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Cabin size and weight limits still apply.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Add extra baggage
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose an additional allowance. Prices below are sample development
            prices and must be verified against your final fare rules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {DEFAULT_BAGGAGE_OPTIONS.map((option, index) => {
            const quantity = quantities[option.id] ?? 0;
            const isSelected = quantity > 0;

            return (
              <motion.article
                key={option.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.06 }}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-slate-900 ${
                  isSelected
                    ? "border-sky-500 ring-2 ring-sky-500/15"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Weight className="h-6 w-6" />
                  </div>
                  {isSelected && (
                    <Badge variant="success">
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Selected
                      </span>
                    </Badge>
                  )}
                </div>

                <h4 className="mt-4 font-bold text-slate-900 dark:text-white">
                  {option.name}
                </h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {option.description}
                </p>

                <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatMoney(option.price, currency)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Per additional bag
                </p>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
                  <button
                    type="button"
                    aria-label={`Remove one ${option.name} bag`}
                    disabled={quantity === 0}
                    onClick={() => updateQuantity(option.id, -1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    aria-live="polite"
                    className="font-semibold text-slate-900 dark:text-white"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${option.name} bag`}
                    disabled={totalQuantity >= maxAdditionalBags}
                    onClick={() => updateQuantity(option.id, 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-600 dark:hover:bg-sky-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Baggage selection summary
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalQuantity === 0
                ? "You have not selected additional baggage."
                : `${totalQuantity} additional ${
                    totalQuantity === 1 ? "bag" : "bags"
                  } selected.`}
            </p>
          </div>
        </div>

        {selectedOptions.length > 0 && (
          <div className="mt-4 space-y-3">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  {option.name} × {option.quantity}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatMoney(option.price * option.quantity, currency)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Additional baggage total
          </span>
          <span className="text-xl font-bold text-slate-950 dark:text-white">
            {formatMoney(totalPrice, currency)}
          </span>
        </div>

        {confirmed && (
          <div
            role="status"
            className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Your selection has been confirmed for this frontend preview.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <OutlineButton onClick={handleReset}>
            Reset selection
          </OutlineButton>
          <PrimaryButton
            type="button"
            onClick={handleConfirm}
            disabled={totalQuantity === 0}
          >
            Confirm baggage selection
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}