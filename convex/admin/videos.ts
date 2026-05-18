import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/requireAdmin";

export const listAllVideos = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const limit = args.limit ?? 80;
    let videos = await ctx.db.query("videos").order("desc").collect();

    if (args.status) {
      videos = videos.filter((v) => v.status === args.status);
    }

    return await Promise.all(
      videos.slice(0, limit).map(async (video) => {
        const user = await ctx.db.get(video.userId);
        return {
          ...video,
          userEmail: user?.email,
          userName: user?.name,
        };
      })
    );
  },
});
