"use client";

import { cn } from "@/lib/utils";

export function RouteProgressBar({ active }: { active: boolean }) {
  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "Loading page" : undefined}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-0.5 overflow-hidden pointer-events-none transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="h-full w-full bg-white/5">
        <div
          className={cn(
            "h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary to-secondary/80",
            active && "route-progress-indeterminate"
          )}
        />
      </div>
    </div>
  );
}
