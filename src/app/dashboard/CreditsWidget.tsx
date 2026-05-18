"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { FREE_TIER_CREDITS, PRO_PLAN_MAX_DISPLAY_CREDITS } from "@/lib/saas-constants";

export function CreditsWidget() {
  const { userId } = useAuth();
  const user = useQuery(
    api.users.getUserWithVideos,
    userId ? { clerkId: userId } : "skip"
  );

  const credits = user?.credits ?? FREE_TIER_CREDITS;
  const maxCredits =
    user?.plan === "PRO" ? PRO_PLAN_MAX_DISPLAY_CREDITS : FREE_TIER_CREDITS;
  const percent = Math.min(100, Math.round((credits / maxCredits) * 100));

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold">Credits</span>
        <span className="text-xs font-bold text-primary">
          {credits} Left
        </span>
      </div>
      <div className="w-full bg-black/50 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {credits < 1 ? (
        <div className="mt-3 space-y-1 text-center">
          <Link
            href="/dashboard/billing"
            className="block text-xs font-bold text-primary hover:underline"
          >
            Upgrade Plan
          </Link>
          <Link
            href="/dashboard/billing"
            className="block text-xs text-muted-foreground hover:text-foreground"
          >
            Buy Credits
          </Link>
        </div>
      ) : (
        <Link
          href="/dashboard/billing"
          className="block text-center mt-3 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Upgrade Plan
        </Link>
      )}
    </div>
  );
}
