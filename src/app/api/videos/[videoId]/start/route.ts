import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../../convex/_generated/api";
import { runVideoPipeline } from "@/lib/video-pipeline";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId: rawId } = await params;
  const videoId = rawId as Id<"videos">;

  try {
    const body = await req.json().catch(() => ({}));
    const { script, avatarId, voiceId } = body as {
      script?: string;
      avatarId?: string;
      voiceId?: string;
    };

    if (script?.trim()) {
      await fetchMutation(api.videos.updateScript, {
        videoId,
        script: script.trim(),
        avatarId,
        voiceId,
      });
    }

    await fetchMutation(api.videos.setStatus, {
      videoId,
      status: "PROCESSING_AVATAR",
    });

    after(async () => {
      await runVideoPipeline(videoId, userId);
    });

    return NextResponse.json({
      videoId,
      status: "PROCESSING_AVATAR",
      message: "Video generation started",
    });
  } catch (error) {
    console.error("Start pipeline error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start generation",
      },
      { status: 500 }
    );
  }
}
