"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon, type IconName } from "@/components/icons";

const navItems: {
  href: string;
  icon: IconName;
  label: string;
  exact?: boolean;
}[] = [
  { href: "/admin/dashboard", icon: "dashboard", label: "Overview", exact: true },
  { href: "/admin/users", icon: "group", label: "Users" },
  { href: "/admin/videos", icon: "video_library", label: "Videos" },
  { href: "/admin/analytics", icon: "analytics", label: "Analytics" },
  { href: "/admin/api-logs", icon: "terminal", label: "API Logs" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
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
                ? "border-secondary/30 bg-secondary/[0.12] font-semibold text-foreground shadow-[inset_0_0_0_1px_rgba(209,255,0,0.1)] hover:bg-secondary/[0.16]"
                : "font-semibold text-muted-foreground hover:border-border hover:bg-foreground/[0.04] hover:text-foreground"
            }`}
          >
            <AppIcon
              name={item.icon}
              size="lg"
              active={isActive}
              className={isActive ? "text-secondary" : undefined}
            />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/dashboard"
        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-foreground/5 hover:text-foreground border border-dashed border-border"
      >
        <AppIcon name="arrow_back" size="lg" />
        User app
      </Link>
    </nav>
  );
}
