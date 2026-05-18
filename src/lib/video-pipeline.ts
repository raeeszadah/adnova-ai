import { api, jobMutation } from "@/lib/convex-job";
import { runHeyGenStep, runRemotionComposeStep } from "@/lib/pipeline/steps";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Legacy inline pipeline — used only when Inngest is not configured (local fallback).
 * Production should set INNGEST_EVENT_KEY / INNGEST_SIGNING_KEY.
 */
export async function runVideoPipeline(
  videoId: Id<"videos">,
  clerkId: string
) {
  const startTime = Date.now();
  try {
    await runHeyGenStep(videoId);
    await runRemotionComposeStep(videoId, clerkId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Video generation failed";

    await jobMutation(api.videos.markFailed, {
      videoId,
      errorMessage: message,
    });

    await jobMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "PIPELINE",
      status: "FAILED",
      processingTime: Date.now() - startTime,
    });

    console.error("Video pipeline failed:", error);
  }
}
