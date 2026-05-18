"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-10 w-[5.25rem] animate-pulse rounded-full border border-border bg-muted/50"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="theme-toggle group relative flex h-10 w-[5.25rem] shrink-0 items-center rounded-full border border-border bg-muted/50 p-1 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_16px_rgba(209,255,0,0.12)]"
    >
      <span
        className={`theme-toggle-thumb absolute top-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-300 ease-out ${
          isDark ? "translate-x-0" : "translate-x-[2.75rem]"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <Sun className="h-4 w-4" strokeWidth={2.25} />
        )}
      </span>
      <span className="flex w-full items-center justify-between px-2.5 pointer-events-none">
        <Moon
          className={`h-3.5 w-3.5 transition-colors duration-300 ${
            isDark ? "text-primary" : "text-muted-foreground/50"
          }`}
          strokeWidth={2}
        />
        <Sun
          className={`h-3.5 w-3.5 transition-colors duration-300 ${
            !isDark ? "text-primary" : "text-muted-foreground/50"
          }`}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
