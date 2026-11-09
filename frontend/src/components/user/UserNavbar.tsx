"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
Bell,
Briefcase,
ChevronDown,
FileText,
LayoutDashboard,
LogOut,
Menu,
Plane,
Search,
Settings,
Ticket,
User,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";

interface UserNavbarProps {
onMenuClick?: () => void;
onLogout?: () => void | Promise<void>;
}

export default function UserNavbar({
onMenuClick,
onLogout,
}: UserNavbarProps) {
const router = useRouter();

const [search, setSearch] = useState("");
const [isProfileOpen, setIsProfileOpen] = useState(false);

const handleSearch = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


const query = search.trim();

if (!query) {
  router.push("/flights");
  return;
}

router.push(
  `/flights?search=${encodeURIComponent(query)}`
);

setSearch("");


};

const handleLogout = () => {
setIsProfileOpen(false);

if (onLogout) {
  void onLogout();
  return;
}

router.push("/login");
};

return ( <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"> <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">


    <div className="flex min-w-0 items-center gap-3">

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link
        href="/"
        aria-label="Go to SOG Airways home page"
        className="flex shrink-0 items-center gap-2"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
          S
        </div>

        <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:block">
          SOG Airways
        </span>
      </Link>
    </div>

    <form
      onSubmit={handleSearch}
      className="hidden min-w-0 max-w-md flex-1 px-4 md:block lg:px-6"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search flights, bookings..."
          aria-label="Search flights and bookings"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />

        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>

    <div className="flex shrink-0 items-center gap-1 sm:gap-2">

      <button
        type="button"
        onClick={() => router.push("/flights")}
        aria-label="Search flights"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      <Link
        href="/users/notifications"
        aria-label="View notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Bell className="h-5 w-5" />

        <span
          aria-label="Unread notifications"
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
        />
      </Link>

      <div className="relative">

        <button
          type="button"
          onClick={() =>
            setIsProfileOpen(
              (current) => !current
            )
          }
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
        >
          <Avatar
            name="SOG User"
            size="sm"
          />

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-slate-900">
              SOG User
            </p>

            <p className="text-xs text-slate-500">
              Passenger
            </p>
          </div>

          <ChevronDown
            className={`hidden h-4 w-4 text-slate-400 transition-transform lg:block ${
              isProfileOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <>
            <button
              type="button"
              aria-label="Close profile menu"
              onClick={() =>
                setIsProfileOpen(false)
              }
              className="fixed inset-0 z-40 cursor-default"
            />

            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            >

              <div className="border-b border-slate-100 px-3 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  SOG User
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Passenger account
                </p>
              </div>

              <Link
                href="/users/dashboard"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4 text-slate-500" />
                Dashboard
              </Link>

              <Link
                href="/users/bookings"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Ticket className="h-4 w-4 text-slate-500" />
                My Bookings
              </Link>

              <Link
                href="/users/booking-details/SOG-BOOKING-001"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-slate-500" />
                Booking Details
              </Link>

              <Link
                href="/users/check-in/SOG8K4P2"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Plane className="h-4 w-4 text-slate-500" />
                Check-In
              </Link>

              <Link
                href="/users/manage-trips"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Briefcase className="h-4 w-4 text-slate-500" />
                Manage Trips
              </Link>

              <Link
                href="/users/profile"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <User className="h-4 w-4 text-slate-500" />
                My Profile
              </Link>

              <Link
                href="/users/settings"
                role="menuitem"
                onClick={() =>
                  setIsProfileOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings className="h-4 w-4 text-slate-500" />
                Settings
              </Link>

              <div className="my-2 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  </div>
</header>


);
}
