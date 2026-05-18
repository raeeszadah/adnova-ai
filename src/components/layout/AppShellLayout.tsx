"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type AppShellLayoutProps = {
  headerTitle: string;
  headerActions?: ReactNode;
  sidebarBrand: ReactNode;
  sidebarNav: ReactNode;
  sidebarFooter: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function AppShellLayout({
  headerTitle,
  headerActions,
  sidebarBrand,
  sidebarNav,
  sidebarFooter,
  footer,
  children,
}: AppShellLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const sidebarPanel = (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4 lg:px-6">
        {sidebarBrand}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{sidebarNav}</div>
      <div className="shrink-0 border-t border-border p-4">{sidebarFooter}</div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-black/5 backdrop-blur-xl lg:flex">
        {sidebarPanel}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(100%,18rem)] max-w-[85vw] flex-col border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {sidebarPanel}
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-black/5 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-foreground/[0.04] text-foreground transition-colors hover:bg-foreground/[0.08] lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <h2 className="truncate font-headline text-base font-bold sm:text-lg">
              {headerTitle}
            </h2>
          </div>
          {headerActions && (
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {headerActions}
            </div>
          )}
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
          {footer}
        </main>
      </div>
    </div>
  );
}
