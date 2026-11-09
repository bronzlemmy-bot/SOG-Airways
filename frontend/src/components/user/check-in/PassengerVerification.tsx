"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
CheckCircle2,
Mail,
Phone,
ShieldCheck,
UserRound,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Checkbox from "@/components/forms/Checkbox";


export interface PassengerVerificationData {
id: string;
title?: string;
firstName: string;
lastName: string;
email?: string;
phone?: string;
passengerType?: string;
}

interface PassengerVerificationProps {
passenger: PassengerVerificationData;
verified?: boolean;
onVerificationChange?: (verified: boolean) => void;
}

export default function PassengerVerification({
passenger,
verified = false,
onVerificationChange,
}: PassengerVerificationProps) {
const [isVerified, setIsVerified] = useState(verified);

const handleVerificationChange = (value: boolean) => {
setIsVerified(value);
onVerificationChange?.(value);
};

const fullName = [passenger.title, passenger.firstName, passenger.lastName]
.filter(Boolean)
.join(" ");

return (
<motion.div
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
> <Card className="overflow-hidden"> <div className="border-b border-slate-200 px-5 py-5 sm:px-6"> <div className="flex items-start gap-4"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"> <ShieldCheck className="h-5 w-5" /> </div>

```
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Passenger Verification
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Confirm that the passenger information below is correct before
            continuing with check-in.
          </p>
        </div>
      </div>
    </div>

    <div className="p-5 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {fullName}
                </h3>

                {passenger.passengerType && (
                  <p className="mt-1 text-sm text-slate-500">
                    {passenger.passengerType}
                  </p>
                )}
              </div>

              {isVerified && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {passenger.email && (
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Email
                    </p>
                    <p className="truncate text-sm font-medium text-slate-700">
                      {passenger.email}
                    </p>
                  </div>
                </div>
              )}

              {passenger.phone && (
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Phone
                    </p>
                    <p className="truncate text-sm font-medium text-slate-700">
                      {passenger.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <Checkbox
          checked={isVerified}
          onChange={(event) =>
            handleVerificationChange(event.target.checked)
          }
          label="I confirm that the passenger information above is correct."
        />
      </div>
    </div>
  </Card>
</motion.div>


);
}
