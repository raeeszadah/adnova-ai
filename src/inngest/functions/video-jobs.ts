import type { Id } from "../../../convex/_generated/dataModel";
import { inngest } from "../client";
import { api, jobMutation } from "@/lib/convex-job";
import {
  pollHeyGenOnce,
  runHeyGenStartStep,
  runRemotionComposeStep,
  runScriptGenerationStep,
  saveHeyGenResultStep,
  setPipelineProgress,
} from "@/lib/pipeline/steps";

/** Gemini / OpenRouter script generation (background). */
export const generateVideoScriptJob = inngest.createFunction(
  {
    id: "adnova-generate-video-script",
    name: "Generate ad script",
    retries: 2,
    concurrency: { limit: 15 },
    triggers: [{ event: "video/script.generate" }],
  },
  async ({ event, step }) => {
    const { videoId, title, description, avatarId, voiceId } = event.data;

    try {
      await step.run("generate-script", async () =>
        runScriptGenerationStep({
          videoId: videoId as Id<"videos">,
          title,
          description,
          avatarId,
          voiceId,
        })
      );
      return { ok: true, videoId };
    } catch (error) {
      await step.run("mark-script-failed", async () => {
        await jobMutation(api.videos.markFailed, {
          videoId: videoId as Id<"videos">,
          errorMessage:
            error instanceof Error ? error.message : "Script generation failed",
        });
      });
      throw error;
    }
  }
);

/** HeyGen avatar + Remotion compose pipeline (background render queue). */
export const runVideoPipelineJob = inngest.createFunction(
  {
    id: "adnova-video-pipeline",
    name: "Video generation pipeline",
    retries: 1,
    timeouts: { finish: "45m" },
    concurrency: [
      { scope: "fn", limit: 10 },
      { key: "event.data.clerkId", limit: 2 },
    ],
    triggers: [{ event: "video/pipeline.run" }],
  },
  async ({ event, step }) => {
    const { videoId, clerkId } = event.data;
    const id = videoId as Id<"videos">;

    try {
      const heygenStart = await step.run("heygen-start", async () =>
        runHeyGenStartStep(id)
      );

      let avatarVideoUrl = heygenStart.avatarVideoUrl;

      if (!heygenStart.completed) {
        const maxPolls = 120;
        for (let attempt = 0; attempt < maxPolls; attempt++) {
          if (attempt > 0) {
            await step.sleep(`heygen-wait-${attempt}`, "10s");
          }

          const poll = await step.run(`heygen-poll-${attempt}`, async () =>
            pollHeyGenOnce(heygenStart.heygenVideoId)
          );

          if (poll.status === "completed" && poll.videoUrl) {
            avatarVideoUrl = poll.videoUrl;
            break;
          }
          if (poll.status === "failed") {
            throw new Error(poll.error ?? "HeyGen avatar generation failed");
          }

          if (attempt % 6 === 0) {
            await step.run(`heygen-progress-${attempt}`, async () =>
              setPipelineProgress(
                id,
                "heygen",
                Math.min(70, 30 + Math.floor((attempt / maxPolls) * 40))
              )
            );
          }
        }

        const resolvedAvatarUrl = avatarVideoUrl;
        if (!resolvedAvatarUrl) {
          throw new Error(
            "HeyGen is still rendering after 20 minutes. Try again later from My Videos."
          );
        }

        await step.run("heygen-save", async () =>
          saveHeyGenResultStep(id, resolvedAvatarUrl, heygenStart.heygenVideoId)
        );
      }

      const finalUrl = await step.run("remotion-compose", async () =>
        runRemotionComposeStep(id, clerkId)
      );

      return { ok: true, videoId, finalUrl };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Video generation failed";

      await step.run("mark-pipeline-failed", async () => {
        await jobMutation(api.videos.markFailed, {
          videoId: id,
          errorMessage: message,
        });
        await jobMutation(api.apiLogs.createLog, {
          requestId: crypto.randomUUID(),
          apiType: "PIPELINE",
          status: "FAILED",
          processingTime: 0,
          message,
        });
      });

      throw error;
    }
  }
);

/** Remotion-only compose when avatar is already ready (legacy API compat). */
export const runVideoComposeJob = inngest.createFunction(
  {
    id: "adnova-video-compose",
    name: "Remotion video compose",
    retries: 1,
    timeouts: { finish: "30m" },
    concurrency: [
      { scope: "fn", limit: 10 },
      { key: "event.data.clerkId", limit: 2 },
    ],
    triggers: [{ event: "video/pipeline.compose" }],
  },
  async ({ event, step }) => {
    const { videoId, clerkId } = event.data;
    const id = videoId as Id<"videos">;

    try {
      const finalUrl = await step.run("remotion-compose", async () =>
        runRemotionComposeStep(id, clerkId)
      );
      return { ok: true, videoId, finalUrl };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Video composition failed";
      await step.run("mark-compose-failed", async () => {
        await jobMutation(api.videos.markFailed, {
          videoId: id,
          errorMessage: message,
        });
      });
      throw error;
    }
  }
);

export const inngestFunctions = [
  generateVideoScriptJob,
  runVideoPipelineJob,
  runVideoComposeJob,
];
