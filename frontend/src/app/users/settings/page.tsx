
import { SettingsFeature } from "@/features/Settings";

export default function SettingsPage() {
  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <SettingsFeature />
      </div>
    </main>
  );
}
