"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { isAdminRole } from "@/lib/saas-constants";

export function AdminNavLink() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (!isAdminRole(role)) return null;

  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-secondary border border-secondary/30 bg-secondary/10 hover:bg-secondary/15 transition-all"
    >
      <BrandLogo variant="mark" size="sm" />
      Admin panel
    </Link>
  );
}
