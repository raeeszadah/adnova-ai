import { query } from "../_generated/server";
import { requireAdmin } from "../lib/requireAdmin";

const DAY_MS = 24 * 60 * 60 * 1000;

export const getPlatformOverview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const users = await ctx.db.query("users").collect();
    const videos = await ctx.db.query("videos").collect();
    const apiLogs = await ctx.db.query("apiLogs").collect();
    const payments = await ctx.db.query("payments").collect();
    const auditLogs = await ctx.db
      .query("adminAuditLog")
      .order("desc")
      .take(20);

    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const activeUsers = users.filter((u) => !u.suspended).length;
    const suspendedUsers = users.filter((u) => u.suspended).length;

    const totalVideos = videos.length;
    const completedVideos = videos.filter((v) => v.status === "COMPLETED").length;
    const failedVideos = videos.filter(
      (v) => v.status === "FAILED" || v.errorMessage
    ).length;
    const processingVideos = videos.filter((v) =>
      ["PENDING", "PROCESSING_AVATAR", "COMPOSING"].includes(v.status)
    ).length;

    const videosToday = videos.filter(
      (v) => now - v._creationTime < DAY_MS
    ).length;
    const videosWeek = videos.filter(
      (v) => now - v._creationTime < 7 * DAY_MS
    ).length;
    const videosMonth = videos.filter(
      (v) => now - v._creationTime < 30 * DAY_MS
    ).length;

    const apiFailures = apiLogs.filter((l) => l.status === "FAILED").length;
    const apiSuccess = apiLogs.filter((l) => l.status === "SUCCESS").length;

    const apiByType: Record<string, number> = {};
    for (const log of apiLogs) {
      apiByType[log.apiType] = (apiByType[log.apiType] ?? 0) + 1;
    }

    const totalCreditsRemaining = users.reduce((sum, u) => sum + u.credits, 0);
    const freeUsers = users.filter((u) => (u.plan ?? "FREE") === "FREE").length;
    const proUsers = users.filter((u) => u.plan === "PRO").length;

    const revenueTotal = payments
      .filter((p) => p.status === "SUCCESS" || p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const recentActivity = [
      ...auditLogs.map((a) => ({
        type: "admin" as const,
        at: a._creationTime,
        label: a.action,
        details: a.details,
      })),
      ...apiLogs
        .slice(-15)
        .reverse()
        .map((l) => ({
          type: "api" as const,
          at: l._creationTime,
          label: `${l.apiType} — ${l.status}`,
          details: l.message,
        })),
    ]
      .sort((a, b) => b.at - a.at)
      .slice(0, 25);

    return {
      totalUsers,
      adminCount,
      activeUsers,
      suspendedUsers,
      totalVideos,
      completedVideos,
      failedVideos,
      processingVideos,
      videosToday,
      videosWeek,
      videosMonth,
      apiFailures,
      apiSuccess,
      apiByType,
      totalCreditsRemaining,
      freeUsers,
      proUsers,
      revenueTotal,
      recentActivity,
    };
  },
});
