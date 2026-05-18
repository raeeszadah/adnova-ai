"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppIcon, type IconName } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LANDING_NOTIFICATIONS } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

type Panel = "notifications" | "settings" | null;

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onOutside: () => void,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, active]);
}

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={active}
      className={cn(
        "relative rounded-full p-2 transition-all text-muted-foreground",
        active
          ? "bg-primary/15 text-primary"
          : "hover:bg-foreground/5 hover:text-foreground"
      )}
    >
      {children}
      {label === "Notifications" && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
      )}
    </button>
  );
}

export function LandingNavActions() {
  const { isSignedIn } = useAuth();
  const [panel, setPanel] = useState<Panel>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setPanel(null), []);
  useClickOutside(containerRef, close, panel !== null);

  const toggle = (next: Panel) => {
    setPanel((current) => (current === next ? null : next));
  };

  const notifications = isSignedIn
    ? LANDING_NOTIFICATIONS
    : [
        {
          id: "sign-in",
          title: "Sign in for updates",
          body: "Get notified when your AI videos finish rendering.",
          href: "/sign-in",
          time: "",
        },
      ];

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <IconButton
        label="Notifications"
        active={panel === "notifications"}
        onClick={() => toggle("notifications")}
      >
        <AppIcon name="notifications" size="lg" />
      </IconButton>

      <IconButton
        label="Settings"
        active={panel === "settings"}
        onClick={() => toggle("settings")}
      >
        <AppIcon name="settings" size="lg" />
      </IconButton>

      {panel === "notifications" && (
        <div
          className="footer-glass absolute right-0 top-full z-50 mt-3 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-border shadow-2xl"
          role="menu"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">Notifications</p>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
              aria-label="Close notifications"
            >
              <AppIcon name="close" size="lg" />
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {notifications.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block px-4 py-3 transition-colors hover:bg-foreground/5"
                >
                  <NotificationItem {...item} />
                </Link>
              </li>
            ))}
          </ul>
          {isSignedIn && (
            <div className="border-t border-border px-4 py-2">
              <Link
                href="/dashboard/videos"
                onClick={close}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all activity →
              </Link>
            </div>
          )}
        </div>
      )}

      {panel === "settings" && (
        <div
          className="footer-glass absolute right-0 top-full z-50 mt-3 w-[min(100vw-2rem,16rem)] overflow-hidden rounded-2xl border border-border shadow-2xl"
          role="menu"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">Quick settings</p>
          </div>
          <div className="space-y-1 p-2">
            <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <SettingsLink href="/dashboard" icon="dashboard" onClick={close}>
              Dashboard
            </SettingsLink>
            <SettingsLink href="/dashboard/create" icon="add_circle" onClick={close}>
              Create video
            </SettingsLink>
            <SettingsLink href="/dashboard/videos" icon="video_library" onClick={close}>
              My videos
            </SettingsLink>
            <SettingsLink href="/dashboard/billing" icon="payments" onClick={close}>
              Billing
            </SettingsLink>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  title,
  body,
  time,
}: {
  title: string;
  body: string;
  time: string;
}) {
  return (
    <>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
        {body}
      </p>
      {time ? (
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-primary/80">
          {time}
        </p>
      ) : null}
    </>
  );
}

function SettingsLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: IconName;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      <AppIcon name={icon} size="lg" className="text-primary" />
      {children}
    </Link>
  );
}
