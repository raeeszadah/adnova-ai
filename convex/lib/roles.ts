export type AppRole = "user" | "admin";

/** Role from Convex JWT identity (Clerk JWT template custom claims). */
export function getRoleFromIdentity(
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
