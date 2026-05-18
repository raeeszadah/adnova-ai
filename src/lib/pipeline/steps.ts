import type { Id } from "../../../convex/_generated/dataModel";
import { api, jobMutation, jobQuery } from "@/lib/convex-job";
import { generateAdScript, type ScriptProvider } from "@/lib/generate-script";
import {
  fetchHeyGenVideoStatus,
  generateHeyGenAvatarVideo,
  waitForHeyGenVideo,
} from "@/lib/heygen";
import {
  cleanupRenderFile,
  renderAdVideo,
} from "@/lib/remotion-render";
import { uploadFileToConvex } from "@/lib/storage-upload";

export async function setPipelineProgress(
  videoId: Id<"videos">,
  pipelinePhase: string,
  pipelineProgress: number
) {
  await jobMutation(api.videos.updatePipelineProgress, {
    videoId,
    pipelinePhase,
    pipelineProgress,
  });
}

export async function runScriptGenerationStep(args: {
  videoId: Id<"videos">;
  title: string;
  description: string;
  avatarId?: string;
  voiceId?: string;
}): Promise<{ script: string; provider: ScriptProvider }> {
  const startTime = Date.now();
  await jobMutation(api.videos.setStatus, {
    videoId: args.videoId,
    status: "GENERATING_SCRIPT",
  });
  await setPipelineProgress(args.videoId, "script", 12);

  const { script, provider } = await generateAdScript(args.title, args.description);

  await jobMutation(api.videos.updateScript, {
    videoId: args.videoId,
    script,
    avatarId: args.avatarId,
    voiceId: args.voiceId,
  });
  await setPipelineProgress(args.videoId, "script", 100);

  try {
    await jobMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: provider === "MOCK" ? "GEMINI_MOCK" : provider,
      status: "SUCCESS",
      processingTime: Date.now() - startTime,
    });
  } catch {
    /* non-blocking */
  }

  return { script, provider };
}

/** Start HeyGen and return quickly when still processing (for Inngest polling). */
export async function runHeyGenStartStep(videoId: Id<"videos">): Promise<{
  heygenVideoId: string;
  avatarVideoUrl?: string;
  completed: boolean;
}> {
  const video = await jobQuery(api.videos.getById, { videoId });
  if (!video?.script) {
    throw new Error("Video is missing script");
  }

  await jobMutation(api.videos.setStatus, {
    videoId,
    status: "PROCESSING_AVATAR",
  });
  await setPipelineProgress(videoId, "avatar", 20);

  const heygenResult = await generateHeyGenAvatarVideo(video.script, {
    avatarId: video.avatarId,
    voiceId: video.voiceId,
    serverWaitMs: 8_000,
  });

  if (heygenResult.avatarVideoUrl) {
    await jobMutation(api.videos.updateAvatar, {
      videoId,
      avatarVideoUrl: heygenResult.avatarVideoUrl,
      heygenVideoId: heygenResult.videoId,
    });
    await setPipelineProgress(videoId, "heygen", 72);
    return {
      heygenVideoId: heygenResult.videoId,
      avatarVideoUrl: heygenResult.avatarVideoUrl,
      completed: true,
    };
  }

  await jobMutation(api.videos.setStatus, {
    videoId,
    status: "PROCESSING_AVATAR",
    heygenVideoId: heygenResult.videoId,
  });
  await setPipelineProgress(videoId, "heygen", 30);

  return {
    heygenVideoId: heygenResult.videoId,
    completed: false,
  };
}

export async function pollHeyGenOnce(heygenVideoId: string) {
  return fetchHeyGenVideoStatus(heygenVideoId);
}

export async function saveHeyGenResultStep(
  videoId: Id<"videos">,
  avatarVideoUrl: string,
  heygenVideoId: string
) {
  await jobMutation(api.videos.updateAvatar, {
    videoId,
    avatarVideoUrl,
    heygenVideoId,
  });
  await setPipelineProgress(videoId, "heygen", 72);
}

/** Full HeyGen step with inline polling (local fallback only). */
export async function runHeyGenStep(videoId: Id<"videos">): Promise<{
  avatarVideoUrl: string;
  heygenVideoId: string;
}> {
  const video = await jobQuery(api.videos.getById, { videoId });
  if (!video?.script || !video.productImageUrl) {
    throw new Error("Video is missing script or product image");
  }

  await jobMutation(api.videos.setStatus, {
    videoId,
    status: "PROCESSING_AVATAR",
  });
  await setPipelineProgress(videoId, "avatar", 20);

  const heygenResult = await generateHeyGenAvatarVideo(video.script, {
    avatarId: video.avatarId,
    voiceId: video.voiceId,
    serverWaitMs: 4.5 * 60 * 1000,
  });

  let avatarVideoUrl = heygenResult.avatarVideoUrl;
  const heygenId = heygenResult.videoId;

  if (!avatarVideoUrl && heygenResult.status === "processing") {
    await setPipelineProgress(videoId, "heygen", 35);
    await jobMutation(api.videos.setStatus, {
      videoId,
      status: "PROCESSING_AVATAR",
      heygenVideoId: heygenId,
    });

    avatarVideoUrl = await waitForHeyGenVideo(heygenId, {
      maxWaitMs: 14 * 60 * 1000,
      pollIntervalMs: 5_000,
    });
  }

  if (!avatarVideoUrl) {
    throw new Error("HeyGen did not return an avatar video URL");
  }

  await jobMutation(api.videos.updateAvatar, {
    videoId,
    avatarVideoUrl,
    heygenVideoId: heygenId,
  });
  await setPipelineProgress(videoId, "heygen", 72);

  return { avatarVideoUrl, heygenVideoId: heygenId };
}

export async function runRemotionComposeStep(
  videoId: Id<"videos">,
  clerkId: string
): Promise<string> {
  const video = await jobQuery(api.videos.getById, { videoId });
  if (!video?.avatarVideoUrl || !video.productImageUrl || !video.script) {
    throw new Error("Video is missing assets required for composition");
  }

  await jobMutation(api.videos.setStatus, {
    videoId,
    status: "COMPOSING",
  });
  await setPipelineProgress(videoId, "compose", 78);

  const startTime = Date.now();
  const outputPath = await renderAdVideo({
    avatarVideoUrl: video.avatarVideoUrl,
    productImageUrl: video.productImageUrl,
    scriptText: video.script,
  });

  try {
    const { storageId, url: finalVideoUrl } = await uploadFileToConvex(
      outputPath,
      "video/mp4"
    );

    await jobMutation(api.videos.updateFinal, {
      videoId,
      finalVideoUrl,
      finalStorageId: storageId,
      status: "COMPLETED",
    });

    await jobMutation(api.users.decrementCredits, {
      clerkId,
      amount: 1,
    });

    await setPipelineProgress(videoId, "finalize", 100);

    await jobMutation(api.apiLogs.createLog, {
      requestId: crypto.randomUUID(),
      apiType: "REMOTION",
      status: "SUCCESS",
      processingTime: Date.now() - startTime,
    });

    return finalVideoUrl;
  } finally {
    await cleanupRenderFile(outputPath);
  }
}
