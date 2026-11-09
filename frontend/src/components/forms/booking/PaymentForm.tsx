"use client";

import { useState, type FormEvent } from "react";
import { CircleDollarSign, Info } from "lucide-react";
import Select from "../Select";
import PrimaryButton from "../../buttons/PrimaryButton";
import FormError from "../FormError";

export type DemoPaymentOutcome = "approved" | "declined" | "error";
export type DemoPaymentMethod = "demo-wallet" | "demo-bank-transfer";

export interface PaymentFormData {
  paymentMethod: DemoPaymentMethod;
  outcome: DemoPaymentOutcome;
}

interface PaymentFormProps {
  onSubmit?: (data: PaymentFormData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  showSubmitButton?: boolean;
}

export default function PaymentForm({
  onSubmit,
  loading = false,
  error,
  className = "",
  showSubmitButton = true,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<DemoPaymentMethod>("demo-wallet");
  const [outcome, setOutcome] =
    useState<DemoPaymentOutcome | "">("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (outcome) {
      onSubmit?.({ paymentMethod, outcome });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6 flex items-start gap-3">
        <CircleDollarSign
          className="mt-1 h-6 w-6 shrink-0 text-sky-700"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Simulated demo payment
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            No money is charged. Do not enter card numbers, CVVs, PINs, or
            banking credentials.
          </p>
        </div>
      </div>

      <div
        role="note"
        className="mb-5 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"
      >
        <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
        Choose a simulated payment method and an explicit test outcome.
      </div>

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <div className="space-y-5">
        <Select
          id="demo-payment-method"
          label="Demo payment method"
          value={paymentMethod}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "demo-wallet" || value === "demo-bank-transfer") {
              setPaymentMethod(value);
            }
          }}
          options={[
            { label: "Demo wallet", value: "demo-wallet" },
            { label: "Demo bank transfer", value: "demo-bank-transfer" },
          ]}
          required
        />

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-slate-900">
            Simulated result
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["approved", "Approved"],
                ["declined", "Declined"],
                ["error", "Technical failure"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name="demo-payment-outcome"
                  value={value}
                  checked={outcome === value}
                  onChange={() => setOutcome(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {showSubmitButton && (
        <div className="mt-6 flex justify-end">
          <PrimaryButton
            type="submit"
            loading={loading}
            disabled={loading || !outcome}
          >
            Run simulated payment
          </PrimaryButton>
        </div>
      )}
    </form>
  );
}
