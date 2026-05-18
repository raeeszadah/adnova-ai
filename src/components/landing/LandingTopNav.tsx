"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand";
import { LandingNavActions } from "@/components/landing/LandingNavActions";
import { LandingNavLinks } from "@/components/landing/LandingNavLinks";
import { cn } from "@/lib/utils";

export function LandingTopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-16 w-full min-w-0 items-center justify-between gap-2 border-b border-white/5 bg-background/80 px-4 backdrop-blur-xl sm:h-20 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-12">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            aria-label="AdNova AI home"
          >
            <BrandLogo size="nav" priority />
          </Link>
          <LandingNavLinks />
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:gap-4 lg:flex lg:gap-6">
          <LandingNavActions />
          <Show when="signed-out">
            <SignInButton mode="redirect" forceRedirectUrl="/auth/redirect">
              <button className="rounded-full px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-foreground/5 sm:px-6">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
              <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-black shadow-[0_0_14px_rgba(209,255,0,0.22)] transition-all duration-200 hover:scale-105 active:scale-95 sm:px-6">
                Get Started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-black shadow-[0_0_14px_rgba(209,255,0,0.22)] transition-all duration-200 hover:scale-105 active:scale-95 sm:px-6"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <div className="sm:hidden">
            <LandingNavActions />
          </div>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-foreground/[0.04] text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] max-w-[90vw] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="text-sm font-bold text-muted-foreground">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
            <LandingNavLinks
              variant="mobile"
              onNavigate={() => setOpen(false)}
            />
            <div className="hidden border-t border-border pt-4 sm:block">
              <LandingNavActions />
            </div>
            <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
              <Show when="signed-out">
                <SignInButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-border py-3 text-sm font-bold"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button
                    type="button"
                    className="w-full rounded-full bg-primary py-3 text-sm font-bold text-black"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-bold text-black"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

