"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { AppIcon, type IconName } from "@/components/icons";

const navItems: {
  href: string;
  icon: IconName;
  label: string;
  exact?: boolean;
}[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/videos", icon: "video_library", label: "My Videos" },
  { href: "/dashboard/create", icon: "add_circle", label: "Create Video" },
  { href: "/dashboard/billing", icon: "credit_card", label: "Billing" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      <AdminNavLink />
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href || pathname === `${item.href}/`
          : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm transition-colors duration-200 ${
              isActive
                ? "border-primary/25 bg-primary/[0.12] font-semibold text-foreground shadow-[inset_0_0_0_1px_rgba(209,255,0,0.12)] hover:bg-primary/[0.16]"
                : "font-semibold text-muted-foreground hover:border-border hover:bg-white/[0.04] hover:text-foreground"
            }`}
          >
            <AppIcon
              name={item.icon}
              size="lg"
              active={isActive}
              className={isActive ? "text-primary" : undefined}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
