import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPayment = mutation({
  args: {
    clerkId: v.string(),
    stripeId: v.string(),
    plan: v.string(),
    amount: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) {
      return await ctx.db.insert("payments", {
        userId: user._id,
        stripeId: args.stripeId,
        plan: args.plan,
        amount: args.amount,
        status: args.status,
      });
    }
  },
});
