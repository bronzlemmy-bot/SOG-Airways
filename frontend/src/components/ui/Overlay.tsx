import { MouseEvent, ReactNode } from "react";

interface OverlayProps {
  children?: ReactNode;
  onClick?: () => void;
  visible?: boolean;
  className?: string;
  closeOnClick?: boolean;
}

export default function Overlay({
  children,
  onClick,
  visible = true,
  className = "",
  closeOnClick = true,
}: OverlayProps) {
  if (!visible) return null;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (closeOnClick) {
      onClick?.();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] ${className}`}
      onClick={handleClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}