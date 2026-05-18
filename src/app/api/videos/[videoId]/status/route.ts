import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "@/lib/convex-server";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId: rawId } = await params;
  const video = await fetchQuery(api.videos.getStatusForUser, {
    videoId: rawId as Id<"videos">,
    clerkId: userId,
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json({
    videoId: video._id,
    status: video.status,
    script: video.script,
    finalVideoUrl: video.finalVideoUrl,
    playbackUrl: video.playbackUrl,
    avatarVideoUrl: video.avatarVideoUrl,
    heygenVideoId: video.heygenVideoId,
    errorMessage: video.errorMessage,
    title: video.title,
    pipelinePhase: video.pipelinePhase,
    pipelineProgress: video.pipelineProgress,
  });
}
