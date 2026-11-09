import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs",
    icon: "h-4 w-4",
  },
  md: {
    container: "h-10 w-10",
    text: "text-sm",
    icon: "h-5 w-5",
  },
  lg: {
    container: "h-12 w-12",
    text: "text-base",
    icon: "h-6 w-6",
  },
  xl: {
    container: "h-16 w-16",
    text: "text-xl",
    icon: "h-8 w-8",
  },
};

function getInitials(name?: string) {
  if (!name?.trim()) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Avatar({
  src,
  alt = "User profile",
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const styles = sizeStyles[size];
  const initials = getInitials(name);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-700 ${styles.container} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : initials ? (
        <span className={`font-semibold ${styles.text}`}>
          {initials}
        </span>
      ) : (
        <User className={styles.icon} />
      )}
    </div>
  );
}