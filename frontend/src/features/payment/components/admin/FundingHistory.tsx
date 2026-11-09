"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, CalendarDays, Search, Wallet } from "lucide-react";
;
import { formatCurrency } from "@/lib/formatters/currency";

export interface FundingRecord {
  id: string;
  reference: string;
  type: "replenishment" | "booking-charge" | "refund" | "reversal";
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  status: "successful" | "pending" | "failed";
}

interface FundingHistoryProps {
  records: FundingRecord[];
  loading?: boolean;
  onViewRecord?: (record: FundingRecord) => void;
}

const TYPE_LABELS: Record<FundingRecord["type"], string> = {
  replenishment: "Demo balance replenishment",
  "booking-charge": "Booking charge",
  refund: "Refund",
  reversal: "Reversal",
};

const STATUS_STYLES: Record<FundingRecord["status"], string> = {
  successful: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

function displayDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function displayAmount(record: FundingRecord): string {
  try {
    return formatCurrency(record.amount, record.currency);
  } catch {
    return `${record.currency} ${record.amount.toLocaleString()}`;
  }
}

export default function FundingHistory({
  records,
  loading = false,
  onViewRecord,
}: FundingHistoryProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FundingRecord["type"] | "all">("all");

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.reference.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        TYPE_LABELS[record.type].toLowerCase().includes(query);

      const matchesType = typeFilter === "all" || record.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [records, search, typeFilter]);

  const successfulReplenishments = useMemo(
    () => records.filter(
      (record) =>
        record.type === "replenishment" && record.status === "successful",
    ),
    [records],
  );

  const replenishmentCount = successfulReplenishments.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
              <Wallet size={19} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Funding history
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Demo funding and ledger activity
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Successful replenishments
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {replenishmentCount}
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="relative block">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference or description..."
            aria-label="Search funding history"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as FundingRecord["type"] | "all")
          }
          aria-label="Filter funding history by type"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="all">All activity types</option>
          <option value="replenishment">Replenishments</option>
          <option value="booking-charge">Booking charges</option>
          <option value="refund">Refunds</option>
          <option value="reversal">Reversals</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3 p-5" aria-label="Loading funding history">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <CalendarDays size={21} />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            No funding records found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try another search or filter, or add demo ledger records when the funding workflow is connected.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredRecords.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => onViewRecord?.(record)}
              disabled={!onViewRecord}
              className="flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-slate-50 disabled:cursor-default dark:hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  <ArrowDownLeft size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {TYPE_LABELS[record.type]}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                    {record.reference}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {record.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {displayDate(record.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-bold tabular-nums text-slate-900 dark:text-white">
                  {displayAmount(record)}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[record.status]}`}
                >
                  {record.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Demo ledger only — no real money movement or bank transaction is performed.
      </div>
    </section>
  );
}
