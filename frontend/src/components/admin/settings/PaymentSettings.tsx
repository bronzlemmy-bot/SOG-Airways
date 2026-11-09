"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  LockKeyhole,
  WalletCards,
  WalletMinimal,
} from "lucide-react";

import {
  AdminSettings,
  currencyOptions,
  paymentMethodOptions,
} from "./admin-settings-data/SettingsData";

interface PaymentSettingsProps {
  settings: AdminSettings["payment"];
  onChange: (
    field: keyof AdminSettings["payment"],
    value: boolean | number | string | string[]
  ) => void;
}

export default function PaymentSettings({
  settings,
  onChange,
}: PaymentSettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<WalletCards className="h-5 w-5" />}
          title="Payment Methods"
          description="Choose which payment methods customers can use for their bookings."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethodOptions.map((method) => {
            const enabled = settings.enabledMethods.includes(method.value);

            return (
              <PaymentMethodCard
                key={method.value}
                value={method.value}
                label={method.label}
                enabled={enabled}
                onChange={(checked) => {
                  const nextMethods = checked
                    ? [...settings.enabledMethods, method.value]
                    : settings.enabledMethods.filter(
                        (item) => item !== method.value
                      );

                  onChange("enabledMethods", nextMethods);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<DollarSign className="h-5 w-5" />}
          title="Payment Rules"
          description="Configure currencies and payment processing behavior."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <SelectSetting
            icon={<WalletCards className="h-4 w-4" />}
            label="Default Payment Currency"
            value={settings.defaultCurrency}
            options={currencyOptions.map((currency) => ({
              value: currency.value,
              label: `${currency.label} (${currency.symbol})`,
            }))}
            onChange={(value) => onChange("defaultCurrency", value)}
          />

          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Payment Timeout"
            description="Maximum time allowed for a customer to complete a payment."
            value={settings.paymentTimeout}
            min={1}
            max={120}
            suffix="minutes"
            onChange={(value) => onChange("paymentTimeout", value)}
          />

          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Refund Window"
            description="Number of days during which eligible payments can be refunded."
            value={settings.refundWindow}
            min={0}
            max={365}
            suffix="days"
            onChange={(value) => onChange("refundWindow", value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<LockKeyhole className="h-5 w-5" />}
          title="Payment Processing"
          description="Control how payments are confirmed, captured, and refunded."
        />

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          <ToggleSetting
            icon={<WalletMinimal className="h-5 w-5" />}
            title="Allow Partial Payment"
            description="Allow customers to pay only part of the booking amount when supported."
            checked={settings.allowPartialPayment}
            onChange={(value) =>
              onChange("allowPartialPayment", value)
            }
          />

          <ToggleSetting
            icon={<Banknote className="h-5 w-5" />}
            title="Allow Refunds"
            description="Allow eligible payments to be refunded according to the refund policy."
            checked={settings.allowRefunds}
            onChange={(value) => onChange("allowRefunds", value)}
          />

          <ToggleSetting
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Require Payment Confirmation"
            description="Require payment confirmation before a booking is treated as paid."
            checked={settings.requirePaymentConfirmation}
            onChange={(value) =>
              onChange("requirePaymentConfirmation", value)
            }
          />

          <ToggleSetting
            icon={<CreditCard className="h-5 w-5" />}
            title="Automatic Payment Capture"
            description="Automatically capture authorized payments when supported by the payment provider."
            checked={settings.automaticPaymentCapture}
            onChange={(value) =>
              onChange("automaticPaymentCapture", value)
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Payment configuration
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-400">
              These settings control the payment preferences shown in the
              admin interface. Payment processing itself can be connected to
              the backend and payment provider later.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

interface PaymentMethodCardProps {
  value: string;
  label: string;
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

function PaymentMethodCard({
  value,
  label,
  enabled,
  onChange,
}: PaymentMethodCardProps) {
  const icon =
    value === "card" ? (
      <CreditCard className="h-5 w-5" />
    ) : value === "bank-transfer" ? (
      <Banknote className="h-5 w-5" />
    ) : value === "paypal" ? (
      <DollarSign className="h-5 w-5" />
    ) : value === "wallet" ? (
      <WalletMinimal className="h-5 w-5" />
    ) : (
      <WalletCards className="h-5 w-5" />
    );

  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className={`flex min-h-28 w-full flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
        enabled
          ? "border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            enabled
              ? "bg-white/15 dark:bg-slate-900/10"
              : "bg-slate-100 dark:bg-slate-900"
          }`}
        >
          {icon}
        </span>

        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
            enabled
              ? "border-current"
              : "border-slate-300 dark:border-slate-700"
          }`}
        >
          {enabled && <CheckCircle2 className="h-4 w-4" />}
        </span>
      </div>

      <span className="mt-4 block text-sm font-semibold">{label}</span>
    </button>
  );
}

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSetting({
  icon,
  title,
  description,
  checked,
  onChange,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            checked
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </p>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          checked
            ? "bg-slate-900 dark:bg-white"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm dark:bg-slate-900"
          animate={{
            left: checked ? "24px" : "4px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  );
}

interface NumberSettingProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}

function NumberSetting({
  icon,
  label,
  description,
  value,
  min,
  max,
  suffix,
  onChange,
}: NumberSettingProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (Number.isNaN(nextValue)) {
              return;
            }

            onChange(Math.min(max, Math.max(min, nextValue)));
          }}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          {suffix}
        </span>
      </div>

      <span className="mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </label>
  );
}

interface SelectSettingProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}

function SelectSetting({
  icon,
  label,
  value,
  options,
  onChange,
}: SelectSettingProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}