import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import { generateHeyGenAvatarVideo } from "@/lib/heygen";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let videoId: Id<"videos"> | undefined;

  try {
    await ensureConvexUser(userId);

    const body = await req.json();
    const { script, avatarId, voiceId } = body;
    videoId = body.videoId as Id<"videos">;

    if (!script || !videoId) {
      return NextResponse.json(
        { error: "Missing script or videoId" },
        { status: 400 }
      );
    }

    const result = await generateHeyGenAvatarVideo(script, {
      avatarId,
      voiceId,
      serverWaitMs: 4.5 * 60 * 1000,
    });

    if (result.avatarVideoUrl) {
      await fetchMutation(api.videos.updateAvatar, {
        videoId: videoId as Id<"videos">,
        avatarVideoUrl: result.avatarVideoUrl,
        heygenVideoId: result.videoId,
      });
    } else {
      await fetchMutation(api.videos.setStatus, {
        videoId: videoId as Id<"videos">,
        status: "PROCESSING_AVATAR",
        heygenVideoId: result.videoId,
      });
    }

    const apiType = result.mockFallback
      ? "HEYGEN_MOCK"
      : process.env.HEYGEN_API_KEY &&
          process.env.HEYGEN_API_KEY !== "placeholder"
        ? "HEYGEN"
        : "HEYGEN_MOCK";

    await fetchMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType,
      status: "SUCCESS",
      processingTime: Date.now() - startTime,
    });

    return NextResponse.json({
      avatarVideoUrl: result.avatarVideoUrl,
      heygenVideoId: result.videoId,
      status: result.status ?? "completed",
      warning: result.warning,
      mockFallback: result.mockFallback,
    });
  } catch (error) {
    console.error("HeyGen Error:", error);

    if (videoId) {
      await fetchMutation(api.videos.markFailed, {
        videoId: videoId as Id<"videos">,
        errorMessage:
          error instanceof Error ? error.message : "Avatar generation failed",
      });
    }

    await fetchMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "HEYGEN",
      status: "FAILED",
      processingTime: Date.now() - startTime,
    });

    const message =
      error instanceof Error ? error.message : "Failed to generate avatar video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
