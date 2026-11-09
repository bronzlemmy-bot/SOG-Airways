"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, UserRound } from "lucide-react";
import type { ProfileData } from "./profile-data/ProfileData";

interface ProfileAvatarProps {
  profile: ProfileData;
  isEditing?: boolean;
  onAvatarChange?: () => void;
}

export default function ProfileAvatar({
  profile,
  isEditing = false,
  onAvatarChange,
}: ProfileAvatarProps) {
  const initials = `${profile.personal.firstName.charAt(
    0
  )}${profile.personal.lastName.charAt(0)}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-800 dark:bg-slate-800 sm:h-32 sm:w-32">
          {profile.avatar.image ? (
            <Image
              src={profile.avatar.image}
              alt={`${profile.personal.firstName} ${profile.personal.lastName}`}
              width={128}
              height={128}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300 sm:text-3xl">
              {initials}
            </span>
          )}
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={onAvatarChange}
            aria-label="Change profile photo"
            className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:scale-105 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Camera className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-center gap-2">
          <UserRound className="h-4 w-4 text-slate-500 dark:text-slate-400" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {profile.personal.firstName} {profile.personal.lastName}
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {profile.contact.email}
        </p>

        <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {profile.account.status}
        </span>
      </div>
    </motion.div>
  );
}