"use client";

import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { PaymentMethod } from "./payment-method-data/PaymentMethodData";

interface PaymentMethodActionProps {
paymentMethod: PaymentMethod;
onSetDefault: (id: string) => void;
onEdit: (paymentMethod: PaymentMethod) => void;
onRemove: (id: string) => void;
}

export default function PaymentMethodAction({
paymentMethod,
onSetDefault,
onEdit,
onRemove,
}: PaymentMethodActionProps) {
const [isOpen, setIsOpen] = useState(false);

const handleAction = (action: () => void) => {
action();
setIsOpen(false);
};

return ( <div className="relative self-end sm:self-auto">
<motion.button
type="button"
whileHover={{ scale: 1.04 }}
whileTap={{ scale: 0.96 }}
onClick={() => setIsOpen((previous) => !previous)}
aria-label={`Actions for ${paymentMethod.brand} ending in ${paymentMethod.lastFour}`}
aria-expanded={isOpen}
className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
> <MoreHorizontal className="h-5 w-5" />
</motion.button>


  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl"
        >
          {!paymentMethod.isDefault && (
            <button
              type="button"
              onClick={() =>
                handleAction(() => onSetDefault(paymentMethod.id))
              }
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Star className="h-4 w-4 text-primary" />
              Set as Default
            </button>
          )}

          <button
            type="button"
            onClick={() => handleAction(() => onEdit(paymentMethod))}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
            Edit Payment Method
          </button>

          {!paymentMethod.isDefault && (
            <button
              type="button"
              onClick={() => handleAction(() => onRemove(paymentMethod.id))}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Remove Payment Method
            </button>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>


);
}
