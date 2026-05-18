"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BrandLogo } from "@/components/brand";
import { AppIcon, type IconName } from "@/components/icons";
import { DEMO_VIDEO_URL } from "@/lib/landing-config";

type LandingDemoContextValue = {
  openDemo: () => void;
  closeDemo: () => void;
};

const LandingDemoContext = createContext<LandingDemoContextValue | null>(null);

export function useLandingDemo() {
  const ctx = useContext(LandingDemoContext);
  if (!ctx) {
    throw new Error("useLandingDemo must be used within LandingDemoProvider");
  }
  return ctx;
}

function DemoVideoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div
        className="footer-glass relative w-full max-w-4xl overflow-hidden rounded-3xl border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            id="demo-modal-title"
            className="font-headline text-xl font-bold text-foreground"
          >
            AdNova AI Product Demo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            aria-label="Close demo"
          >
            <AppIcon name="close" size="lg" />
          </button>
        </div>

        <div className="p-6">
          {DEMO_VIDEO_URL ? (
            <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black">
              <video
                src={DEMO_VIDEO_URL}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              >
                Your browser does not support video playback.
              </video>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-foreground/5">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <BrandLogo size="2xl" />
                  <p className="max-w-md text-muted-foreground">
                    Upload a product image, generate an AI script, pick a HeyGen
                    avatar, and export a cinematic ad — all in one workflow.
                  </p>
                </div>
              </div>

              <ol className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { step: "1", label: "Upload product", icon: "upload" },
                    { step: "2", label: "AI script + avatar", icon: "auto_awesome" },
                    { step: "3", label: "Export video ad", icon: "download" },
                  ] as const
                ).map(({ step, label, icon }) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-border bg-foreground/[0.03] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                      {step}
                    </span>
                    <AppIcon name={icon} size="md" className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/create"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              Try it now
              <AppIcon name="arrow_forward" size="sm" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border bg-foreground/5 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-foreground/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingDemoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openDemo = useCallback(() => setOpen(true), []);
  const closeDemo = useCallback(() => setOpen(false), []);

  return (
    <LandingDemoContext.Provider value={{ openDemo, closeDemo }}>
      {children}
      <DemoVideoModal open={open} onClose={closeDemo} />
    </LandingDemoContext.Provider>
  );
}

export function LandingDemoButton({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openDemo } = useLandingDemo();
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        openDemo();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
