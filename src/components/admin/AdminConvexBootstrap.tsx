"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { getRoleFromPublicMetadata } from "@/lib/auth/roles";

/** Syncs Clerk admin role into Convex when visiting /admin directly. */
export function AdminConvexBootstrap() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const syncRole = useMutation(api.users.syncClerkRole);

  useEffect(() => {
    if (!isLoaded || !user || convexLoading || !isAuthenticated) return;
    const role = getRoleFromPublicMetadata(user.publicMetadata);
    if (role !== "admin") return;
    void syncRole({ role: "admin" }).catch(() => {});
  }, [isLoaded, user, convexLoading, isAuthenticated, syncRole]);

  return null;
}
