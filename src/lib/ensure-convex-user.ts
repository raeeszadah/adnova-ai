import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../convex/_generated/api";
import { getRoleFromClerkUser } from "@/lib/auth/roles";

/** Ensures the signed-in Clerk user exists in Convex before mutations that need a user row. */
export async function ensureConvexUser(clerkId: string) {
  const user = await currentUser();
  const role = getRoleFromClerkUser(user);
  await fetchMutation(api.users.ensureUser, {
    clerkId,
    email:
      user?.emailAddresses[0]?.emailAddress ?? `${clerkId}@user.local`,
    name:
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") || undefined,
    role,
  });
}
