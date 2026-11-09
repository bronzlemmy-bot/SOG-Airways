"use client";

import { CreditCard, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentMethodHeaderProps {
onAddPaymentMethod: () => void;
}

export default function PaymentMethodHeader({
onAddPaymentMethod,
}: PaymentMethodHeaderProps) {
return (
<motion.div
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
> <div className="flex items-start gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"> <CreditCard className="h-6 w-6" /> </div>


    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Payment Methods
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Manage your saved payment methods and choose how you pay for your
        SOG Airways bookings.
      </p>
    </div>
  </div>

  <motion.button
    type="button"
    onClick={onAddPaymentMethod}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto"
  >
    <Plus className="h-4 w-4" />
    Add Payment Method
  </motion.button>
</motion.div>


);
}
