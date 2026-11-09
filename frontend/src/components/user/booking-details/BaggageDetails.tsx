"use client";

import { motion } from "framer-motion";
import {
BriefcaseBusiness,
CheckCircle2,
Luggage,
Package,
} from "lucide-react";

export interface BaggageDetailsData {
id?: string;
type?: string;
description?: string;
quantity?: number;
weight?: number;
weightUnit?: string;
included?: boolean;
}

interface BaggageDetailsProps {
baggage: BaggageDetailsData[];
}

export default function BaggageDetails({
baggage,
}: BaggageDetailsProps) {
return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <Luggage className="h-5 w-5" /> </div>

```
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Baggage Details
        </h2>

        <p className="text-sm text-slate-500">
          Baggage allowance and information
        </p>
      </div>
    </div>
  </div>

  {baggage.length === 0 ? (
    <div className="px-5 py-10 text-center sm:px-6">
      <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-3 text-sm font-medium text-slate-700">
        No baggage information available
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Baggage details will appear here when available.
      </p>
    </div>
  ) : (
    <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
      {baggage.map((item, index) => (
        <motion.article
          key={item.id || index}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: Math.min(index * 0.06, 0.3),
          }}
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                <Package className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.type || "Baggage"}
                </h3>

                {item.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {item.included && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Included
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
            <div>
              <p className="text-xs text-slate-400">
                Quantity
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {item.quantity !== undefined
                  ? item.quantity
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Weight
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {item.weight !== undefined
                  ? `${item.weight} ${
                      item.weightUnit || ""
                    }`.trim()
                  : "—"}
              </p>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )}
</motion.section>


);
}
