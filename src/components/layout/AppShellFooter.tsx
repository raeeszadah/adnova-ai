import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  APP_SHELL_FOOTER_NAV,
  FOOTER_VERSION,
  type AppShellFooterVariant,
} from "@/lib/footer-config";

type AppShellFooterProps = {
  variant?: AppShellFooterVariant;
};

export function AppShellFooter({ variant = "dashboard" }: AppShellFooterProps) {
  const links = APP_SHELL_FOOTER_NAV[variant];
  const homeHref = variant === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <footer
      className="app-shell-footer relative shrink-0 border-t border-border bg-background/80 backdrop-blur-xl"
      aria-label="Application footer"
    >
      <div className="app-shell-footer-glow pointer-events-none absolute inset-x-0 top-0 h-px" />

      <div className="relative flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={homeHref}
            className="group inline-flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
            aria-label={
              variant === "admin" ? "AdNova AI admin home" : "AdNova AI dashboard home"
            }
          >
            <BrandLogo
              variant={variant === "admin" ? "mark" : "lockup"}
              size={variant === "admin" ? "sm" : "md"}
            />
            {variant === "admin" && (
              <span className="rounded border border-secondary/40 bg-secondary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-secondary">
                Admin
              </span>
            )}
          </Link>

          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />

          <nav
            className="hidden flex-wrap items-center gap-1 lg:flex"
            aria-label="Quick navigation"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {variant === "admin" ? (
              <Link
                href="/dashboard"
                className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                User app
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                Home
              </Link>
            )}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <p className="text-[10px] text-muted-foreground sm:max-w-[220px] sm:text-right">
            © 2026 Team NovaMinds · MIT ADT
          </p>
          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="rounded-md border border-border bg-foreground/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              v{FOOTER_VERSION}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
