"use client";

import { useConvexAuth } from "convex/react";

export function AdminConvexGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg space-y-3 rounded-2xl border border-border bg-muted/30 p-6 text-sm">
        <p className="font-semibold">Waiting for Convex session</p>
        <p className="text-muted-foreground">
          Ensure the Clerk JWT template{" "}
          <code className="rounded bg-muted px-1">convex</code> is active,{" "}
          <code className="rounded bg-muted px-1">npm run dev:convex</code> is
          running, then sign out and sign in again.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
