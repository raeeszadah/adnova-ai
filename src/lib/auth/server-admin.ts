import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import {
  getRoleFromClerkUser,
  getRoleFromPublicMetadata,
  getRoleFromSessionClaims,
  type AppRole,
} from "@/lib/auth/roles";

/**
 * Authoritative server-side admin check: JWT claims first, then Clerk User API
 * (always has up-to-date publicMetadata).
 */
export async function resolveAdminRole(): Promise<{
  isAdmin: boolean;
  role: AppRole;
  userId: string | null;
}> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { isAdmin: false, role: "user", userId: null };
  }

  const fromClaims = getRoleFromSessionClaims(
    sessionClaims as Record<string, unknown> | null
  );
  if (fromClaims === "admin") {
    return { isAdmin: true, role: "admin", userId };
  }
  if (fromClaims === "user") {
    return { isAdmin: false, role: "user", userId };
  }

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const role = getRoleFromPublicMetadata(clerkUser.publicMetadata);
    return { isAdmin: role === "admin", role, userId };
  } catch {
    const user = await currentUser();
    const role = getRoleFromClerkUser(user);
    return { isAdmin: role === "admin", role, userId };
  }
}

export async function assertAdminOrRedirect(): Promise<void> {
  const { isAdmin, userId } = await resolveAdminRole();
  if (!userId) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }
  if (!isAdmin) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }
}
