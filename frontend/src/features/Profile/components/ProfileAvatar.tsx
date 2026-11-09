
"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  ImagePlus,
  Mail,
  UserRound,
} from "lucide-react";

interface ProfileAvatarProps {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  isEditing?: boolean;
  onAvatarChange?: (file: File, previewUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

const avatarSizes = {
  sm: "h-16 w-16 text-lg",
  md: "h-24 w-24 text-2xl",
  lg: "h-32 w-32 text-3xl",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function ProfileAvatar({
  name,
  email,
  avatarUrl,
  isEditing = false,
  onAvatarChange,
  size = "lg",
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const canEditAvatar = isEditing && Boolean(onAvatarChange);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    // Reset the input so the same file can be selected again.
    input.value = "";

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }

    if (file.size > AVATAR_MAX_SIZE) {
      setError("Your image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("We could not preview this image. Try another file.");
        return;
      }

      onAvatarChange?.(file, reader.result);
    };

    reader.onerror = () => {
      setError("We could not read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div
            className={`relative ${avatarSizes[size]} overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-xl ring-4 ring-blue-100 dark:border-slate-900 dark:ring-blue-950`}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={`${name || "User"}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : name.trim() ? (
              <div
                aria-label={`Avatar initials for ${name}`}
                className="flex h-full w-full items-center justify-center font-black tracking-wide text-white"
              >
                {getInitials(name)}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white">
                <UserRound className="h-1/2 w-1/2" />
              </div>
            )}
          </div>

          {canEditAvatar && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-900"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload a profile photo"
              />
            </>
          )}
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="break-words text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {name.trim() || "Your Profile"}
            </h2>

            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              SOG Airways
            </span>
          </div>

          {email && (
            <p className="mt-2 flex items-center justify-center gap-2 break-all text-sm text-slate-500 dark:text-slate-400 sm:justify-start">
              <Mail className="h-4 w-4 shrink-0" />
              {email}
            </p>
          )}

          {canEditAvatar ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ImagePlus className="h-4 w-4" />
              Upload new photo
            </button>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Your account profile
            </p>
          )}
        </div>
      </div>

      {canEditAvatar && (
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-left">
          Accepted image files up to 5 MB.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </section>
  );
}
