"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  const isConvexSync =
    error.message.includes("Could not find public function") ||
    error.message.includes("npx convex dev");

  return (
    <div className="max-w-lg space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <h2 className="font-headline text-xl font-bold">Admin panel error</h2>
      {isConvexSync ? (
        <p className="text-sm text-muted-foreground">
          Convex backend is not running or is out of date. In a second terminal
          run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            npx convex dev
          </code>{" "}
          (keep it running), or deploy once with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            npx convex deploy
          </code>
          , then refresh this page.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
