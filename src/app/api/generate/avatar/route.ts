import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import { enqueueVideoPipeline } from "@/lib/inngest-enqueue";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Queues the full avatar + Remotion pipeline (non-blocking).
 * Prefer POST /api/videos/[videoId]/start from the create wizard.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureConvexUser(userId);

    const body = await req.json();
    const { script, avatarId, voiceId } = body;
    const videoId = body.videoId as Id<"videos">;

    if (!script || !videoId) {
      return NextResponse.json(
        { error: "Missing script or videoId" },
        { status: 400 }
      );
    }

    await fetchMutation(api.videos.updateScript, {
      videoId,
      script,
      avatarId,
      voiceId,
    });

    await fetchMutation(api.videos.setStatus, {
      videoId,
      status: "PROCESSING_AVATAR",
    });

    const { queued } = await enqueueVideoPipeline(videoId, userId);

    return NextResponse.json(
      {
        videoId,
        status: "PROCESSING_AVATAR",
        queued,
        message: "Avatar and video render queued",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("HeyGen queue error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to queue avatar generation",
      },
      { status: 500 }
    );
  }
}
