"use client";

import { useState, type ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/Admin-Navbar";
import { PaymentStoreProvider } from "@/features/payment/PaymentStoreProvider";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((current) => !current);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <PaymentStoreProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onMobileClose={handleMobileMenuClose}
        />

        <div
          className={[
            "min-h-screen transition-[padding] duration-300",
            sidebarCollapsed ? "lg:pl-22" : "lg:pl-72",
          ].join(" ")}
        >
          <AdminNavbar
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={handleMobileMenuToggle}
          />

          <main className="min-h-[calc(100vh-4rem)]">
            <p
              role="note"
              className="mx-4 mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:mx-6 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            >
              Demo admin workspace: displayed booking, passenger, flight,
              and payment records are synthetic. Changes stay in memory;
              no operational systems or live payment providers are used.
            </p>
            {children}
          </main>
        </div>
      </div>
    </PaymentStoreProvider>
  );
}
