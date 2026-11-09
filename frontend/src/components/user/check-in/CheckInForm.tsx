"use client";

import { FormEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";

interface CheckInFormProps {
children?: ReactNode;
isSubmitting?: boolean;
isCompleted?: boolean;
canSubmit?: boolean;
onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
onCancel?: () => void;
}

export default function CheckInForm({
children,
isSubmitting = false,
isCompleted = false,
canSubmit = true,
onSubmit,
onCancel,
}: CheckInFormProps) {
return (
<motion.form
onSubmit={onSubmit}
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="space-y-6"
> <Card className="overflow-hidden"> <div className="border-b border-slate-200 px-5 py-5 sm:px-6"> <div className="flex items-start gap-4"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"> <ClipboardCheck className="h-5 w-5" /> </div>

```
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Complete Your Check-In
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Review your passenger information and complete each required
            step before confirming your check-in.
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-6 p-5 sm:p-6">{children}</div>
  </Card>

  <Card className="border-slate-200">
    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {isCompleted
              ? "Check-in completed"
              : "Ready to complete check-in?"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {isCompleted
              ? "Your check-in has been completed successfully."
              : "Make sure all passenger, seat, and baggage details are correct before continuing."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onCancel && (
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </SecondaryButton>
        )}

        <PrimaryButton
          type="submit"
          disabled={!canSubmit || isSubmitting || isCompleted}
        >
          {isSubmitting
            ? "Processing..."
            : isCompleted
              ? "Check-In Completed"
              : "Complete Check-In"}
        </PrimaryButton>
      </div>
    </div>
  </Card>
</motion.form>


);
}
