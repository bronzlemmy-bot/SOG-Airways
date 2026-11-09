
"use client";

import { motion } from "framer-motion";
import { UserRound, ShieldCheck } from "lucide-react";

interface ProfileHeaderProps {
  isEditing?: boolean;
}

export default function ProfileHeader({
  isEditing = false,
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <UserRound className="h-5 w-5" />
            </div>

            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              SOG Airways Account
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Manage your personal information, contact details, and travel
            preferences from one place.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Your account is protected</span>
        </div>
      </div>
    </motion.div>
  );
}

