"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

import UserNavbar from "@/components/user/UserNavbar";
import UserSidebar from "@/components/user/UserSidebar";
import UserMobileMenu from "@/components/user/UserMobileMenu";
import { useAuth } from "@/hooks/useAuth";

interface UserLayoutProps {
children: ReactNode;
}

export default function UserLayout({
children,
}: UserLayoutProps) {
const router = useRouter();

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [logoutError, setLogoutError] = useState("");
const { logout } = useAuth();

const openMobileMenu = () => {
setIsMobileMenuOpen(true);
};

const closeMobileMenu = () => {
setIsMobileMenuOpen(false);
};

const handleLogout = async () => {
closeMobileMenu();
setLogoutError("");

try {
  await logout();
  router.push("/login");
} catch (error) {
  setLogoutError(
    error instanceof Error ? error.message : "Unable to log out. Please try again.",
  );
}
};

return ( <div className="min-h-screen bg-slate-50 dark:bg-slate-950"> <UserNavbar
  onMenuClick={openMobileMenu}
  onLogout={handleLogout}
/>


  <div className="flex min-h-[calc(100vh-4rem)]">
    <UserSidebar onLogout={handleLogout} />

    <main className="min-w-0 flex-1">
    <p
      role="note"
      className="mx-4 mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:mx-6 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
    >
      Demo environment: user bookings, payments, trips, check-in, and
      ticket previews are simulated and are not valid operational records.
      No real money is charged or transferred.
    </p>
    {logoutError && (
      <p
          role="alert"
          className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
        >
          {logoutError}
        </p>
      )}
      {children}
    </main>
  </div>

  <UserMobileMenu
    isOpen={isMobileMenuOpen}
    onClose={closeMobileMenu}
    onLogout={handleLogout}
  />
</div>


);
}
