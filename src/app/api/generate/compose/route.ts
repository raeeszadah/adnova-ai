import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import { enqueueVideoCompose } from "@/lib/inngest-enqueue";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Queues Remotion composition only (avatar must already exist).
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureConvexUser(userId);

    const body = await req.json();
    const videoId = body.videoId as Id<"videos">;

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const video = await fetchQuery(api.videos.getById, { videoId });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const avatarVideoUrl = body.avatarVideoUrl ?? video.avatarVideoUrl;
    if (!avatarVideoUrl) {
      return NextResponse.json(
        { error: "Avatar video required before composition" },
        { status: 400 }
      );
    }

    if (body.avatarVideoUrl && body.avatarVideoUrl !== video.avatarVideoUrl) {
      await fetchMutation(api.videos.updateAvatar, {
        videoId,
        avatarVideoUrl: body.avatarVideoUrl,
      });
    }

    await fetchMutation(api.videos.setStatus, {
      videoId,
      status: "COMPOSING",
    });

    const { queued } = await enqueueVideoCompose(videoId, userId);

    return NextResponse.json(
      {
        videoId,
        status: "COMPOSING",
        queued,
        message: "Video composition queued",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Compose queue error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to queue composition",
      },
      { status: 500 }
    );
  }
}
