"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AdminStatCard } from "./AdminStatCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminAnalyticsClient() {
  const overview = useQuery(api.admin.overview.getPlatformOverview);
  const apiAnalytics = useQuery(api.admin.apiLogs.getApiAnalytics);

  if (overview === undefined || apiAnalytics === undefined) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 page-enter sm:space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-extrabold sm:text-3xl">Analytics</h1>
        <p className="text-muted-foreground mt-1">Credits, usage, and growth</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="Videos (month)"
          value={overview.videosMonth}
          sub={`${overview.videosWeek} this week`}
          icon="calendar_month"
        />
        <AdminStatCard
          label="Completed"
          value={overview.completedVideos}
          icon="check_circle"
        />
        <AdminStatCard
          label="API calls"
          value={apiAnalytics.total}
          sub={`${apiAnalytics.failed} failed`}
          icon="insights"
        />
      </div>

      <div className="footer-glass rounded-2xl border border-border p-6">
        <h3 className="font-bold mb-4">Provider performance (avg ms)</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(apiAnalytics.byType).map(([type, stats]) => (
            <div
              key={type}
              className="rounded-xl border border-border bg-foreground/[0.03] p-4"
            >
              <p className="font-mono text-sm font-bold">{type}</p>
              <p className="text-2xl font-extrabold text-primary mt-2">
                {stats.avgMs}ms
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total} calls · {stats.failed} failed
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-glass rounded-2xl border border-border p-6">
        <h3 className="font-bold mb-2">Free-tier monitoring</h3>
        <p className="text-sm text-muted-foreground">
          {overview.freeUsers} users on FREE plan with{" "}
          {overview.totalCreditsRemaining} total credits remaining across all accounts.
          Watch for users with 0 credits still attempting generations (check API failure logs).
        </p>
      </div>
    </div>
  );
}
