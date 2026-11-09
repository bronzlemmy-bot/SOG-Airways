
"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  LoaderCircle,
  Mail,
  RotateCcw,
} from "lucide-react";


import type { Payment } from "@/types";
import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import DangerButton from "@/components/buttons/DangerButton";

interface PaymentActionsProps {
  payment: Payment;
  onViewReceipt: (payment: Payment) => void;
  onDownloadReceipt: (payment: Payment) => void | Promise<void>;
  onSendConfirmation: (payment: Payment) => void | Promise<void>;
  onRefund: (payment: Payment) => void | Promise<void>;
}

export default function PaymentActions({
  payment,
  onViewReceipt,
  onDownloadReceipt,
  onSendConfirmation,
  onRefund,
}: PaymentActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isBusy = activeAction !== null;
  const canRefund =
    payment.status === "successful" ||
    payment.status === "partially-refunded";

  async function runAction(
    action: string,
    callback: (payment: Payment) => void | Promise<void>,
  ) {
    if (isBusy) return;

    setActiveAction(action);
    setMessage(null);

    try {
      await callback(payment);

      const successMessages: Record<string, string> = {
        download: "Receipt download action completed.",
        confirmation: "Confirmation action completed.",
        refund: "Refund action completed.",
      };

      setMessage(successMessages[action] ?? "Action completed.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The action could not be completed. Please try again.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <section
      aria-label="Payment actions"
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Payment Actions
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage receipt access, payment confirmation, and eligible refunds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OutlineButton
          onClick={() => {
            setMessage(null);
            onViewReceipt(payment);
          }}
          disabled={isBusy}
        >
          <Eye className="mr-2 h-4 w-4" />
          View receipt
        </OutlineButton>

        <OutlineButton
          onClick={() => runAction("download", onDownloadReceipt)}
          disabled={isBusy}
        >
          {activeAction === "download" ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download receipt
        </OutlineButton>

        <PrimaryButton
          onClick={() => runAction("confirmation", onSendConfirmation)}
          disabled={isBusy}
        >
          {activeAction === "confirmation" ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send confirmation
        </PrimaryButton>

        <DangerButton
          onClick={() => runAction("refund", onRefund)}
          disabled={isBusy || !canRefund}
        >
          {activeAction === "refund" ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          {payment.status === "partially-refunded"
            ? "Continue refund"
            : "Process refund"}
        </DangerButton>
      </div>

      {!canRefund && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Refunds are available only for successful or partially refunded
          payments.
        </p>
      )}

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          {message}
        </p>
      )}
    </section>
  );
}
