
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard as CreditCardIcon,
  Luggage as LuggageIcon,
  Plane as PlaneIcon,
  QrCode as QrCodeIcon,
  Ticket as TicketIcon,
  UserRound as UserRoundIcon,
} from "lucide-react";

import { supportCategories } from "./support-data/SupportData";

interface SupportCategorySelectorProps {
  selectedCategory: string;
  onChange: (categoryId: string) => void;
}

const categoryIcons = {
  booking: TicketIcon,
  flight: PlaneIcon,
  "check-in": QrCodeIcon,
  baggage: LuggageIcon,
  payment: CreditCardIcon,
  account: UserRoundIcon,
} as const;

export default function SupportCategorySelector({
  selectedCategory,
  onChange,
}: SupportCategorySelectorProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          What do you need help with?
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Select a category to find relevant support information and tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange("all")}
          aria-pressed={selectedCategory === "all"}
          className={`group relative rounded-2xl border p-4 text-left transition-all ${
            selectedCategory === "all"
              ? "border-slate-900 bg-slate-900 text-white shadow-md dark:border-white dark:bg-white dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                selectedCategory === "all"
                  ? "bg-white/10 text-white dark:bg-slate-900/10 dark:text-slate-900"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <TicketIcon className="h-5 w-5" />
            </div>

            {selectedCategory === "all" && (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            )}
          </div>

          <h3 className="mt-4 font-semibold">All Categories</h3>

          <p
            className={`mt-1 text-sm leading-5 ${
              selectedCategory === "all"
                ? "text-slate-300 dark:text-slate-600"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            View all available support topics and requests.
          </p>
        </motion.button>

        {supportCategories.map((category) => {
          const Icon = categoryIcons[category.id];
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(category.id)}
              aria-pressed={isSelected}
              className={`group relative rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white shadow-md dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-white/10 text-white dark:bg-slate-900/10 dark:text-slate-900"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                )}
              </div>

              <h3 className="mt-4 font-semibold">{category.title}</h3>

              <p
                className={`mt-1 text-sm leading-5 ${
                  isSelected
                    ? "text-slate-300 dark:text-slate-600"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {category.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

