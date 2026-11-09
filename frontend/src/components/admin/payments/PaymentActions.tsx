"use client";

import { useState } from "react";
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type { AdminPayment } from "./admin-payments-data/PaymentsData";

interface PaymentActionsProps {
  payment: AdminPayment;
  onView: (payment: AdminPayment) => void;
  onStatusChange: (
    paymentId: string,
    status: AdminPayment["status"],
  ) => void;
  onRefund: (payment: AdminPayment) => void;
}

export default function PaymentActions({
  payment,
  onView,
  onStatusChange,
  onRefund,
}: PaymentActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const canComplete = ["pending", "processing"].includes(payment.status);
  const canFail = ["pending", "processing"].includes(payment.status);
  const canCancel = ["pending", "processing"].includes(payment.status);

  const canRefund =
    ["completed", "successful"].includes(payment.status) &&
    (payment.amount > 0);

  const closeMenu = () => setMenuOpen(false);

  const handleAction = (action: () => void) => {
    action();
    closeMenu();
  };

  const actionClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800";

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onView(payment)}
        aria-label={`View payment ${payment.paymentId}`}
        title="View payment"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-sky-500/10 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
      >
        <Eye className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="More payment actions"
          aria-expanded={menuOpen}
          title="More actions"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close actions menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={closeMenu}
            />

            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => handleAction(() => onView(payment))}
                className={actionClass}
              >
                <Eye className="h-4 w-4" />
                View details
              </button>

              {canComplete && (
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() =>
                      onStatusChange(payment.paymentId, "completed"),
                    )
                  }
                  className={`${actionClass} text-emerald-600 dark:text-emerald-400`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark completed
                </button>
              )}

              {canRefund && (
                <button
                  type="button"
                  onClick={() => handleAction(() => onRefund(payment))}
                  className={`${actionClass} text-blue-600 dark:text-blue-400`}
                >
                  <RotateCcw className="h-4 w-4" />
                  Refund payment
                </button>
              )}

              {canFail && (
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() =>
                      onStatusChange(payment.paymentId, "failed"),
                    )
                  }
                  className={`${actionClass} text-red-600 dark:text-red-400`}
                >
                  <XCircle className="h-4 w-4" />
                  Mark failed
                </button>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() =>
                      onStatusChange(payment.paymentId, "cancelled"),
                    )
                  }
                  className={`${actionClass} text-slate-600 dark:text-slate-300`}
                >
                  <Ban className="h-4 w-4" />
                  Cancel payment
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}