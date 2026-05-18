import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AppShellFooter } from "@/components/layout/AppShellFooter";
import { SidebarNav } from "./SidebarNav";
import { CreditsWidget } from "./CreditsWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-black/5 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center hover:opacity-90 transition-opacity"
            aria-label="AdNova AI home"
          >
            <BrandLogo size="lg" />
          </Link>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-border">
          <CreditsWidget />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-black/5 backdrop-blur-xl">
          <h2 className="font-headline font-bold text-lg">Dashboard</h2>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto p-8">{children}</div>
          <AppShellFooter variant="dashboard" />
        </main>
      </div>
    </div>
  );
}
