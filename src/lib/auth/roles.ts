import type { User } from "@clerk/nextjs/server";

export type AppRole = "user" | "admin";

/** Read role from Clerk User (API — includes fresh publicMetadata). */
export function getRoleFromClerkUser(
  user: User | null | undefined
): AppRole {
  const meta = user?.publicMetadata as { role?: string } | undefined;
  return meta?.role === "admin" ? "admin" : "user";
}

/** Read role from Clerk publicMetadata object. */
export function getRoleFromPublicMetadata(
  publicMetadata: unknown
): AppRole {
  const meta = publicMetadata as { role?: string } | undefined;
  return meta?.role === "admin" ? "admin" : "user";
}

/**
 * Read role from JWT session claims.
 * Supports common Clerk JWT template shapes.
 */
export function getRoleFromSessionClaims(
  sessionClaims: Record<string, unknown> | null | undefined
): AppRole | null {
  if (!sessionClaims) return null;

  const direct = sessionClaims.role;
  if (direct === "admin") return "admin";
  if (direct === "user") return "user";

  const metadata = sessionClaims.metadata as { role?: string } | undefined;
  if (metadata?.role === "admin") return "admin";
  if (metadata?.role === "user") return "user";

  const publicMeta = sessionClaims.publicMetadata as
    | { role?: string }
    | undefined;
  if (publicMeta?.role === "admin") return "admin";
  if (publicMeta?.role === "user") return "user";

  const publicSnake = sessionClaims.public_metadata as
    | { role?: string }
    | undefined;
  if (publicSnake?.role === "admin") return "admin";
  if (publicSnake?.role === "user") return "user";

  return null;
}

/** Convex JWT identity custom claims (when Clerk JWT template includes role). */
export function getRoleFromConvexIdentity(
  identity: Record<string, unknown>
): AppRole | null {
  const direct = identity.role;
  if (direct === "admin") return "admin";
  if (direct === "user") return "user";

  const metadata = identity.metadata as { role?: string } | undefined;
  if (metadata?.role === "admin") return "admin";
  if (metadata?.role === "user") return "user";

  return null;
}

export function isAdminRole(role: unknown): role is "admin" {
  return role === "admin";
}
