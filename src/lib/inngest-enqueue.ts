import { after } from "next/server";
import { inngest } from "@/inngest/client";
import { runRemotionComposeStep } from "@/lib/pipeline/steps";
import { runVideoPipeline } from "@/lib/video-pipeline";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * True when Inngest Cloud/dev is configured. Falls back to Next.js `after()` locally.
 */
export function isInngestEnabled(): boolean {
  return Boolean(
    process.env.INNGEST_EVENT_KEY ||
      process.env.INNGEST_SIGNING_KEY ||
      process.env.INNGEST_DEV
  );
}

export async function enqueueScriptGeneration(payload: {
  videoId: string;
  clerkId: string;
  title: string;
  description: string;
  avatarId?: string;
  voiceId?: string;
}) {
  if (isInngestEnabled()) {
    await inngest.send({
      name: "video/script.generate",
      data: payload,
    });
    return { queued: true as const };
  }
  return { queued: false as const };
}

export async function enqueueVideoCompose(videoId: Id<"videos">, clerkId: string) {
  if (isInngestEnabled()) {
    await inngest.send({
      name: "video/pipeline.compose",
      data: { videoId, clerkId },
    });
    return { queued: true as const };
  }

  after(async () => {
    await runRemotionComposeStep(videoId, clerkId);
  });
  return { queued: false as const };
}

export async function enqueueVideoPipeline(videoId: Id<"videos">, clerkId: string) {
  if (isInngestEnabled()) {
    await inngest.send({
      name: "video/pipeline.run",
      data: { videoId, clerkId },
    });
    return { queued: true as const };
  }

  after(async () => {
    await runVideoPipeline(videoId, clerkId);
  });
  return { queued: false as const };
}
