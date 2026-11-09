import { Image as ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function ImagePlaceholder({
  label = "No image available",
  className = "",
  iconSize = "md",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <ImageIcon className={iconSizes[iconSize]} />

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>
    </div>
  );
}