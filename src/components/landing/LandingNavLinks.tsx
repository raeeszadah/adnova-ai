"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", match: (p: string) => p === "/dashboard" || p === "/dashboard/" },
  {
    href: "/dashboard/create",
    label: "Create",
    match: (p: string) => p.startsWith("/dashboard/create"),
  },
  {
    href: "/dashboard/videos",
    label: "My Videos",
    match: (p: string) => p.startsWith("/dashboard/videos"),
  },
  {
    href: "/dashboard/billing",
    label: "Pricing",
    match: (p: string) => p.startsWith("/dashboard/billing"),
  },
] as const;

const linkBase =
  "relative rounded-md px-1 py-1.5 font-headline text-sm font-medium tracking-wide transition-colors duration-200";

/** Inactive: strong lime underline + glow only on hover */
const inactiveClass =
  "text-muted-foreground after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:rounded-full after:bg-primary/80 after:shadow-[0_0_12px_rgba(209,255,0,0.35)] after:opacity-0 after:transition-opacity after:duration-200 hover:text-foreground hover:after:opacity-100";

/** Active: subtle rail by default; same underline + glow on hover */
const activeClass =
  "text-foreground font-semibold after:pointer-events-none after:absolute after:inset-x-1 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-primary/55 after:shadow-none after:transition-all after:duration-200 hover:after:inset-x-0 hover:after:h-px hover:after:bg-primary/80 hover:after:shadow-[0_0_12px_rgba(209,255,0,0.35)]";

export function LandingNavLinks() {
  const pathname = usePathname() ?? "";

  return (
    <div className="hidden gap-8 md:flex">
      {LINKS.map(({ href, label, match }) => {
        const isActive = match(pathname);

        return (
          <Link
            key={href}
            href={href}
            className={cn(linkBase, isActive ? activeClass : inactiveClass)}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
