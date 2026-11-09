"use client";

import { useState, type FormEvent } from "react";
import { CircleDollarSign, Info, X } from "lucide-react";
import type {
  PaymentMethod,
  PaymentMethodType,
} from "./payment-method-data/PaymentMethodData";

interface PaymentMethodFormProps {
  initialData?: PaymentMethod | null;
  onSubmit: (
    paymentMethod: Omit<PaymentMethod, "id" | "isDefault">,
  ) => void;
  onCancel: () => void;
}

const demoCards: Record<
  PaymentMethodType,
  { brand: string; lastFour: string }
> = {
  visa: { brand: "Visa (demo)", lastFour: "4242" },
  mastercard: { brand: "Mastercard (demo)", lastFour: "8210" },
  amex: { brand: "American Express (demo)", lastFour: "1005" },
};

export default function PaymentMethodForm({
  initialData,
  onSubmit,
  onCancel,
}: PaymentMethodFormProps) {
  const [type, setType] = useState<PaymentMethodType>(
    initialData?.type ?? "visa",
  );
  const isEditing = Boolean(initialData);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const demoCard = demoCards[type];

    onSubmit({
      type,
      brand: demoCard.brand,
      lastFour: demoCard.lastFour,
      expiryMonth: "12",
      expiryYear: "2099",
      cardholderName: "DEMO ONLY",
      demoOnly: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-950">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Demo payment method only</p>
          <p className="mt-1 text-xs leading-5">
            This saves synthetic demo metadata in the current session. No card
            number, security code, PIN, expiry details, or real payment
            credentials are requested or stored.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="demo-payment-card-type"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Simulated card brand
        </label>
        <select
          id="demo-payment-card-type"
          value={type}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "visa" || value === "mastercard" || value === "amex") {
              setType(value);
            }
          }}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="visa">Visa demo</option>
          <option value="mastercard">Mastercard demo</option>
          <option value="amex">American Express demo</option>
        </select>
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CircleDollarSign className="h-4 w-4" aria-hidden="true" />
        Synthetic demo suffix: •••• {demoCards[type].lastFour}
      </p>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isEditing ? "Update demo method" : "Add demo method"}
        </button>
      </div>
    </form>
  );
}
