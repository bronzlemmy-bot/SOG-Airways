
"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  RotateCcw,
  X,
} from "lucide-react";

import PaymentCard from "@/components/admin/payments/PaymentCard";
import PaymentDetails from "@/components/admin/payments/PaymentDetails";
import PaymentFilters, {
  type PaymentFilterValues,
} from "@/components/admin/payments/PaymentFilters";
import PaymentHeader from "@/components/admin/payments/PaymentHeader";
import PaymentStats from "@/components/admin/payments/PaymentStats";
import PaymentTable from "@/components/admin/payments/PaymentTable";

import {
  adminPaymentData,
  type AdminPayment,
  type PaymentStatus,
} from "@/components/admin/payments/admin-payments-data/PaymentsData";

import {
  usePaymentStore,
  usePaymentStoreSnapshot,
} from "@/features/payment/PaymentStoreProvider";

import type { Payment } from "@/types/payment";

const initialFilters: PaymentFilterValues = {
  search: "",
  status: "all",
  paymentMethod: "all",
  currency: "all",
  sortBy: "newest",
};

function formatDate(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toISOString().split("T")[0];
}

function toAdminPayment(
  payment: Payment,
  statusOverride?: PaymentStatus,
): AdminPayment {
  return {
    id: payment.id,
    paymentId: payment.paymentReference,
    bookingId: payment.bookingId,
    passengerId: payment.userId,
    passengerName: "Demo passenger",
    passengerEmail: "",
    amount: payment.amount,
    currency: payment.currency,
    paymentMethod: payment.methodType,
    status: statusOverride ?? payment.status,
    transactionReference: payment.paymentReference,
    description: `Payment for booking ${payment.bookingId}`,
    paymentDate: formatDate(payment.paidAt ?? payment.createdAt),
    createdAt: formatDate(payment.createdAt),
    updatedAt: formatDate(payment.updatedAt),
  } as unknown as AdminPayment;
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export default function PaymentsPage() {
  const paymentStore = usePaymentStore();
  const storeSnapshot = usePaymentStoreSnapshot();

  const [payments, setPayments] =
    useState<AdminPayment[]>(adminPaymentData);

  const [statusOverrides, setStatusOverrides] =
    useState<Record<string, PaymentStatus>>({});

  const [filters, setFilters] =
    useState<PaymentFilterValues>(initialFilters);

  const [selectedPayment, setSelectedPayment] =
    useState<AdminPayment | null>(null);

  const [refundPayment, setRefundPayment] =
    useState<AdminPayment | null>(null);

  const [showRefundModal, setShowRefundModal] =
    useState(false);

  const [refundError, setRefundError] = useState("");

  const [exporting, setExporting] = useState(false);

  const storePayments = useMemo(
    () =>
      storeSnapshot.payments.map((payment) =>
        toAdminPayment(payment, statusOverrides[payment.id]),
      ),
    [storeSnapshot.payments, statusOverrides],
  );

  const allPayments = useMemo(() => {
    const combined = [...payments];

    const knownIdentifiers = new Set(
      payments.flatMap((payment) => [
        payment.id,
        payment.paymentId,
        payment.transactionReference,
      ]),
    );

    for (const payment of storePayments) {
      const identifiers = [
        payment.id,
        payment.paymentId,
        payment.transactionReference,
      ];

      const alreadyExists = identifiers.some(
        (identifier) =>
          identifier && knownIdentifiers.has(identifier),
      );

      if (alreadyExists) continue;

      combined.push(payment);

      identifiers.forEach((identifier) => {
        if (identifier) {
          knownIdentifiers.add(identifier);
        }
      });
    }

    return combined;
  }, [payments, storePayments]);

  const filteredPayments = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    const result = allPayments.filter((payment) => {
      const matchesSearch =
        !searchTerm ||
        payment.paymentId.toLowerCase().includes(searchTerm) ||
        payment.bookingId.toLowerCase().includes(searchTerm) ||
        payment.passengerId.toLowerCase().includes(searchTerm) ||
        payment.passengerName.toLowerCase().includes(searchTerm) ||
        payment.passengerEmail.toLowerCase().includes(searchTerm) ||
        payment.transactionReference.toLowerCase().includes(searchTerm);

      const matchesStatus =
        filters.status === "all" ||
        payment.status === filters.status;

      const matchesPaymentMethod =
        filters.paymentMethod === "all" ||
        payment.paymentMethod === filters.paymentMethod;

      const matchesCurrency =
        filters.currency === "all" ||
        payment.currency === filters.currency;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentMethod &&
        matchesCurrency
      );
    });

    return [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return (
            new Date(a.paymentDate).getTime() -
            new Date(b.paymentDate).getTime()
          );

        case "amount-high":
          return b.amount - a.amount;

        case "amount-low":
          return a.amount - b.amount;

        case "name-asc":
          return a.passengerName.localeCompare(b.passengerName);

        case "name-desc":
          return b.passengerName.localeCompare(a.passengerName);

        case "newest":
        default:
          return (
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
          );
      }
    });
  }, [allPayments, filters]);

  // PaymentTable and PaymentCard pass a payment ID string here.
  const handleStatusChange = (
    paymentId: string,
    status: PaymentStatus,
  ) => {
    const payment = allPayments.find(
      (item) =>
        item.id === paymentId ||
        item.paymentId === paymentId ||
        item.transactionReference === paymentId,
    );

    if (!payment) return;

    const updatedAt = new Date().toISOString().split("T")[0];

    const storePayment = storeSnapshot.payments.find(
      (item) =>
        item.id === payment.id ||
        item.id === paymentId ||
        item.paymentReference === payment.paymentId ||
        item.paymentReference === payment.transactionReference,
    );

    if (storePayment) {
      setStatusOverrides((current) => ({
        ...current,
        [storePayment.id]: status,
      }));
    } else {
      setPayments((currentPayments) =>
        currentPayments.map((currentPayment) =>
          currentPayment.id === payment.id
            ? {
                ...currentPayment,
                status,
                updatedAt,
              }
            : currentPayment,
        ),
      );
    }

    setSelectedPayment((currentPayment) =>
      currentPayment?.id === payment.id
        ? {
            ...currentPayment,
            status,
            updatedAt,
          }
        : currentPayment,
    );
  };

  const handleRefundRequest = (payment: AdminPayment) => {
    setRefundPayment(payment);
    setRefundError("");
    setShowRefundModal(true);
  };

  const closeRefundModal = () => {
    setRefundPayment(null);
    setRefundError("");
    setShowRefundModal(false);
  };

  const handleConfirmRefund = () => {
    if (!refundPayment) return;

    const storePayment = storeSnapshot.payments.find(
      (item) =>
        item.id === refundPayment.id ||
        item.paymentReference === refundPayment.paymentId ||
        item.paymentReference === refundPayment.transactionReference,
    );

    // Shared-store payment: execute the actual in-memory demo refund.
    if (storePayment) {
      const result = paymentStore.refundPayment(storePayment.id);

      if (!result.success) {
        setRefundError(result.message);
        return;
      }

      setStatusOverrides((current) => {
        const next = { ...current };
        delete next[storePayment.id];
        return next;
      });

      setSelectedPayment((currentPayment) =>
        currentPayment?.id === refundPayment.id
          ? toAdminPayment(result.payment)
          : currentPayment,
      );

      closeRefundModal();
      return;
    }

    // Legacy sample payment: update only the page's local demo state.
    const updatedAt = new Date().toISOString().split("T")[0];

    setPayments((currentPayments) =>
      currentPayments.map((payment) =>
        payment.id === refundPayment.id
          ? {
              ...payment,
              status: "refunded",
              updatedAt,
            }
          : payment,
      ),
    );

    setSelectedPayment((currentPayment) =>
      currentPayment?.id === refundPayment.id
        ? {
            ...currentPayment,
            status: "refunded",
            updatedAt,
          }
        : currentPayment,
    );

    closeRefundModal();
  };

  const handleExport = () => {
    if (filteredPayments.length === 0 || exporting) return;

    setExporting(true);

    const headers = [
      "Payment ID",
      "Booking ID",
      "Passenger ID",
      "Passenger Name",
      "Passenger Email",
      "Amount",
      "Currency",
      "Payment Method",
      "Status",
      "Transaction Reference",
      "Description",
      "Payment Date",
      "Created At",
      "Updated At",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.paymentId,
      payment.bookingId,
      payment.passengerId,
      payment.passengerName,
      payment.passengerEmail,
      payment.amount,
      payment.currency,
      payment.paymentMethod,
      payment.status,
      payment.transactionReference,
      payment.description,
      payment.paymentDate,
      payment.createdAt,
      payment.updatedAt,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `sog-airways-payments-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.setTimeout(() => {
      setExporting(false);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <PaymentHeader
          totalPayments={allPayments.length}
          onExport={handleExport}
        />

        <div
          role="note"
          className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
        >
          <strong>DEMO PAYMENTS ONLY.</strong> These sample records and any
          status or refund changes are held in frontend memory. They are not
          externally verified, and no real money is charged or refunded.
        </div>

        <PaymentStats payments={allPayments} />

        <PaymentFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Payment Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredPayments.length} of {allPayments.length} payments displayed.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={filteredPayments.length === 0 || exporting}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>

          <div className="hidden lg:block">
            <PaymentTable
              payments={filteredPayments}
              onView={setSelectedPayment}
              onStatusChange={handleStatusChange}
              onRefund={handleRefundRequest}
            />
          </div>


<div className="lg:hidden" >
  <div className="space-y-4">
    {filteredPayments.map((payment) => (
      <PaymentCard
        key={payment.id}
        payment={payment}
        onView={setSelectedPayment}
        onStatusChange={handleStatusChange}
        onRefund={handleRefundRequest}
      />
    ))}
  </div>
</div>

        </section>
      </div>

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPayment(null);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl">
            <button
              type="button"
              onClick={() => setSelectedPayment(null)}
              aria-label="Close payment details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-900 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <PaymentDetails
              payment={selectedPayment}
              onClose={() => setSelectedPayment(null)}
            />
          </div>
        </div>
      )}

      {showRefundModal && refundPayment && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRefundModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-payment-title"
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <RotateCcw className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2
                  id="refund-payment-title"
                  className="text-lg font-black text-slate-900 dark:text-white"
                >
                  Refund Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Confirm that you want to refund{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {refundPayment.paymentId}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Passenger
                </span>

                <span className="text-right text-sm font-semibold text-slate-900 dark:text-white">
                  {refundPayment.passengerName}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Booking
                </span>

                <span className="text-right text-sm font-semibold text-slate-900 dark:text-white">
                  {refundPayment.bookingId}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Amount
                </span>

                <span className="text-right text-sm font-bold text-slate-900 dark:text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: refundPayment.currency,
                  }).format(refundPayment.amount)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                Demo mode: refunds update the shared in-memory payment
                store when a matching store payment exists. Legacy sample
                payments update this page&apos;s demo state only. No real
                money is transferred.
              </p>
            </div>

            {refundError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
              >
                {refundError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRefundModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Keep Payment
              </button>

              <button
                type="button"
                onClick={handleConfirmRefund}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
