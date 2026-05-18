import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AuthHints } from "./AuthHints";

export function AuthShell({
  children,
  variant = "sign-in",
}: {
  children: React.ReactNode;
  variant?: "sign-in" | "sign-up";
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-background px-4 py-8 sm:py-12">
      <div className="footer-glow-primary pointer-events-none absolute inset-0" />
      <div className="footer-glow-secondary pointer-events-none absolute inset-0" />

      <Link
        href="/"
        className="relative z-10 mb-8 flex shrink-0 items-center transition-opacity hover:opacity-90"
        aria-label="AdNova AI home"
      >
        <BrandLogo size="xl" priority />
      </Link>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex w-full max-w-[440px] flex-col items-center">
          {children}
        </div>
        <div className="hidden w-full max-w-sm lg:block">
          <AuthHints variant={variant} />
        </div>
      </div>
    </div>
  );
}
