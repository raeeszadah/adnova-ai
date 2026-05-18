import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AppShellFooter } from "@/components/layout/AppShellFooter";
import { AppShellLayout } from "@/components/layout/AppShellLayout";
import { AdminConvexBootstrap } from "@/components/admin/AdminConvexBootstrap";
import { AdminConvexGate } from "@/components/admin/AdminConvexGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { assertAdminOrRedirect } from "@/lib/auth/server-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAdminOrRedirect();

  return (
    <>
      <AdminConvexBootstrap />
      <AppShellLayout
        headerTitle="AdNova AI — Admin"
        headerActions={<UserButton />}
        sidebarBrand={
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
          >
            <BrandLogo variant="mark" size="md" />
            <span className="font-headline text-lg font-extrabold tracking-tighter">
              Admin
            </span>
          </Link>
        }
        sidebarNav={<AdminSidebar />}
        sidebarFooter={
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Platform control
          </p>
        }
        footer={<AppShellFooter variant="admin" />}
      >
        <AdminConvexGate>{children}</AdminConvexGate>
      </AppShellLayout>
    </>
  );
}
