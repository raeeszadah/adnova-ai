import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchQuery, fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../convex/_generated/api";
import { BillingActions } from "./BillingActions";

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const clerkUser = await currentUser();
  if (clerkUser) {
    try {
      await fetchMutation(api.users.ensureUser, {
        clerkId: userId,
        email:
          clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@user.local`,
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          undefined,
      });
    } catch (e) {
      console.error("ensureUser failed:", e);
    }
  }

  const user = await fetchQuery(api.users.getUserWithVideos, { clerkId: userId });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="mb-2 font-headline text-2xl font-extrabold text-foreground sm:text-3xl">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and purchase more video generation credits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
          <h3 className="text-lg font-bold text-foreground mb-2">Current Credits</h3>
          <div
            className="text-5xl font-extrabold text-primary mb-6"
            style={{ textShadow: "0 0 15px rgba(209,255,0,0.2)" }}
          >
            {user?.credits ?? 0}
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Credits are consumed when you generate a final composed video. 1 video = 1 credit.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 blur-[50px] rounded-full" />
          <h3 className="text-lg font-bold text-foreground mb-2">Current Plan</h3>
          <div className="text-3xl font-extrabold text-foreground mb-2">{user?.plan || "FREE"}</div>
          <p className="text-sm text-muted-foreground mb-8">
            Upgrade to PRO for 50 credits per purchase at a lower cost per video.
          </p>
          <BillingActions />
        </div>
      </div>
    </div>
  );
}
