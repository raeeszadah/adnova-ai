import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getRoleFromIdentity } from "./roles";

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const adminUser = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();

  const jwtRole = getRoleFromIdentity(
    identity as unknown as Record<string, unknown>
  );
  const isAdminFromJwt = jwtRole === "admin";
  const isAdminFromDb = adminUser?.role === "admin";

  if (!isAdminFromJwt && !isAdminFromDb) {
    throw new Error("Forbidden: admin access required");
  }

  if (adminUser?.suspended) {
    throw new Error("Forbidden: admin account suspended");
  }

  if (!adminUser) {
    throw new Error(
      "Forbidden: complete sign-in once so your account syncs, then retry"
    );
  }

  return { identity, adminUser };
}
