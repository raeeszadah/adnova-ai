import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "@/lib/convex-server";
import { api } from "../../../../convex/_generated/api";
import { VideosGallery } from "./VideosGallery";

export default async function MyVideosPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const user = await fetchQuery(api.users.getUserWithVideos, { clerkId: userId });
  const videos = (user?.videos ?? []).map((v) => ({
    _id: v._id,
    title: v.title,
    status: v.status,
    playbackUrl: (v as { playbackUrl?: string }).playbackUrl ?? v.finalVideoUrl,
    finalVideoUrl: v.finalVideoUrl,
    errorMessage: v.errorMessage,
    _creationTime: v._creationTime,
  }));

  return <VideosGallery videos={videos} />;
}
