import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { generateAdScript } from "@/lib/generate-script";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
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

    const { script, provider } = await generateAdScript(title, description);

    try {
      await fetchMutation(api.apiLogs.createLog, {
        requestId: crypto.randomUUID(),
        apiType: provider === "MOCK" ? "GEMINI_MOCK" : provider,
        status: "SUCCESS",
        processingTime: Date.now() - startTime,
      });
    } catch {
      /* non-blocking */
    }

    await fetchMutation(api.videos.updateScript, {
      videoId: videoId as Id<"videos">,
      script,
      avatarId: avatarId || undefined,
      voiceId: voiceId || undefined,
    });

    return NextResponse.json({ script, videoId, provider });
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
