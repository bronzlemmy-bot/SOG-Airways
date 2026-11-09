"use client";

import { ReactNode, useState } from "react";
import { Apple, Globe, Loader2 } from "lucide-react";

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => Promise<void> | void;
  onAppleLogin?: () => Promise<void> | void;
  disabled?: boolean;
}

interface SocialProvider {
  id: "google" | "apple";
  label: string;
  icon: ReactNode;
  action?: () => Promise<void> | void;
}

export default function SocialLoginButtons({
  onGoogleLogin,
  onAppleLogin,
  disabled = false,
}: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] =
    useState<"google" | "apple" | null>(null);

  const providers: SocialProvider[] = [
    {
      id: "google",
      label: "Continue with Google",
      icon: <Globe size={18} />,
      action: onGoogleLogin,
    },
    {
      id: "apple",
      label: "Continue with Apple",
      icon: <Apple size={18} />,
      action: onAppleLogin,
    },
  ];

  const handleLogin = async (
    provider: SocialProvider,
  ) => {
    if (
      disabled ||
      loadingProvider ||
      !provider.action
    ) {
      return;
    }

    setLoadingProvider(provider.id);

    try {
      await provider.action();
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div
          className="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div className="w-full border-t border-slate-200" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-slate-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {providers.map((provider) => {
          const isLoading =
            loadingProvider === provider.id;

          const isUnavailable =
            !provider.action;

          return (
            <button
              key={provider.id}
              type="button"
              onClick={() =>
                handleLogin(provider)
              }
              disabled={
                disabled ||
                Boolean(loadingProvider) ||
                isUnavailable
              }
              title={
                isUnavailable
                  ? `${provider.label} is not connected yet.`
                  : undefined
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                provider.icon
              )}

              <span>
                {isLoading
                  ? "Connecting..."
                  : provider.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}