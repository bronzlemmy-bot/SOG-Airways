"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { PaymentMethod } from "./payment-method-data/PaymentMethodData";
import PaymentMethodAction from "./PaymentMethodActions";

interface PaymentMethodCardProps {
paymentMethod: PaymentMethod;
onSetDefault: (id: string) => void;
onEdit: (paymentMethod: PaymentMethod) => void;
onRemove: (id: string) => void;
}

export default function PaymentMethodCard({
paymentMethod,
onSetDefault,
onEdit,
onRemove,
}: PaymentMethodCardProps) {
const cardTypeClasses = {
visa: "from-blue-600 via-blue-700 to-indigo-900",
mastercard: "from-slate-700 via-slate-800 to-black",
amex: "from-cyan-600 via-sky-700 to-blue-900",
};

return (
<motion.article
layout
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.97 }}
transition={{ duration: 0.3 }}
className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
>
<div
className={`relative overflow-hidden bg-linear-to-br p-5 text-white sm:p-6 ${cardTypeClasses[paymentMethod.type]}`}
> <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" /> <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />


    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
          {paymentMethod.brand}
        </p>

        <div className="mt-8 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-white/80" />

          <p className="font-mono text-lg tracking-[0.2em] sm:text-xl">
            •••• •••• •••• {paymentMethod.lastFour}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">
          Demo only
        </span>
        {paymentMethod.isDefault && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            Default
          </span>
        )}
      </div>
    </div>

    <div className="relative mt-7 flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-white/60">
          Cardholder
        </p>
        <p className="mt-1 text-sm font-medium">
          {paymentMethod.cardholderName}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-white/60">
          Expires
        </p>
        <p className="mt-1 text-sm font-medium">
          {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
        </p>
      </div>
    </div>
  </div>

  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <ShieldCheck className="h-4 w-4 text-primary" />
      <span>Synthetic demo record — not a real card</span>
    </div>

    <PaymentMethodAction
      paymentMethod={paymentMethod}
      onSetDefault={onSetDefault}
      onEdit={onEdit}
      onRemove={onRemove}
    />
  </div>
</motion.article>


);
}
