"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
CreditCard,
ReceiptText,
} from "lucide-react";

export interface PaymentDetailsData {
demoOnly?: boolean;
paymentMethod?: string;
paymentStatus?: string;
transactionId?: string;
currency?: string;
subtotal?: number;
taxes?: number;
fees?: number;
total?: number;
}

interface PaymentDetailsProps {
payment?: PaymentDetailsData;
}

const formatAmount = (
amount?: number,
currency = "USD"
) => {
if (amount === undefined) {
return "—";
}

try {
return new Intl.NumberFormat("en-US", {
style: "currency",
currency,
}).format(amount);
} catch {
return `${currency} ${amount.toLocaleString()}`;
}
};

const getStatusClasses = (status?: string) => {
const normalized = status
?.trim()
.toLowerCase();

if (
normalized === "paid" ||
normalized === "completed" ||
normalized === "successful" ||
normalized === "success"
) {
return {
container:
"bg-emerald-50 text-emerald-700",
icon: "text-emerald-600",
};
}

if (
normalized === "pending" ||
normalized === "processing"
) {
return {
container:
"bg-amber-50 text-amber-700",
icon: "text-amber-600",
};
}

if (
normalized === "failed" ||
normalized === "cancelled" ||
normalized === "canceled"
) {
return {
container:
"bg-red-50 text-red-700",
icon: "text-red-600",
};
}

return {
container:
"bg-slate-100 text-slate-600",
icon: "text-slate-500",
};
};

export default function PaymentDetails({
payment,
}: PaymentDetailsProps) {
const statusClasses = getStatusClasses(
payment?.paymentStatus
);

return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <CreditCard className="h-5 w-5" /> </div>

```
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Payment Details
        </h2>

        <p className="text-sm text-slate-500">
          {payment?.demoOnly
            ? "Frontend-only demo payment record"
            : "Payment and booking charges"}
        </p>
      </div>
    </div>
  </div>

  {!payment ? (
    <div className="px-5 py-10 text-center sm:px-6">
      <ReceiptText className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-3 text-sm font-medium text-slate-700">
        No payment information available
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Payment details will appear here when available.
      </p>
    </div>
  ) : (
    <div className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">
            Payment Status
          </p>

          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses.container}`}
          >
            <CheckCircle2
              className={`h-3.5 w-3.5 ${statusClasses.icon}`}
            />

            {payment.paymentStatus || "Unknown"}
          </span>
        </div>

        {payment.paymentMethod && (
          <div className="sm:text-right">
            <p className="text-xs text-slate-400">
              Payment Method
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {payment.paymentMethod}
            </p>
          </div>
        )}
      </div>

      {payment.transactionId && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs text-slate-400">
            {payment.demoOnly ? "Demo reference" : "Transaction ID"}
          </p>

          <p className="mt-1 break-all text-sm font-medium text-slate-700">
            {payment.transactionId}
          </p>
        </div>
      )}

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {payment.subtotal !== undefined && (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-700">
              {formatAmount(
                payment.subtotal,
                payment.currency
              )}
            </span>
          </div>
        )}

        {payment.taxes !== undefined && (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">
              Taxes
            </span>

            <span className="font-medium text-slate-700">
              {formatAmount(
                payment.taxes,
                payment.currency
              )}
            </span>
          </div>
        )}

        {payment.fees !== undefined && (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">
              Fees
            </span>

            <span className="font-medium text-slate-700">
              {formatAmount(
                payment.fees,
                payment.currency
              )}
            </span>
          </div>
        )}

        {payment.total !== undefined && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-slate-900">
              Total
            </span>

            <span className="text-lg font-bold text-slate-900">
              {formatAmount(
                payment.total,
                payment.currency
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )}
</motion.section>


);
}
