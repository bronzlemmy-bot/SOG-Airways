"use client";

import { CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { PaymentMethod } from "./payment-method-data/PaymentMethodData";
import PaymentMethodCard from "./PaymentMethodCard";

interface PaymentMethodListProps {
paymentMethods: PaymentMethod[];
onSetDefault: (id: string) => void;
onEdit: (paymentMethod: PaymentMethod) => void;
onRemove: (id: string) => void;
}

export default function PaymentMethodList({
paymentMethods,
onSetDefault,
onEdit,
onRemove,
}: PaymentMethodListProps) {
if (paymentMethods.length === 0) {
return (
<motion.div
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
> <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"> <CreditCard className="h-7 w-7" /> </div>

```
    <h2 className="mt-4 text-lg font-semibold text-foreground">
      No payment methods yet
    </h2>

    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      Add a payment method to make your future SOG Airways bookings faster
      and easier to pay for.
    </p>
  </motion.div>
);


}

return ( <section aria-labelledby="saved-payment-methods"> <div className="mb-4 flex items-center justify-between gap-4"> <div> <h2
         id="saved-payment-methods"
         className="text-lg font-semibold text-foreground"
       >
Saved Payment Methods </h2>


      <p className="mt-1 text-sm text-muted-foreground">
        {paymentMethods.length}{" "}
        {paymentMethods.length === 1 ? "payment method" : "payment methods"}{" "}
        saved
      </p>
    </div>
  </div>

  <motion.div layout className="grid gap-5 lg:grid-cols-2">
    <AnimatePresence mode="popLayout">
      {paymentMethods.map((paymentMethod) => (
        <PaymentMethodCard
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          onSetDefault={onSetDefault}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </AnimatePresence>
  </motion.div>
</section>


);
}
