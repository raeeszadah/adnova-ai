import { fetchMutation, fetchQuery } from "@/lib/convex-server";
import { api } from "../../convex/_generated/api";
import {
  generateHeyGenAvatarVideo,
  waitForHeyGenVideo,
} from "@/lib/heygen";
import {
  cleanupRenderFile,
  renderAdVideo,
} from "@/lib/remotion-render";
import { uploadFileToConvex } from "@/lib/storage-upload";
import type { Id } from "../../convex/_generated/dataModel";

export async function runVideoPipeline(
  videoId: Id<"videos">,
  clerkId: string
) {
  const startTime = Date.now();

  try {
    const video = await fetchQuery(api.videos.getById, { videoId });
    if (!video?.script || !video.productImageUrl) {
      throw new Error("Video is missing script or product image");
    }

    await fetchMutation(api.videos.setStatus, {
      videoId,
      status: "PROCESSING_AVATAR",
    });

    const heygenResult = await generateHeyGenAvatarVideo(video.script, {
      avatarId: video.avatarId,
      voiceId: video.voiceId,
      serverWaitMs: 14 * 60 * 1000,
    });

    let avatarVideoUrl = heygenResult.avatarVideoUrl;
    const heygenId = heygenResult.videoId;

    if (!avatarVideoUrl && heygenResult.status === "processing") {
      avatarVideoUrl = await waitForHeyGenVideo(heygenId, {
        maxWaitMs: 10 * 60 * 1000,
        pollIntervalMs: 5_000,
      });
    }

    if (!avatarVideoUrl) {
      throw new Error("HeyGen did not return an avatar video URL");
    }

    await fetchMutation(api.videos.updateAvatar, {
      videoId,
      avatarVideoUrl,
      heygenVideoId: heygenId,
    });

    await fetchMutation(api.videos.setStatus, {
      videoId,
      status: "COMPOSING",
    });

    const outputPath = await renderAdVideo({
      avatarVideoUrl,
      productImageUrl: video.productImageUrl,
      scriptText: video.script,
    });

    try {
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

      await fetchMutation(api.users.decrementCredits, {
        clerkId,
        amount: 1,
      });

      await fetchMutation(api.apiLogs.createLog, {
        requestId: crypto.randomUUID(),
        apiType: "REMOTION",
        status: "SUCCESS",
        processingTime: Date.now() - startTime,
      });
    } finally {
      await cleanupRenderFile(outputPath);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Video generation failed";

    await fetchMutation(api.videos.markFailed, {
      videoId,
      errorMessage: message,
    });

    await fetchMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "PIPELINE",
      status: "FAILED",
      processingTime: Date.now() - startTime,
    });

    console.error("Video pipeline failed:", error);
  }
}
