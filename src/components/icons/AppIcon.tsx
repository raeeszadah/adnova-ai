"use client";

import { cn } from "@/lib/utils";
import { APP_ICONS, type IconName } from "./icon-map";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLASSES: Record<IconSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
};

export type AppIconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
  /** Stronger stroke + subtle glow for active nav / emphasis */
  active?: boolean;
  strokeWidth?: number;
  spin?: boolean;
};

export function AppIcon({
  name,
  size = "md",
  className,
  active = false,
  strokeWidth,
  spin = false,
}: AppIconProps) {
  const Icon = APP_ICONS[name];
  if (!Icon) return null;

  const isLoader = name === "progress_activity" || spin;

  return (
    <Icon
      className={cn(
        SIZE_CLASSES[size],
        "shrink-0 transition-colors duration-200",
        active &&
          "text-primary drop-shadow-[0_0_8px_rgba(209,255,0,0.35)]",
        isLoader && "animate-spin",
        className
      )}
      strokeWidth={strokeWidth ?? (active ? 2.5 : 2)}
      aria-hidden
    />
  );
}
