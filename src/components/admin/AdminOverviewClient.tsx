"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AppIcon } from "@/components/icons";
import { AdminStatCard } from "./AdminStatCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverviewClient() {
  const data = useQuery(api.admin.overview.getPlatformOverview);

  if (data === undefined) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 page-enter sm:space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-extrabold sm:text-3xl">Platform overview</h1>
        <p className="text-muted-foreground mt-1">
          Real-time SaaS metrics for AdNova AI
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total users" value={data.totalUsers} icon="group" />
        <AdminStatCard
          label="Active users"
          value={data.activeUsers}
          sub={`${data.suspendedUsers} suspended`}
          icon="verified_user"
        />
        <AdminStatCard label="Total videos" value={data.totalVideos} icon="movie" />
        <AdminStatCard
          label="Failed renders"
          value={data.failedVideos}
          icon="error"
          accent="destructive"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Videos today"
          value={data.videosToday}
          sub={`${data.videosWeek} this week`}
          icon="today"
        />
        <AdminStatCard
          label="Processing"
          value={data.processingVideos}
          icon="hourglass_top"
          accent="secondary"
        />
        <AdminStatCard
          label="API failures"
          value={data.apiFailures}
          sub={`${data.apiSuccess} successes`}
          icon="bug_report"
          accent="destructive"
        />
        <AdminStatCard
          label="Credits in system"
          value={data.totalCreditsRemaining}
          icon="toll"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="footer-glass rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Plans & revenue</h3>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">FREE users:</span>{" "}
              <span className="font-bold">{data.freeUsers}</span>
            </p>
            <p>
              <span className="text-muted-foreground">PRO users:</span>{" "}
              <span className="font-bold">{data.proUsers}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Recorded revenue:</span>{" "}
              <span className="font-bold text-primary">${data.revenueTotal}</span>
            </p>
          </div>
        </div>

        <div className="footer-glass rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">API usage by type</h3>
          <div className="space-y-2">
            {Object.entries(data.apiByType).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="w-20 shrink-0 truncate font-mono text-xs sm:w-28">{type}</span>
                <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min(100, (count / Math.max(data.apiSuccess + data.apiFailures, 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold w-8 text-right">{count}</span>
              </div>
            ))}
            {Object.keys(data.apiByType).length === 0 && (
              <p className="text-sm text-muted-foreground">No API logs yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="footer-glass rounded-2xl border border-border p-6">
        <h3 className="font-bold mb-4">System activity feed</h3>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {data.recentActivity.map((item, i) => (
            <li
              key={`${item.at}-${i}`}
              className="flex flex-col gap-1 border-b border-border/50 pb-2 text-sm last:border-0 sm:flex-row sm:gap-3"
            >
              <AppIcon
                name={item.type === "admin" ? "shield" : "api"}
                size="md"
                className={
                  item.type === "admin" ? "text-secondary" : "text-primary"
                }
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{item.label}</p>
                {item.details ? (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.details}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground sm:ml-auto">
                {new Date(item.at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
