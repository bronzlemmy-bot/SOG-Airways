
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  KeyRound,
  Laptop,
  LoaderCircle,
  
  LogOut,
  Mail,
  MonitorSmartphone,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

interface ProfileSecurityProps {
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChanged?: string | null;
  lastSignIn?: string | null;
  activeSessions?: number;

  isUpdatingTwoFactor?: boolean;
  isSigningOutSessions?: boolean;

  onChangePassword?: () => void;
  onToggleTwoFactor?: (enabled: boolean) => void | Promise<void>;
  onReviewSessions?: () => void;
  onRequestSignOutOtherSessions?: () => void;

  error?: string;
  successMessage?: string;
}

interface SecurityStatusProps {
  title: string;
  description: string;
  verified: boolean;
  icon: LucideIcon;
}

interface SecurityActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

function formatSecurityDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function SecurityStatus({
  title,
  description,
  verified,
  icon: Icon,
}: SecurityStatusProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          verified
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
            verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
          }`}
        >
          {verified ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5" />
          )}

          {verified ? "Verified" : "Not verified"}
        </span>
      </div>
    </div>
  );
}

function SecurityActionCard({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon: ActionIcon = ArrowUpRight,
  disabled = false,
  badge,
}: SecurityActionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h4>

            {badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          disabled={disabled}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 sm:self-center"
        >
          {actionLabel}
          <ActionIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function ProfileSecurity({
  email,
  phone,
  emailVerified,
  phoneVerified,
  twoFactorEnabled,
  lastPasswordChanged,
  lastSignIn,
  activeSessions = 0,
  isUpdatingTwoFactor = false,
  isSigningOutSessions = false,
  onChangePassword,
  onToggleTwoFactor,
  onReviewSessions,
  onRequestSignOutOtherSessions,
  error,
  successMessage,
}: ProfileSecurityProps) {
  const [actionError, setActionError] = useState("");

  const handleToggleTwoFactor = async () => {
    if (!onToggleTwoFactor || isUpdatingTwoFactor) return;

    setActionError("");

    try {
      await onToggleTwoFactor(!twoFactorEnabled);
    } catch {
      setActionError(
        "We could not update two-factor authentication. Please try again.",
      );
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-6 dark:border-slate-800 dark:from-blue-950/30 dark:via-slate-950 dark:to-indigo-950/20 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Account Security
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your security settings, verification status, and account access.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Verification Status
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review which contact details have been verified.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SecurityStatus
              title="Email Address"
              description={email || "No email address provided."}
              verified={emailVerified}
              icon={Mail}
            />

            <SecurityStatus
              title="Phone Number"
              description={phone || "No phone number provided."}
              verified={phoneVerified}
              icon={Phone}
            />
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <section className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Security Settings
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Strengthen your account protection and manage your password.
            </p>
          </div>

          <div className="space-y-3">
            <SecurityActionCard
              icon={KeyRound}
              title="Password"
              description={
                lastPasswordChanged
                  ? `Last changed ${formatSecurityDate(lastPasswordChanged)}.`
                  : "Change your password regularly to help protect your account."
              }
              action={onChangePassword}
              actionLabel="Change Password"
              disabled={!onChangePassword}
            />

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    twoFactorEnabled
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Two-Factor Authentication
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {twoFactorEnabled
                      ? "An additional verification step is enabled for your account."
                      : "Add another layer of protection when signing in."}
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                      twoFactorEnabled
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    }`}
                  >
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              {onToggleTwoFactor && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={twoFactorEnabled}
                  aria-label="Toggle two-factor authentication"
                  disabled={isUpdatingTwoFactor}
                  onClick={() => void handleToggleTwoFactor()}
                  className={`relative inline-flex h-7 w-12 shrink-0 self-start rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center ${
                    twoFactorEnabled
                      ? "bg-emerald-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
                      twoFactorEnabled
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  >
                    {isUpdatingTwoFactor ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    ) : (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          twoFactorEnabled ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      />
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <section className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Account Activity
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review available information about recent account access.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Last Sign-in
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {formatSecurityDate(lastSignIn)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <MonitorSmartphone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Active Sessions
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {Math.max(0, activeSessions)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {onReviewSessions && (
            <SecurityActionCard
              icon={Laptop}
              title="Review Active Sessions"
              description="Review signed-in devices and other active account sessions."
              action={onReviewSessions}
              actionLabel="Review Sessions"
            />
          )}

          {onRequestSignOutOtherSessions && (
            <SecurityActionCard
              icon={LogOut}
              title="Sign Out Other Sessions"
              description="Request that other signed-in sessions be ended."
              action={onRequestSignOutOtherSessions}
              actionLabel={
                isSigningOutSessions
                  ? "Signing Out..."
                  : "Sign Out Others"
              }
              disabled={isSigningOutSessions}
              actionIcon={LogOut}
            />
          )}
        </section>

        {(error || actionError) && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error || actionError}</p>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
