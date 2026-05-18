import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import {
  cleanupRenderFile,
  renderAdVideo,
} from "@/lib/remotion-render";
import { uploadFileToConvex } from "@/lib/storage-upload";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let videoId: Id<"videos"> | null = null;
  let outputPath: string | null = null;

  try {
    await ensureConvexUser(userId);

    const body = await req.json();
    videoId = body.videoId as Id<"videos">;

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const video = await fetchQuery(api.videos.getById, { videoId });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const avatarVideoUrl =
      body.avatarVideoUrl ?? video.avatarVideoUrl;
    const productImageUrl =
      body.productImageUrl ?? video.productImageUrl;
    const scriptText = body.scriptText ?? video.script;

    if (!avatarVideoUrl || !productImageUrl || !scriptText) {
      return NextResponse.json(
        {
          error:
            "Missing avatar video, product image, or script for composition",
        },
        { status: 400 }
      );
    }

    outputPath = await renderAdVideo({
      avatarVideoUrl,
      productImageUrl,
      scriptText,
    });

    const { storageId, url: finalVideoUrl } = await uploadFileToConvex(
      outputPath,
      "video/mp4"
    );

    await fetchMutation(api.videos.updateFinal, {
      videoId,
      finalVideoUrl,
      finalStorageId: storageId,
      status: "COMPLETED",
    });

    await fetchMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "REMOTION",
      status: "SUCCESS",
      processingTime: Date.now() - startTime,
    });

    await fetchMutation(api.users.decrementCredits, {
      clerkId: userId,
      amount: 1,
    });

    return NextResponse.json({
      finalUrl: finalVideoUrl,
      status: "completed",
      videoId,
    });
  } catch (error) {
    console.error("Remotion Error:", error);

    if (videoId) {
      await fetchMutation(api.videos.markFailed, {
        videoId,
        errorMessage:
          error instanceof Error ? error.message : "Video composition failed",
      });
    }

    await fetchMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "REMOTION",
      status: "FAILED",
      processingTime: Date.now() - startTime,
    });

    const message =
      error instanceof Error ? error.message : "Failed to compose video";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (outputPath) {
      await cleanupRenderFile(outputPath);
    }
  }
}
