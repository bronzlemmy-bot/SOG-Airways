import Link from "next/link";
import { Plane } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Plane className="h-5 w-5" />
              </span>

              <span className="text-lg font-bold tracking-tight">
                SOG Airways
              </span>
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              Back to website
            </Link>
          </div>
        </header>

        {/* Authentication content */}
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} SOG Airways. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}