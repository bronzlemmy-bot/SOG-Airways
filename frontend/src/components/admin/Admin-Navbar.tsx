"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  Menu,
  MessageSquare,
  Plane,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

type AdminNavbarProps = {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
};

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/aircraft": "Aircraft",
  "/admin/airports": "Airports",
  "/admin/bookings": "Bookings",
  "/admin/customers": "Customers",
  "/admin/flights": "Flights",
  "/admin/messages": "Messages",
  "/admin/passengers": "Passengers",
  "/admin/payments": "Payments",
  "/admin/Reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/staff": "Staff",
};

export default function AdminNavbar({
  onMobileMenuToggle,
  mobileMenuOpen = false,
}: AdminNavbarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const getPageTitle = () => {
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    const matchedRoute = Object.keys(pageTitles).find(
      (route) =>
        route !== "/admin" && pathname.startsWith(`${route}/`),
    );

    return matchedRoute ? pageTitles[matchedRoute] : "Administration";
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400 lg:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close admin navigation"
                : "Open admin navigation"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Page title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Plane className="hidden h-5 w-5 shrink-0 text-sky-600 sm:block dark:text-sky-400" />

              <p className="truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                {pageTitle}
              </p>
            </div>

            <p className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
              SOG Airways Administration
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 md:flex dark:border-slate-800 dark:text-slate-300 dark:hover:border-sky-900 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Website</span>
          </Link>

          {/* Notifications */}
          <Link
            href="/admin/messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
            aria-label="Open admin messages"
          >
            <MessageSquare className="h-5 w-5" />
          </Link>

          {/* Profile menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 sm:px-3"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                A
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  Administrator
                </p>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  Admin Account
                </p>
              </div>

              <ChevronDown
                className={[
                  "hidden h-4 w-4 text-slate-400 transition-transform sm:block",
                  profileOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            <AnimatePresence>
              {profileOpen ? (
                <>
                  {/* Dropdown backdrop */}
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />

                  {/* Profile dropdown */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    role="menu"
                  >
                    {/* Profile information */}
                    <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Administrator
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Admin Account
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="mt-2">
                      <Link
                        href="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        role="menuitem"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                          <Settings className="h-4 w-4" />
                        </span>

                        Account Settings
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setProfileOpen(false)}
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        role="menuitem"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                          <ExternalLink className="h-4 w-4" />
                        </span>

                        Return to Website
                      </Link>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}