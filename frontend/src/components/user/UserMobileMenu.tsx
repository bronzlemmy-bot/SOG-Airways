
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Plane,
  Settings,
  UserRound,
  X,
} from "lucide-react";

interface UserMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/users/dashboard",
    icon: Home,
  },
  {
    label: "Bookings",
    href: "/users/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Booking Details",
    href: "/users/booking-details/SOG-BOOKING-001",
    icon: FileText,
  },
  {
    label: "Check-In",
    href: "/users/check-in/SOG8K4P2",
    icon: Plane,
  },
  {
    label: "Manage Trips",
    href: "/users/manage-trips",
    icon: CalendarCheck,
  },
  {
    label: "Notifications",
    href: "/users/notifications",
    icon: Bell,
  },
  {
    label: "Payment Method",
    href: "/users/payment-methods",
    icon: CreditCard,
  },
  {
    label: "Profile",
    href: "/users/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/users/settings",
    icon: Settings,
  },
  {
    label: "Support",
    href: "/users/support",
    icon: HelpCircle,
  },
];

export default function UserMobileMenu({
  isOpen,
  onClose,
  onLogout,
}: UserMobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/users/dashboard") {
      return pathname === href;
    }

    if (href === "/users/booking-details/SOG-BOOKING-001") {
      return pathname.startsWith("/users/booking-details/");
    }

    if (href === "/users/check-in/SOG8K4P2") {
      return pathname.startsWith("/users/check-in/");
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const handleLogout = () => {
    onClose();

    if (onLogout) {
      void onLogout();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close mobile navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[1px]"
      />

      {/* Mobile Menu */}
      <aside
        aria-label="Mobile user navigation"
        className="fixed inset-y-0 left-0 z-50 flex w-[min(85vw,20rem)] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Go to SOG Airways home page"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              S
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              SOG Airways
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close mobile navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Information */}
        <div className="shrink-0 border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              S
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                SOG User
              </p>

              <p className="text-xs text-slate-500">
                Passenger
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Mobile user navigation links"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            My Account
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {item.label === "Notifications" && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        active
                          ? "bg-white text-slate-900"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-4">
          {/* Back to Home */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Home className="h-5 w-5 text-slate-400" />
            Back to Home
          </Link>

          {/* My Profile */}
          <Link
            href="/users/profile"
            onClick={onClose}
            className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive("/users/profile")
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <UserRound className="h-5 w-5" />
            My Profile
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
