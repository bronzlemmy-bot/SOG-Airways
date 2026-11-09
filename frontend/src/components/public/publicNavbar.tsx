
"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  ChevronDown,
  CircleHelp,
  Globe2,
  Luggage,
  Menu,
  Plane,
  Quote,
  Search,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {
  ssr: false,
});

type DropdownItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
};

type DropdownMenu = {
  label: string;
  items: DropdownItem[];
};

const dropdownMenus: DropdownMenu[] = [
  {
    label: "Book",
    items: [
      {
        label: "Flights",
        href: "/flights",
        icon: Plane,
        description: "Search and compare flights",
      },
      {
        label: "Booking",
        href: "/booking",
        icon: Ticket,
        description: "Complete your flight booking",
      },
      {
        label: "Offers",
        href: "/offers",
        icon: Search,
        description: "Explore special flight offers",
      },
      {
        label: "Deals",
        href: "/deals",
        icon: Ticket,
        description: "Discover our latest deals",
      },
    ],
  },
  {
    label: "Manage Your Trip",
    items: [
      {
        label: "Manage Booking",
        href: "/manage-booking",
        icon: Ticket,
        description: "View or change your reservation",
      },
      {
        label: "Check-in",
        href: "/check-in",
        icon: CalendarCheck,
        description: "Check in for your flight",
      },
      {
        label: "Track Flight",
        href: "/track-flight",
        icon: Plane,
        description: "Check your flight status",
      },
      {
        label: "Baggage",
        href: "/baggage",
        icon: Luggage,
        description: "Baggage information and rules",
      },
    ],
  },
  {
    label: "Explore",
    items: [
      {
        label: "Destinations",
        href: "/destinations",
        icon: Globe2,
        description: "Explore destinations around the world",
      },
      {
        label: "Travel Information",
        href: "/travel-information",
        icon: Globe2,
        description: "Everything you need before traveling",
      },
    ],
  },
  {
    label: "About",
    items: [
      {
        label: "About Us",
        href: "/about",
        icon: UserRound,
        description: "Learn more about SOG Airways",
      },
      {
        label: "Contact",
        href: "/contact",
        icon: UserRound,
        description: "Get in touch with our team",
      },
      {
        label: "FAQ",
        href: "/faq",
        icon: CircleHelp,
        description: "Find answers to common questions",
      },
      {
        label: "Testimonials",
        href: "/testimonials",
        icon: Quote,
        description: "Read fictional traveler stories",
      },
    ],
  },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isDropdownActive = (menu: DropdownMenu) => {
    return menu.items.some((item) => isActive(item.href));
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileOpenMenu(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileOpenMenu((current) => (current === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:text-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition-transform duration-300 group-hover:scale-105 dark:bg-white dark:text-slate-950">
            <Plane className="h-5 w-5" />
          </div>

          <div className="leading-none">
            <div className="text-lg font-black tracking-tight">SOG</div>

            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Airways
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isActive("/")
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            Home
          </Link>

          {dropdownMenus.map((menu) => {
            const open = desktopOpenMenu === menu.label;
            const active = isDropdownActive(menu);

            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setDesktopOpenMenu(menu.label)}
                onMouseLeave={() => setDesktopOpenMenu(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setDesktopOpenMenu(open ? null : menu.label)
                  }
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                  aria-expanded={open}
                >
                  {menu.label}

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                        {menu.items.map((item) => {
                          const Icon = item.icon;
                          const itemActive = isActive(item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setDesktopOpenMenu(null)}
                              className={`group flex items-center gap-3 rounded-xl p-3 transition ${
                                itemActive
                                  ? "bg-slate-100 dark:bg-slate-800"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/70"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                                  itemActive
                                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <div
                                  className={`text-sm font-bold ${
                                    itemActive
                                      ? "text-slate-950 dark:text-white"
                                      : "text-slate-800 dark:text-slate-100"
                                  }`}
                                >
                                  {item.label}
                                </div>

                                {item.description && (
                                  <div className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Theme Toggle */}
          <ThemeToggle />

          <Link
            href="/faq"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Help and FAQ"
            title="Help and FAQ"
          >
            <CircleHelp className="h-5 w-5" />
          </Link>

          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            <Ticket className="h-4 w-4" />
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Theme Toggle */}
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden"
          >
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto px-4 pb-5 pt-3 sm:px-6">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`mb-1 flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive("/")
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                Home
              </Link>

              <div className="space-y-1">
                {dropdownMenus.map((menu) => {
                  const open = mobileOpenMenu === menu.label;
                  const active = isDropdownActive(menu);

                  return (
                    <div key={menu.label}>
                      <button
                        type="button"
                        onClick={() => toggleMobileDropdown(menu.label)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                          active
                            ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                        }`}
                        aria-expanded={open}
                      >
                        <span>{menu.label}</span>

                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-3 space-y-1 border-l border-slate-200 py-1 pl-3 dark:border-slate-800">
                              {menu.items.map((item) => {
                                const Icon = item.icon;
                                const itemActive = isActive(item.href);

                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                                      itemActive
                                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                                    }`}
                                  >
                                    <Icon className="h-4 w-4 shrink-0" />

                                    <div>
                                      <div className="text-sm font-semibold">
                                        {item.label}
                                      </div>

                                      {item.description && (
                                        <div
                                          className={`mt-0.5 text-[11px] ${
                                            itemActive
                                              ? "text-slate-300 dark:text-slate-600"
                                              : "text-slate-500 dark:text-slate-500"
                                          }`}
                                        >
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/faq"
                onClick={closeMobileMenu}
                className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <CircleHelp className="h-4 w-4" />
                Help & FAQ
              </Link>

              <Link
                href="/booking"
                onClick={closeMobileMenu}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <Ticket className="h-4 w-4" />
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
