
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface SupportConfirmationProps {
  ticketId?: string;
  subject?: string;
  isDemo?: boolean;
  onBack?: () => void;
}

export default function SupportConfirmation({
  ticketId,
  subject,
  isDemo = false,
  onBack,
}: SupportConfirmationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[22rem] items-center justify-center"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:p-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.35,
            type: "spring",
            stiffness: 180,
          }}
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            isDemo
              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          }`}
        >
          {isDemo ? (
            <MessageSquare className="h-8 w-8" />
          ) : (
            <CheckCircle2 className="h-8 w-8" />
          )}
        </motion.div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isDemo
            ? "Demo support request created"
            : "Support request submitted"}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
          {isDemo
            ? "Your sample support request has been added to this session only. It has not been delivered to the SOG Airways support team."
            : "Your support request was submitted successfully. Keep your ticket reference so you can follow up on your request."}
        </p>

        {(ticketId || subject) && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-950/50">
            {ticketId && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  <MessageSquare className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Ticket ID
                  </p>

                  <p className="mt-0.5 break-all text-sm font-semibold text-slate-900 dark:text-white">
                    {ticketId}
                  </p>
                </div>
              </div>
            )}

            {subject && (
              <div
                className={
                  ticketId
                    ? "mt-4 border-t border-slate-200 pt-4 dark:border-slate-800"
                    : ""
                }
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Subject
                </p>

                <p className="mt-0.5 break-words text-sm font-semibold text-slate-900 dark:text-white">
                  {subject}
                </p>
              </div>
            )}
          </div>
        )}

        {onBack && (
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
