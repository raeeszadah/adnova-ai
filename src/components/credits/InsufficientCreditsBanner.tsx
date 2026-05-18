"use client";

import Link from "next/link";
import { AppIcon } from "@/components/icons";

export function InsufficientCreditsBanner({ credits }: { credits: number }) {
  if (credits > 0) return null;

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center space-y-4">
      <AppIcon name="toll" size="2xl" className="text-primary" active />
      <div>
        <p className="font-bold text-foreground">You&apos;re out of credits</p>
        <p className="text-sm text-muted-foreground mt-1">
          Each video uses 1 credit. Upgrade your plan or buy credits to continue.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105 transition-transform"
        >
          Upgrade Plan
        </Link>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-6 py-2.5 text-sm font-bold hover:bg-foreground/10 transition-colors"
        >
          Buy Credits
        </Link>
      </div>
    </div>
  );
}
