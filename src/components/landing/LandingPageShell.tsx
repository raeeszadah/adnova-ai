"use client";

import { LandingDemoProvider } from "./LandingDemoContext";

export function LandingPageShell({ children }: { children: React.ReactNode }) {
  return <LandingDemoProvider>{children}</LandingDemoProvider>;
}
