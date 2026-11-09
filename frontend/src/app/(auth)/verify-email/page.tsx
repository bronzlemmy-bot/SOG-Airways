import VerifyEmail from "@/features/auth/components/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Confirm your email
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Verify your email address to activate your SOG Airways account.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <VerifyEmail />
      </div>
    </div>
  );
}
