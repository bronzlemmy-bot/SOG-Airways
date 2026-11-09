"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
Luggage,
Package,
Plus,
Minus,
Weight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface BaggageOption {
id: string;
name: string;
description?: string;
price?: number;
currency?: string;
weight?: number;
weightUnit?: string;
maxQuantity?: number;
included?: boolean;
}

export interface SelectedBaggage {
baggageId: string;
quantity: number;
}

interface BaggageSelectionProps {
baggage: BaggageOption[];
selectedBaggage?: SelectedBaggage[];
onBaggageChange?: (baggage: SelectedBaggage[]) => void;
disabled?: boolean;
}

export default function BaggageSelection({
baggage,
selectedBaggage = [],
onBaggageChange,
disabled = false,
}: BaggageSelectionProps) {
const getQuantity = (baggageId: string) => {
return (
selectedBaggage.find((item) => item.baggageId === baggageId)?.quantity ??
0
);
};

const updateQuantity = (baggageId: string, quantity: number) => {
const existing = selectedBaggage.find(
(item) => item.baggageId === baggageId,
);


let updated: SelectedBaggage[];

if (quantity <= 0) {
  updated = selectedBaggage.filter(
    (item) => item.baggageId !== baggageId,
  );
} else if (existing) {
  updated = selectedBaggage.map((item) =>
    item.baggageId === baggageId
      ? {
          ...item,
          quantity,
        }
      : item,
  );
} else {
  updated = [
    ...selectedBaggage,
    {
      baggageId,
      quantity,
    },
  ];
}

onBaggageChange?.(updated);


};

const formatPrice = (price?: number, currency = "USD") => {
if (price === undefined) {
return "Included";
}


return new Intl.NumberFormat("en-US", {
  style: "currency",
  currency,
  maximumFractionDigits: 2,
}).format(price);


};

return (
<motion.div
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
> <Card className="overflow-hidden"> <div className="border-b border-slate-200 px-5 py-5 sm:px-6"> <div className="flex items-start gap-4"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"> <Luggage className="h-5 w-5" /> </div>


        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Baggage Selection
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Review your baggage allowance and select any additional
            baggage available for your journey.
          </p>
        </div>
      </div>
    </div>

    <div className="p-5 sm:p-6">
      {baggage.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <Package className="mx-auto h-8 w-8 text-slate-400" />

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            No baggage options available
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Baggage information will appear here when it is available for
            this booking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {baggage.map((option) => {
            const quantity = getQuantity(option.id);
            const maxQuantity = option.maxQuantity ?? 1;
            const isSelected = quantity > 0;

            return (
              <div
                key={option.id}
                className={`rounded-2xl border p-4 transition sm:p-5 ${
                  isSelected
                    ? "border-sky-300 bg-sky-50/50 ring-1 ring-sky-100"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Luggage className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {option.name}
                        </h3>

                        {option.included && (
                          <Badge variant="success">
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Included
                            </span>
                          </Badge>
                        )}
                      </div>

                      {option.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {option.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        {option.weight !== undefined && (
                          <span className="inline-flex items-center gap-1.5">
                            <Weight className="h-3.5 w-3.5" />
                            {option.weight}{" "}
                            {option.weightUnit ?? "kg"}
                          </span>
                        )}

                        <span>
                          {formatPrice(
                            option.price,
                            option.currency ?? "USD",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 lg:border-0 lg:pt-0">
                    <span className="text-sm font-medium text-slate-600">
                      Quantity
                    </span>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        disabled={disabled || quantity <= 0}
                        onClick={() =>
                          updateQuantity(option.id, quantity - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Remove ${option.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="flex h-10 min-w-10 items-center justify-center border-x border-slate-200 px-3 text-sm font-semibold text-slate-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        disabled={disabled || quantity >= maxQuantity}
                        onClick={() =>
                          updateQuantity(option.id, quantity + 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Add ${option.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {baggage.length > 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs leading-5 text-slate-500">
            Baggage availability, pricing, weight limits, and included
            allowances will come from your booking data when the backend
            is connected.
          </p>
        </div>
      )}
    </div>
  </Card>
</motion.div>


);
}
