
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Plane,
  Settings,
  UserRound,
} from "lucide-react";

interface UserSidebarProps {
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
    badge: 3,
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

export default function UserSidebar({
  onLogout,
}: UserSidebarProps) {
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

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
          <Plane className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
            SOG Airways
          </p>

          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Passenger Portal
          </p>
        </div>
      </div>

      <nav
        aria-label="User navigation"
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
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
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white dark:bg-slate-900" />
                )}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                    active
                      ? "bg-white/10 dark:bg-slate-900/10"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 dark:bg-slate-900 dark:text-slate-500 dark:group-hover:bg-slate-800 dark:group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="flex-1 truncate">
                  {item.label}
                </span>

                {item.badge !== undefined && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      active
                        ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.label !== "Notifications" && (
                  <ChevronRight
                    className={`h-4 w-4 transition-all ${
                      active
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <Link
          href="/users/profile"
          className={`group mb-2 flex items-center gap-3 rounded-xl border p-3 transition ${
            isActive("/users/profile")
              ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              My Profile
            </p>

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Manage your account
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <Home className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white" />

          <span className="flex-1">
            Back to Home
          </span>

          <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4.5 w-4.5" />

          <span className="flex-1 text-left">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
