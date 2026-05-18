import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DEFAULT_PLAN, FREE_TIER_CREDITS } from "./constants";

const roleValidator = v.optional(v.union(v.literal("user"), v.literal("admin")));

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        ...(args.role !== undefined && { role: args.role }),
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      credits: FREE_TIER_CREDITS,
      plan: DEFAULT_PLAN,
      role: args.role ?? "user",
      suspended: false,
    });
  },
});

export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getUserWithVideos = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return null;

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const videosWithPlayback = await Promise.all(
      videos.map(async (video) => {
        let playbackUrl: string | undefined = video.finalVideoUrl;
        if (video.finalStorageId) {
          const fresh = await ctx.storage.getUrl(video.finalStorageId);
          if (fresh) playbackUrl = fresh;
        }
        if (!playbackUrl && video.avatarVideoUrl) {
          playbackUrl = video.avatarVideoUrl;
        }
        return { ...video, playbackUrl };
      })
    );

    return { ...user, videos: videosWithPlayback };
  },
});

export const updateCreditsAndPlan = mutation({
  args: {
    clerkId: v.string(),
    creditsToAdd: v.number(),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        credits: user.credits + args.creditsToAdd,
        ...(args.plan && { plan: args.plan }),
      });
    }
  },
});

export const decrementCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        credits: Math.max(0, user.credits - args.amount),
      });
    }
  },
});

export const ensureUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      if (args.role !== undefined && existing.role !== args.role) {
        await ctx.db.patch(existing._id, { role: args.role });
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      credits: FREE_TIER_CREDITS,
      plan: DEFAULT_PLAN,
      role: args.role ?? "user",
      suspended: false,
    });
  },
});

/** Keeps Convex user.role aligned with Clerk publicMetadata after login. */
export const syncClerkRole = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      const email =
        identity.email ?? `${identity.subject}@accounts.clerk.dev`;
      return await ctx.db.insert("users", {
        clerkId: identity.subject,
        email,
        name: identity.name,
        credits: FREE_TIER_CREDITS,
        plan: DEFAULT_PLAN,
        role: args.role,
        suspended: false,
      });
    }

    if (user.role !== args.role) {
      await ctx.db.patch(user._id, { role: args.role });
    }

    return user._id;
  },
});
