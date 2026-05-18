import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../lib/requireAdmin";

export const listApiLogs = query({
  args: {
    apiType: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const limit = args.limit ?? 100;
    let logs = await ctx.db.query("apiLogs").order("desc").collect();

    if (args.apiType) {
      logs = logs.filter((l) => l.apiType === args.apiType);
    }
    if (args.status) {
      logs = logs.filter((l) => l.status === args.status);
    }

    return logs.slice(0, limit);
  },
});

export const getApiAnalytics = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const logs = await ctx.db.query("apiLogs").collect();
    const byType: Record<string, { total: number; failed: number; avgMs: number }> =
      {};

    for (const log of logs) {
      if (!byType[log.apiType]) {
        byType[log.apiType] = { total: 0, failed: 0, avgMs: 0 };
      }
      const entry = byType[log.apiType];
      entry.total += 1;
      if (log.status === "FAILED") entry.failed += 1;
      entry.avgMs += log.processingTime;
    }

    for (const key of Object.keys(byType)) {
      const entry = byType[key];
      entry.avgMs = entry.total > 0 ? Math.round(entry.avgMs / entry.total) : 0;
    }

    return {
      total: logs.length,
      failed: logs.filter((l) => l.status === "FAILED").length,
      byType,
    };
  },
});
