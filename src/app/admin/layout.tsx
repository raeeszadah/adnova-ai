import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AppShellFooter } from "@/components/layout/AppShellFooter";
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-black/5 backdrop-blur-xl flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <BrandLogo variant="mark" size="md" />
            <span className="font-headline font-extrabold text-lg tracking-tighter">
              Admin
            </span>
          </Link>
        </div>
        <AdminSidebar />
        <div className="p-4 border-t border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Platform control
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-black/5 backdrop-blur-xl shrink-0">
          <h2 className="font-headline font-bold text-lg">AdNova AI — Admin</h2>
          <UserButton />
        </header>
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto p-8">
            <AdminConvexGate>{children}</AdminConvexGate>
          </div>
          <AppShellFooter variant="admin" />
        </main>
      </div>
    </div>
    </>
  );
}
