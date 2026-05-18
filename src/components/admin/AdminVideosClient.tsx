"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminVideosClient() {
  const [status, setStatus] = useState<string>("");
  const videos = useQuery(api.admin.videos.listAllVideos, {
    status: status || undefined,
    limit: 80,
  });

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold">Video monitoring</h1>
          <p className="text-muted-foreground mt-1">Platform-wide render pipeline</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-border bg-foreground/5 px-4 py-2.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING_AVATAR">Processing avatar</option>
          <option value="COMPOSING">Composing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {videos === undefined ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="grid gap-4">
          {videos.map((v) => (
            <div
              key={v._id}
              className="footer-glass rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{v.title ?? "Untitled"}</p>
                <p className="text-xs text-muted-foreground">
                  {v.userEmail} · {v.userName ?? "—"}
                </p>
                {v.errorMessage ? (
                  <p className="text-xs text-destructive mt-1 truncate">{v.errorMessage}</p>
                ) : null}
              </div>
              <span
                className={`shrink-0 text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                  v.status === "COMPLETED"
                    ? "border-primary/40 text-primary bg-primary/10"
                    : v.status === "FAILED"
                      ? "border-destructive/40 text-destructive bg-destructive/10"
                      : "border-border text-muted-foreground"
                }`}
              >
                {v.status}
              </span>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No videos found.</p>
          )}
        </div>
      )}
    </div>
  );
}
