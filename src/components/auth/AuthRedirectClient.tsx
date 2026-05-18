"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getRoleFromPublicMetadata } from "@/lib/auth/roles";

/**
 * Client-side post-login redirect so we read fresh publicMetadata
 * (avoids SSR session lag right after metadata updates).
 */
export function AuthRedirectClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const syncRole = useMutation(api.users.syncClerkRole);
  const didRedirect = useRef(false);

  useEffect(() => {
    if (!isLoaded || !userLoaded || convexLoading || didRedirect.current) return;
    if (isSignedIn && !isAuthenticated) return;

    if (!isSignedIn) {
      didRedirect.current = true;
      router.replace("/sign-in");
      return;
    }

    if (!user) return;

    let cancelled = false;

    void (async () => {
      try {
        await user.reload();
      } catch {
        /* proceed with cached metadata */
      }
      if (cancelled) return;

      const role = getRoleFromPublicMetadata(user.publicMetadata);

      try {
        await syncRole({ role });
      } catch {
        /* Convex sync is best-effort; Clerk metadata is source of truth for UI */
      }
      if (cancelled) return;

      didRedirect.current = true;
      router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isLoaded,
    userLoaded,
    isSignedIn,
    isAuthenticated,
    convexLoading,
    user,
    router,
    syncRole,
  ]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
