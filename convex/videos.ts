import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    description: v.string(),
    productImageUrl: v.optional(v.string()),
    productStorageId: v.optional(v.id("_storage")),
    avatarId: v.optional(v.string()),
    voiceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found. Please sign in again.");
    }

    if (user.suspended) {
      throw new Error("Your account is suspended. Contact support.");
    }

    if (user.credits < 1) {
      throw new Error("Insufficient credits. Please upgrade your plan or buy credits.");
    }

    return await ctx.db.insert("videos", {
      userId: user._id,
      title: args.title,
      description: args.description,
      productImageUrl: args.productImageUrl,
      productStorageId: args.productStorageId,
      avatarId: args.avatarId,
      voiceId: args.voiceId,
      status: "PENDING",
    });
  },
});

export const getById = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.videoId);
  },
});

export const getStatusForUser = query({
  args: { videoId: v.id("videos"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) return null;

    const video = await ctx.db.get(args.videoId);
    if (!video || video.userId !== user._id) return null;

    let playbackUrl = video.finalVideoUrl;
    if (video.finalStorageId) {
      const fresh = await ctx.storage.getUrl(video.finalStorageId);
      if (fresh) playbackUrl = fresh;
    }
    if (!playbackUrl && video.avatarVideoUrl) {
      playbackUrl = video.avatarVideoUrl;
    }

    return {
      _id: video._id,
      status: video.status,
      script: video.script,
      finalVideoUrl: video.finalVideoUrl,
      finalStorageId: video.finalStorageId,
      playbackUrl,
      avatarVideoUrl: video.avatarVideoUrl,
      heygenVideoId: video.heygenVideoId,
      errorMessage: video.errorMessage,
      title: video.title,
      pipelinePhase: video.pipelinePhase,
      pipelineProgress: video.pipelineProgress,
    };
  },
});

export const updateScript = mutation({
  args: {
    videoId: v.id("videos"),
    script: v.string(),
    avatarId: v.optional(v.string()),
    voiceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      script: args.script,
      status: "SCRIPT_GENERATED",
      errorMessage: undefined,
      ...(args.avatarId !== undefined && { avatarId: args.avatarId }),
      ...(args.voiceId !== undefined && { voiceId: args.voiceId }),
    });
  },
});

export const setStatus = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    heygenVideoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: args.status,
      ...(args.heygenVideoId !== undefined ? { heygenVideoId: args.heygenVideoId } : {}),
      ...(args.errorMessage !== undefined
        ? { errorMessage: args.errorMessage }
        : { errorMessage: undefined }),
    });
  },
});

export const updateAvatar = mutation({
  args: {
    videoId: v.id("videos"),
    avatarVideoUrl: v.string(),
    heygenVideoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      avatarVideoUrl: args.avatarVideoUrl,
      heygenVideoId: args.heygenVideoId,
      status: "AVATAR_GENERATED",
      errorMessage: undefined,
    });
  },
});

export const updateFinal = mutation({
  args: {
    videoId: v.id("videos"),
    finalVideoUrl: v.string(),
    finalStorageId: v.optional(v.id("_storage")),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      finalVideoUrl: args.finalVideoUrl,
      finalStorageId: args.finalStorageId,
      status: args.status,
      errorMessage: undefined,
    });
  },
});

export const updatePipelineProgress = mutation({
  args: {
    videoId: v.id("videos"),
    pipelinePhase: v.optional(v.string()),
    pipelineProgress: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      ...(args.pipelinePhase !== undefined
        ? { pipelinePhase: args.pipelinePhase }
        : {}),
      ...(args.pipelineProgress !== undefined
        ? { pipelineProgress: args.pipelineProgress }
        : {}),
    });
  },
});

export const markFailed = mutation({
  args: {
    videoId: v.id("videos"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: "FAILED",
      errorMessage: args.errorMessage,
    });
  },
});

export const remove = mutation({
  args: { videoId: v.id("videos"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");

    const video = await ctx.db.get(args.videoId);
    if (!video || video.userId !== user._id) {
      throw new Error("Video not found");
    }

    await ctx.db.delete(args.videoId);
  },
});

/** @deprecated Use updateFinal */
export const updateVideoUrlAndStatus = mutation({
  args: {
    videoId: v.id("videos"),
    finalVideoUrl: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      finalVideoUrl: args.finalVideoUrl,
      status: args.status,
    });
  },
});
