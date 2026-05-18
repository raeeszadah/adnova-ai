import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { requireAdmin } from "../lib/requireAdmin";

export const listUsers = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const limit = args.limit ?? 100;
    let users = await ctx.db.query("users").order("desc").collect();

    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase();
      users = users.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.name?.toLowerCase().includes(q) ||
          u.clerkId?.toLowerCase().includes(q)
      );
    }

    const slice = users.slice(0, limit);

    return await Promise.all(
      slice.map(async (user) => {
        const videoCount = (
          await ctx.db
            .query("videos")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect()
        ).length;
        return { ...user, videoCount };
      })
    );
  },
});

export const getUserDetail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return { user, videos };
  },
});

async function writeAudit(
  ctx: MutationCtx,
  adminClerkId: string,
  action: string,
  targetUserId?: Id<"users">,
  details?: string
) {
  await ctx.db.insert("adminAuditLog", {
    adminClerkId,
    action,
    targetUserId,
    details,
  });
}

export const adminSetCredits = mutation({
  args: {
    userId: v.id("users"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const { adminUser } = await requireAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      credits: Math.max(0, Math.floor(args.credits)),
    });

    await writeAudit(
      ctx,
      adminUser.clerkId!,
      "SET_CREDITS",
      args.userId,
      `Credits set to ${args.credits} (was ${user.credits})`
    );
  },
});

export const adminAdjustCredits = mutation({
  args: {
    userId: v.id("users"),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const { adminUser } = await requireAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const next = Math.max(0, user.credits + args.delta);
    await ctx.db.patch(args.userId, { credits: next });

    await writeAudit(
      ctx,
      adminUser.clerkId!,
      "ADJUST_CREDITS",
      args.userId,
      `Delta ${args.delta} → ${next} credits`
    );
  },
});

export const adminSetPlan = mutation({
  args: {
    userId: v.id("users"),
    plan: v.string(),
  },
  handler: async (ctx, args) => {
    const { adminUser } = await requireAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, { plan: args.plan });

    await writeAudit(
      ctx,
      adminUser.clerkId!,
      "SET_PLAN",
      args.userId,
      `Plan set to ${args.plan}`
    );
  },
});

export const adminSetSuspended = mutation({
  args: {
    userId: v.id("users"),
    suspended: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { adminUser } = await requireAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    if (user.role === "admin") {
      throw new Error("Cannot suspend an admin account");
    }

    await ctx.db.patch(args.userId, { suspended: args.suspended });

    await writeAudit(
      ctx,
      adminUser.clerkId!,
      args.suspended ? "SUSPEND_USER" : "UNSUSPEND_USER",
      args.userId,
      user.email
    );
  },
});
