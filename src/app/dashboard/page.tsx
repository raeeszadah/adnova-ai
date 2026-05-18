import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchQuery, fetchMutation } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { AppIcon, type IconName } from "@/components/icons";
import { VideoPlayer } from "@/components/VideoPlayer";

export default async function DashboardPage() {
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
  const videos = user?.videos || [];
  const firstName = clerkUser?.firstName ?? user?.name?.split(" ")[0] ?? "there";

  const stats: { label: string; value: number; icon: IconName }[] = [
    { label: "Total Videos", value: videos.length, icon: "movie" },
    { label: "Credits Left", value: user?.credits ?? 0, icon: "credit_card" },
    {
      label: "Completed",
      value: videos.filter((v) => v.status === "COMPLETED").length,
      icon: "check_circle",
    },
    {
      label: "Processing",
      value: videos.filter((v) =>
        ["PROCESSING_AVATAR", "COMPOSING", "AVATAR_GENERATED"].includes(v.status)
      ).length,
      icon: "progress_activity",
    },
  ];

  const recentVideos = videos.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2 font-headline text-2xl font-extrabold text-foreground sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your video ads
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(209,255,0,0.3)] hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
        >
          <AppIcon name="add_circle" size="lg" />
          Create Video
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <AppIcon name={s.icon} size="xl" className="text-primary" active />
            </div>
            <p className="text-2xl font-extrabold text-foreground sm:text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold">Recent Videos</h2>
          {videos.length > 0 && (
            <Link
              href="/dashboard/videos"
              className="text-sm text-primary font-semibold hover:underline"
            >
              View all
            </Link>
          )}
        </div>
        {recentVideos.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="mb-4">No videos yet. Create your first ad!</p>
            <Link
              href="/dashboard/create"
              className="text-primary font-bold hover:underline"
            >
              Get started
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentVideos.map((video) => (
              <div
                key={video._id}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-20 h-14 rounded-lg bg-black/30 overflow-hidden flex-shrink-0">
                  {(video as { playbackUrl?: string }).playbackUrl ? (
                    <VideoPlayer
                      videoId={video._id}
                      className="w-full h-full object-cover"
                      preview
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AppIcon name="movie" size="xl" className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {video.title ?? "Untitled Ad"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(video._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-black/30 border border-border">
                  {video.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
