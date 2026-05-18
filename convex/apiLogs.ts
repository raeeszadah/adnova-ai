import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLog = mutation({
  args: {
    requestId: v.string(),
    apiType: v.string(),
    status: v.string(),
    processingTime: v.number(),
    userId: v.optional(v.id("users")),
    videoId: v.optional(v.id("videos")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("apiLogs", args);
  },
});
