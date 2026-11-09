import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Luggage } from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";

const BAGGAGE_OPTIONS = [
  {
    id: "none",
    name: "No Extra Baggage",
    weight: 0,
    price: 0,
  },
  {
    id: "15kg",
    name: "15 kg",
    weight: 15,
    price: 25000,
  },
  {
    id: "23kg",
    name: "23 kg",
    weight: 23,
    price: 40000,
  },
  {
    id: "32kg",
    name: "32 kg",
    weight: 32,
    price: 60000,
  },
];

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
}

interface BaggageSelectionProps {
  passengers: Passenger[];
  currency?: string;
  onChange?: (
    selections: Record<string, string>,
  ) => void;
}

export default function BaggageSelection({
  passengers,
  currency = "NGN",
  onChange,
}: BaggageSelectionProps) {
  const [selections, setSelections] =
    useState<Record<string, string>>({});

  const handleSelectBaggage = (
    passengerId: string,
    baggageId: string,
  ) => {
    const updatedSelections = {
      ...selections,
      [passengerId]: baggageId,
    };

    setSelections(updatedSelections);

    onChange?.(updatedSelections);
  };

  const getSelectedBaggage = (
    passengerId: string,
  ) => {
    const selectedId =
      selections[passengerId];

    return BAGGAGE_OPTIONS.find(
      (option) =>
        option.id === selectedId,
    );
  };

  return (
    <section className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <Luggage className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Baggage Selection
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose baggage for each passenger.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {passengers.map((passenger) => {
          const selectedBaggage =
            getSelectedBaggage(
              passenger.id,
            );

          return (
            <motion.div
              key={passenger.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Passenger
                </p>

                <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {passenger.firstName}{" "}
                  {passenger.lastName}
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {BAGGAGE_OPTIONS.map(
                  (option) => {
                    const isSelected =
                      selectedBaggage?.id ===
                      option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleSelectBaggage(
                            passenger.id,
                            option.id,
                          )
                        }
                        className={`relative rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-500/10"
                            : "border-slate-200 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-700"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <Luggage className="h-5 w-5 text-sky-600 dark:text-sky-400" />

                        <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">
                          {option.name}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {option.weight === 0
                            ? "No additional baggage"
                            : `Up to ${option.weight} kg`}
                        </p>

                        <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                          {option.price === 0
                            ? "Included"
                            : formatCurrency(
                                option.price,
                                currency,
                              )}
                        </p>
                      </button>
                    );
                  },
                )}
              </div>

              {selectedBaggage && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Selected baggage
                      </p>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedBaggage.name}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedBaggage.price ===
                      0
                        ? "Included"
                        : formatCurrency(
                            selectedBaggage.price,
                            currency,
                          )}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}