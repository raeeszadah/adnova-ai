import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import { enqueueScriptGeneration } from "@/lib/inngest-enqueue";
import { runScriptGenerationStep } from "@/lib/pipeline/steps";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureConvexUser(userId);

    const { title, description, videoId, avatarId, voiceId } = await req.json();

    if (!title || !description || !videoId) {
      return NextResponse.json(
        { error: "Missing title, description, or videoId" },
        { status: 400 }
      );
    }

    const id = videoId as Id<"videos">;
    const payload = {
      videoId,
      clerkId: userId,
      title,
      description,
      avatarId,
      voiceId,
    };

    const { queued } = await enqueueScriptGeneration(payload);

    if (queued) {
      return NextResponse.json(
        {
          videoId,
          status: "GENERATING_SCRIPT",
          queued: true,
          message: "Script generation queued",
        },
        { status: 202 }
      );
    }

    const { script, provider } = await runScriptGenerationStep({
      videoId: id,
      title,
      description,
      avatarId,
      voiceId,
    });
    return NextResponse.json({ script, videoId, provider, queued: false });
  } catch (error) {
    console.error("Script generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate script",
      },
      { status: 500 }
    );
  }
}
