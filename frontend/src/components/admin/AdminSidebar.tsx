"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Airplay,
  BarChart3,
  Building2,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  Gauge,
  MessageSquare,
  Plane,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import type { ComponentType } from "react";

type AdminNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const navigationItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Gauge,
  },
  {
    label: "Aircraft",
    href: "/admin/aircraft",
    icon: Airplay,
  },
  {
    label: "Airports",
    href: "/admin/airports",
    icon: Building2,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck2,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: CircleUserRound,
  },
  {
    label: "Flights",
    href: "/admin/flights",
    icon: Plane,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Passengers",
    href: "/admin/passengers",
    icon: Users,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: WalletCards,
  },
  {
    label: "Reports",
    href: "/admin/Reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: ShieldCheck,
  },
];

type AdminSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function AdminSidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isCollapsed = collapsed && !mobileOpen;

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigation = () => {
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            type="button"
            aria-label="Close admin navigation"
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
        ) : null}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 288,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/20",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          "lg:transform-none",
        ].join(" ")}
        aria-label="Admin sidebar"
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-5">
          <Link
            href="/admin"
            onClick={handleNavigation}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
              <Plane className="h-5 w-5" />
            </div>

            <AnimatePresence initial={false}>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 overflow-hidden"
                >
                  <p className="truncate text-base font-bold text-white">
                    SOG Airways
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    Administration
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Link>

          {/* Desktop collapse */}
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    isCollapsed ? "justify-center" : "",
                    active
                      ? "border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-sm shadow-sky-950/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {active ? (
                    <motion.span
                      layoutId="admin-sidebar-active"
                      className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-sky-400"
                    />
                  ) : null}

                  <Icon
                    className={[
                      "h-5 w-5 shrink-0",
                      active
                        ? "text-sky-300"
                        : "text-slate-500 group-hover:text-sky-200",
                    ].join(" ")}
                  />

                  <AnimatePresence initial={false}>
                    {!isCollapsed ? (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>

                  {isCollapsed ? (
                    <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
                      {item.label}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin profile */}
        <div className="border-t border-slate-800 p-3">
          <div
            className={[
              "flex items-center gap-3 rounded-xl bg-white/5 p-3",
              isCollapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
              <CircleUserRound className="h-5 w-5" />
            </div>

            <AnimatePresence initial={false}>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate text-sm font-semibold text-white">
                    Administrator
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    Admin Account
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Link
              href="/"
              title="Return to website"
              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="Return to website"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}